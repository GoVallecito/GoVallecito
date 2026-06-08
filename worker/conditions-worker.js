/**
 * GoVallecito conditions pipeline — Cloudflare Worker
 * Cron every 15 min: fetch all sources, normalize to conditions.json, write to KV.
 * Also serves GET /data/conditions.json from KV.
 *
 * STATUS: all six sources implemented end-to-end from docs/DATA-SOURCES.md, plus
 * the editor-controlled fire-restriction stage (data/restrictions.json) folded
 * into the Alert tile. Each source is wrapped in `safe()` so one failure can
 * never blank the page — the previous good value is retained and marked stale.
 *
 * NOT YET DEPLOYED (needs Cloudflare + wrangler login — intentionally deferred):
 *   wrangler kv namespace create CONDITIONS
 *   wrangler secret put WU_API_KEY        # free PWS key from the marina's WU account
 *   wrangler secret put WU_STATION_ID     # e.g. KCOBAYFI12  (can also be a plain var)
 *   wrangler secret put CDOT_KEY          # only if COtrip's feed requires one
 *   wrangler deploy
 *
 * wrangler.toml binds: KV namespace `CONDITIONS`; vars/secrets `WU_API_KEY`,
 * `WU_STATION_ID`, `ACCUWEATHER_KEY`, `CDOT_KEY`, `CDOT_ENDPOINT`, `AIRNOW_KEY`,
 * `RESTRICTIONS_URL`.
 */

const LAT = 37.3361, LON = -107.5617;
const CAPACITY_AF = 129700;          // Vallecito Reservoir capacity (confirmed)
const RADIUS_M = 80467;              // 50 mi in meters (fire search radius)
const UA = "GoVallecito.com (contact@govallecito.com)"; // NWS requires a descriptive UA
const KV_KEY = "conditions";
const WEEKLY_KEY = "weekly-water";
const JSON_CORS = { "content-type": "application/json", "cache-control": "max-age=300",
                    "access-control-allow-origin": "*" };

export default {
  async scheduled(event, env, ctx) {
    // Two crons (see wrangler.toml): the 15-min one refreshes conditions; the
    // Sunday one regenerates the weekly "This week on the water" summary.
    if (event.cron === "0 13 * * SUN") ctx.waitUntil(generateWeeklyWater(env));
    else ctx.waitUntil(refresh(env));
  },
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/data/conditions.json") {
      const cached = await env.CONDITIONS.get(KV_KEY);
      return new Response(cached || JSON.stringify(fallback()), { headers: JSON_CORS });
    }
    if (url.pathname === "/data/weekly-water.json") {
      const cached = await env.CONDITIONS.get(WEEKLY_KEY);
      return new Response(cached || JSON.stringify({ auto: true, bullets: [], updated: null }), { headers: JSON_CORS });
    }
    if (url.pathname === "/__refresh") {           // manual trigger for testing
      const out = await refresh(env);
      return new Response(JSON.stringify(out, null, 2), { headers: { "content-type": "application/json" } });
    }
    if (url.pathname === "/__weekly") {             // manual trigger to seed/test the weekly summary
      const out = await generateWeeklyWater(env);
      return new Response(JSON.stringify(out, null, 2), { headers: { "content-type": "application/json" } });
    }
    return new Response("Not found", { status: 404 });
  }
};

/* ---------- WEEKLY "This week on the water" (Sunday cron) ----------
 * Composes a short, honest summary from the LIVE conditions KV + a static 12-month
 * fishing-calendar table (mirrors fishing.html's calendar). No invented data: every
 * bullet derives from a live feed or the month table; lake trend is computed against
 * the previous weekly snapshot stored alongside. Served at /data/weekly-water.json. */
const MONTHLY_BITE = [
  "ice fishing — jig for trout & perch through the ice (where ice is safe)",          // Jan
  "ice fishing; the local ice-fishing tournament is late this month",                  // Feb
  "late ice transitioning to open water — be cautious on the ice",                     // Mar
  "ice-out — pike and rainbow trout move into the shallows",                           // Apr
  "pike, trout, and early walleye as spring runoff builds",                            // May
  "kokanee trolling starts; smallmouth and trout too — fish early before the wind",    // Jun
  "kokanee, smallmouth, and trout — dawn starts; watch afternoon thunderstorms",       // Jul
  "kokanee, smallmouth, and low-light walleye",                                        // Aug
  "browns, trout, and pike — the best all-around fishing of the year",                 // Sep
  "browns, trout, and pike with great fall color",                                     // Oct
  "kokanee snagging opens Nov 15 in the Grimes Creek inlet stretch; ice forming late", // Nov
  "kokanee snagging through Dec 31; first-ice jigging where the ice is safe"           // Dec
];

function regsReminder(m) {            // m = 0-based month
  if (m === 8 || m === 9) return "Reminder: the Grimes Creek inlet is closed to fishing Sep 1–Nov 14.";
  if (m === 10 || m === 11) return "Reminder: kokanee snagging is open in the Grimes Creek inlet stretch (Nov 15–Dec 31).";
  return "Always confirm current limits with Colorado Parks & Wildlife before you fish.";
}

async function generateWeeklyWater(env) {
  let cond = {}, prev = {};
  try { cond = JSON.parse(await env.CONDITIONS.get(KV_KEY)) || {}; } catch {}
  try { prev = JSON.parse(await env.CONDITIONS.get(WEEKLY_KEY)) || {}; } catch {}
  const now = new Date();
  const lake = cond.lake || {}, stream = cond.stream || {}, weather = cond.weather || {};
  const m = now.getUTCMonth();
  const bullets = [];

  // Lake level + week-over-week trend (vs the snapshot stored last Sunday).
  if (lake.pct != null || lake.elevationFt != null) {
    let s = "Lake" + (lake.pct != null ? ` ${lake.pct}%` : "") +
            (lake.elevationFt != null ? ` · ${lake.elevationFt.toLocaleString()} ft` : "");
    if (prev.lakeElev != null && lake.elevationFt != null) {
      const d = lake.elevationFt - prev.lakeElev;
      s += Math.abs(d) < 0.5 ? " (holding steady this week)"
         : (d > 0 ? ` (up ${Math.abs(d).toFixed(1)} ft this week)` : ` (down ${Math.abs(d).toFixed(1)} ft this week)`);
    }
    if (lake.stale) s += " — reading may be a few days old";
    bullets.push(s);
  }
  // Inflows.
  if (stream.combinedCfs != null) bullets.push(`Inflow about ${stream.combinedCfs} cfs (Vallecito Creek + Pine River)`);
  if (stream.outflow && stream.outflow.cfs != null) bullets.push(`Dam outflow about ${stream.outflow.cfs} cfs to the Pine River valley` + (stream.outflow.stale ? " (reading may be a few days old)" : ""));
  // Weather outlook (next forecast day from NWS).
  if (Array.isArray(weather.forecast5) && weather.forecast5[0]) {
    const f = weather.forecast5[0];
    if (f.hi != null || f.lo != null) bullets.push(`Outlook: ${f.day || "today"} ${f.hi != null ? "high ~" + f.hi + "°" : ""}${f.lo != null ? ", low ~" + f.lo + "°" : ""}`.trim());
  }
  // What's biting (static month table).
  bullets.push(`What's biting: ${MONTHLY_BITE[m]}`);
  // Seasonal regs reminder.
  bullets.push(regsReminder(m));

  const out = {
    auto: true,
    updated: now.toISOString(),
    weekOf: now.toLocaleDateString("en-US", { timeZone: "America/Denver", month: "long", day: "numeric", year: "numeric" }),
    summary: "Auto-generated from this week's live gauges and the seasonal calendar.",
    bullets,
    lakeElev: lake.elevationFt != null ? lake.elevationFt : (prev.lakeElev != null ? prev.lakeElev : null)
  };
  await env.CONDITIONS.put(WEEKLY_KEY, JSON.stringify(out));
  return out;
}

async function refresh(env) {
  // Keep last-good values so a single failure never blanks the page.
  let prev = {};
  try { prev = JSON.parse(await env.CONDITIONS.get(KV_KEY)) || {}; } catch {}

  const [weather, lake, stream, alertsRaw, fires, road, restrictions] = await Promise.all([
    safe(() => getWeather(env), prev.weather),
    safe(() => getLake(env),    prev.lake),
    safe(() => getStreams(env), prev.stream),
    safe(() => getAlerts(env),  prev.alert),
    safe(() => getFires(env),   prev.fires),
    safe(() => getRoads(env),   prev.road),
    getRestrictions(env).catch(() => ({ stage: "none" })),
  ]);

  // Barometric trend (for anglers): compare to the prior cached pressure reading.
  if (weather && weather.pressureInHg != null && prev.weather && prev.weather.pressureInHg != null) {
    const dlt = weather.pressureInHg - prev.weather.pressureInHg;
    weather.pressureTrend = Math.abs(dlt) < 0.02 ? "steady" : (dlt > 0 ? "rising" : "falling");
    weather.pressureTrendDelta = Math.round(dlt * 100) / 100;
  }

  // Dam outflow (CWMS daily series, cms→cfs) — its own last-good so a daily-series
  // gap never blanks the streamflow tile. Attaches under stream.outflow.
  if (stream && stream.status !== "error") {
    const outflow = await safe(() => getOutflow(), prev.stream && prev.stream.outflow);
    if (outflow && outflow.cfs != null) stream.outflow = outflow;
  }

  const alert = mergeRestrictionStage(alertsRaw, restrictions);

  const now = new Date();
  const out = {
    updated: now.toISOString(),
    updatedFriendly: friendly(now),
    weather, lake, stream, alert, fires, road,
    restriction: restrictions
  };
  await env.CONDITIONS.put(KV_KEY, JSON.stringify(out));
  return out;
}

// Wrap a source: on failure, fall back to previous value flagged stale.
async function safe(fn, prevVal) {
  try { return await fn(); }
  catch (e) {
    return prevVal ? { ...prevVal, stale: true, status: "warn" }
                   : { status: "error", stale: true };
  }
}

/* ---------- LAKE: USACE CWMS (primary) -> USBR RISE (fallback) ----------
 * NOTE: USGS gauge 09353000 is DEAD — its "latest" instantaneous value is dated
 * 2012-12-31, so it reports a 13-year-old number (the false "31% full"). We use
 * sources that are actually current, and guard with a freshness + sanity check
 * so a stale-but-not-erroring feed can never sneak through again.
 * See docs/DATA-SOURCES.md §5. */
const LAKE_MAX_AGE_MS = 45 * 864e5;   // reject any reading older than ~45 days (kills the 2012 trap)
const LAKE_STALE_MS   = 3 * 864e5;    // flag stale if older than 72h (USBR daily revision lags 2–3 days; 48h would false-flag)
const ELEV_MIN = 7500, ELEV_MAX = 7700; // sane Vallecito pool-elevation band (full pool 7665 ft)

async function getLake() {
  let r = null, source = null;
  try { const c = await lakeFromCwms(); if (lakeOk(c)) { r = c; source = "USACE CWMS (USBR SPK)"; } } catch (e) { console.error("CWMS lake:", e.message); }
  if (!r) { try { const u = await lakeFromRise(); if (lakeOk(u)) { r = u; source = "USBR RISE"; } } catch (e) { console.error("RISE lake:", e.message); } }
  if (!r) throw new Error("no current lake source (USGS 09353000 is stale 2012; CWMS+RISE unavailable)");

  const storageAf  = r.storageAf  != null ? Math.round(r.storageAf)  : null;
  const elevationFt = r.elevationFt != null ? Math.round(r.elevationFt) : null;
  const pct = storageAf != null ? Math.round((storageAf / CAPACITY_AF) * 100) : null;
  const out = {
    pct, storageAf, capacityAf: CAPACITY_AF, elevationFt,
    asOf: new Date(r.t).toISOString(),
    source,
    status: "ok",
    stale: (Date.now() - r.t) > LAKE_STALE_MS
  };
  // Elevation-only case (no storage): report elevation + "near full" note; an
  // elevation->storage curve can convert to % later.
  if (pct == null && elevationFt != null) out.note = "near full (elevation only; % pending storage curve)";
  return out;
}

// Accept a reading only if it's recent AND physically plausible for Vallecito.
function lakeOk(r) {
  if (!r || r.t == null) return false;
  if (Date.now() - r.t > LAKE_MAX_AGE_MS) return false;            // not 2012
  if (r.elevationFt != null && (r.elevationFt < ELEV_MIN || r.elevationFt > ELEV_MAX)) return false; // not another reservoir
  if (r.storageAf != null && (r.storageAf < 0 || r.storageAf > CAPACITY_AF * 1.1)) return false;
  return r.storageAf != null || r.elevationFt != null;
}

// USACE CWMS Data API, district SPK — daily pool storage (ac-ft) + elevation (ft).
async function lakeFromCwms() {
  const begin = new Date(Date.now() - 40 * 864e5).toISOString();
  const end   = new Date(Date.now() + 864e5).toISOString();
  async function ts(name) {
    const u = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${encodeURIComponent(name)}&office=SPK&begin=${begin}&end=${end}`;
    const j = await getJson(u, { "Accept": "application/json;version=2" });
    const vals = (j.values || []).filter(v => v[1] != null);   // [epochMs, value, quality]
    if (!vals.length) return null;
    const last = vals[vals.length - 1];
    return { value: last[1], t: last[0] };
  }
  const [s, e] = await Promise.all([
    ts("Vallecito.Stor.Inst.~1Day.0.Rev-USBRSLC"),
    ts("Vallecito.Elev.Inst.~1Day.0.Raw-USBRSLC")
  ]);
  const t = Math.max(s ? s.t : 0, e ? e.t : 0) || null;
  return { storageAf: s ? s.value : null, elevationFt: e ? e.value : null, t };
}

// USBR RISE fallback — resolve Vallecito's storage/elevation items FROM record
// 2469's relationships (so we can't grab the wrong reservoir), then read latest.
async function lakeFromRise() {
  const acc = { "Accept": "application/vnd.api+json" };
  const rec = await getJson("https://data.usbr.gov/rise/api/catalog-record/2469", acc);
  const rel = rec.data?.relationships?.catalogItems?.data || [];
  const ids = rel.map(x => String(x.id).replace(/\/+$/, "").split("/").pop());
  let storId = null, elevId = null;
  for (const id of ids) {
    if (storId && elevId) break;
    const it = await getJson(`https://data.usbr.gov/rise/api/catalog-item/${id}`, acc);
    const p = (it.data?.attributes?.parameterName || "").toLowerCase();
    const unit = (it.data?.attributes?.parameterUnit || "").toLowerCase();
    if (!storId && p.includes("storage") && unit === "af") storId = id;
    if (!elevId && p.includes("elevation") && unit === "ft") elevId = id;
  }
  async function latest(id) {
    if (!id) return null;
    const r = await getJson(`https://data.usbr.gov/rise/api/result?itemId=${id}&itemsPerPage=1&order%5BdateTime%5D=desc`, acc);
    const row = r.data?.[0]?.attributes;
    if (!row) return null;
    return { value: parseFloat(row.result), t: Date.parse(row.dateTime) };
  }
  const [s, e] = await Promise.all([latest(storId), latest(elevId)]);
  const t = Math.max(s ? s.t : 0, e ? e.t : 0) || null;
  return { storageAf: s ? s.value : null, elevationFt: e ? e.value : null, t };
}

/* ---------- STREAMS: USGS 09352900 + 09352800 (keyless) ---------- */
async function getStreams() {
  const u = "https://waterservices.usgs.gov/nwis/iv/?sites=09352900,09352800&format=json&parameterCd=00060";
  const j = await getJson(u);
  const names = { "09352900": "Vallecito Creek", "09352800": "Pine River" };
  const gauges = (j.value?.timeSeries || []).map(t => {
    const id = t.sourceInfo.siteCode[0].value;
    const vals = t.values?.[0]?.value || [];
    const last = vals[vals.length - 1] || {};
    const cfs = parseFloat(last.value);
    return { id, name: names[id] || id, cfs: isNaN(cfs) ? null : Math.round(cfs),
             asOf: last.dateTime ? new Date(last.dateTime).toISOString() : null };
  });
  const combinedCfs = gauges.reduce((a, g) => a + (g.cfs || 0), 0);
  const times = gauges.map(g => g.asOf).filter(Boolean).map(s => Date.parse(s)).filter(n => !isNaN(n));
  const asOf = times.length ? new Date(Math.max.apply(null, times)).toISOString() : null;
  return { combinedCfs, gauges, asOf, status: "ok", stale: false };
}

/* ---------- DAM OUTFLOW: USACE CWMS daily release (USBR SLC) ----------
 * Series = Vallecito.Flow-Res Out.Ave.~1Day.1Day.Raw-USBRSLC (daily dam release,
 * 2–3 day lag like the lake storage series). The catalog lists the stored unit as
 * SI (cms), but the data API returns English by default for office SPK — it comes
 * back already in cfs (the lake path likewise reads ac-ft/ft un-converted). So we
 * read the response's `units` and convert cms→cfs (×35.3147) ONLY if it's SI.
 * Sanity band 0–5,000 cfs; flag stale past 72h (LAKE_STALE_MS). */
async function getOutflow() {
  const begin = new Date(Date.now() - 40 * 864e5).toISOString();
  const end   = new Date(Date.now() + 864e5).toISOString();
  const name  = "Vallecito.Flow-Res Out.Ave.~1Day.1Day.Raw-USBRSLC";
  const u = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${encodeURIComponent(name)}&office=SPK&begin=${begin}&end=${end}`;
  const j = await getJson(u, { "Accept": "application/json;version=2" });
  const vals = (j.values || []).filter(v => v[1] != null);
  if (!vals.length) throw new Error("no CWMS outflow (Flow-Res Out) data");
  const last = vals[vals.length - 1];
  const units = String(j.units || "").toLowerCase();
  const isSI = units === "cms" || units === "m3/s" || units === "cumecs";
  const cfs = Math.round(isSI ? last[1] * 35.3147 : last[1]);
  if (!(cfs >= 0 && cfs <= 5000)) throw new Error("outflow out of sane band: " + cfs + " (units=" + units + ")");
  const stale = (Date.now() - last[0]) > LAKE_STALE_MS;
  return { cfs, asOf: new Date(last[0]).toISOString(), source: "USACE CWMS (USBR SLC)", stale };
}

/* ---------- ALERTS + RED FLAG: NWS (keyless) ---------- */
async function getAlerts() {
  const u = `https://api.weather.gov/alerts/active?point=${LAT},${LON}`;
  const j = await getJson(u, { "Accept": "application/geo+json" });
  const items = (j.features || []).map(f => ({
    event: f.properties.event,
    headline: f.properties.headline,
    ends: f.properties.ends
  }));
  const names = items.map(i => i.event);
  const redFlag = names.some(e => /red flag/i.test(e));
  const fireWatch = names.some(e => /fire weather watch/i.test(e));
  const otherWatch = names.some(e => /flood|winter storm|air quality/i.test(e));

  let level = "ok", title = "All clear",
      msg = "No red-flag warnings or fire restrictions in effect.";
  if (redFlag) { level = "danger"; title = "Red Flag Warning"; msg = headlineFor(items, /red flag/i) || names.join(" · "); }
  else if (fireWatch) { level = "warn"; title = "Fire Weather Watch"; msg = headlineFor(items, /fire weather/i) || names.join(" · "); }
  else if (otherWatch) { level = "warn"; title = names[0]; msg = names.join(" · "); }

  // fireRestrictionStage is filled by mergeRestrictionStage() in refresh().
  return { level, title, msg, redFlag, fireRestrictionStage: "none", items, status: "ok" };
}

/* ---------- WEATHER: WU PWS primary, NWS fallback + 5-day ---------- */
async function getWeather(env) {
  let cur = null, source = "", sourceType = "";

  // PRIMARY: Weather Underground PWS (Vallecito Reservoir station) — needs free
  // key + station id. Maps every field; undefined fields drop out of the JSON.
  if (env.WU_API_KEY && env.WU_STATION_ID) {
    try {
      const u = `https://api.weather.com/v2/pws/observations/current?stationId=${env.WU_STATION_ID}&format=json&units=e&apiKey=${env.WU_API_KEY}`;
      const j = await getJson(u);
      const o = j.observations?.[0];
      // Freshness guard: only trust the PWS if its observation is recent (≤90 min),
      // so an offline/stale station (KCOBAYFI57 was offline when checked) never
      // shows old numbers as "now" — fall back to NWS instead.
      const obsMs = o ? (o.epoch ? o.epoch * 1000 : (o.obsTimeUtc ? Date.parse(o.obsTimeUtc) : null)) : null;
      const fresh = obsMs != null && (Date.now() - obsMs) <= 90 * 60 * 1000;
      if (o && fresh) {
        const im = o.imperial || {};
        let feels = im.temp;
        if (im.heatIndex != null && im.temp >= 70) feels = im.heatIndex;       // heat index when warm
        else if (im.windChill != null && im.temp <= 50) feels = im.windChill;  // wind chill when cold
        cur = {
          tempF: round(im.temp), feelsLikeF: round(feels), dewpointF: round(im.dewpt),
          humidity: round(o.humidity), windMph: round(im.windSpeed), windGustMph: round(im.windGust),
          windDir: degToCompass(o.winddir), pressureInHg: r2(im.pressure),
          precipRateIn: im.precipRate, precipTotalIn: im.precipTotal,
          uv: o.uv, solarWm2: o.solarRadiation, stationElevFt: round(im.elev),
          obsTime: o.obsTimeUtc || o.obsTimeLocal, desc: ""
        };
        source = "Marina weather station";
        sourceType = "pws";
      }
      // else: stale/offline → leave cur null so the NWS fallback runs.
    } catch { /* fall through to NWS */ }
  }

  // NWS forecast (keyless) — always used for the 5-day + today's hi/lo.
  const point = await getJson(`https://api.weather.gov/points/${LAT},${LON}`, { "User-Agent": UA });
  const fc = await getJson(point.properties.forecast, { "User-Agent": UA });
  const periods = fc.properties?.periods || [];
  const forecast5 = build5Day(periods);

  // FALLBACK current obs from the nearest NWS station, if WU is unavailable.
  // NWS reports SI with a per-field unitCode — convert with unit-aware helpers
  // (wind is km/h, temps °C, pressure Pa, visibility m). Omit fields it nulls.
  if (!cur) {
    try {
      const stations = await getJson(point.properties.observationStations, { "User-Agent": UA });
      const stId = stations.features?.[0]?.properties?.stationIdentifier;
      const obs = await getJson(`https://api.weather.gov/stations/${stId}/observations/latest`, { "User-Agent": UA });
      const p = obs.properties || {};
      const feels = (p.heatIndex && p.heatIndex.value != null) ? p.heatIndex
                  : (p.windChill && p.windChill.value != null) ? p.windChill : p.temperature;
      cur = {
        tempF: nwsF(p.temperature), feelsLikeF: nwsF(feels), dewpointF: nwsF(p.dewpoint),
        desc: p.textDescription || "", windMph: nwsWind(p.windSpeed), windGustMph: nwsWind(p.windGust),
        windDir: degToCompass(p.windDirection?.value), humidity: round(p.relativeHumidity?.value),
        pressureInHg: nwsInHg(p.barometricPressure), visibilityMi: nwsMi(p.visibility),
        obsTime: p.timestamp
      };
      source = "National Weather Service";
      sourceType = "nws";
    } catch {
      cur = { tempF: null, desc: "", windMph: null, windDir: "", humidity: null };
      source = "National Weather Service";
      sourceType = "nws";
    }
  }
  if (!cur.desc) cur.desc = periods[0]?.shortForecast || "";

  return {
    tempF: cur.tempF, feelsLikeF: cur.feelsLikeF, dewpointF: cur.dewpointF,
    desc: cur.desc, windMph: cur.windMph, windGustMph: cur.windGustMph, windDir: cur.windDir,
    humidity: cur.humidity, pressureInHg: cur.pressureInHg, visibilityMi: cur.visibilityMi,
    precipRateIn: cur.precipRateIn, precipTotalIn: cur.precipTotalIn, uv: cur.uv,
    solarWm2: cur.solarWm2, stationElevFt: cur.stationElevFt, obsTime: cur.obsTime,
    highF: forecast5[0]?.hi ?? null, lowF: forecast5[0]?.lo ?? null,
    source, sourceType, forecast5, status: "ok", stale: false
  };
}

function build5Day(periods) {
  const days = [];
  for (const p of periods) {
    const day = shortDay(p.startTime);
    let e = days.find(d => d.day === day);
    if (!e) { e = { day, hi: null, lo: null, icon: iconFor(p.shortForecast) }; days.push(e); }
    if (p.isDaytime) e.hi = p.temperature; else e.lo = p.temperature;
  }
  return days.slice(0, 5);
}

/* ---------- FIRES: NIFC WFIGS within 50 mi (keyless ArcGIS) ---------- */
async function getFires() {
  const base = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/WFIGS_Incident_Locations_Current/FeatureServer/0/query";
  const params = new URLSearchParams({
    where: "1=1", outFields: "IncidentName,DailyAcres,POOState",
    geometry: `${LON},${LAT}`, geometryType: "esriGeometryPoint", inSR: "4326",
    distance: String(RADIUS_M), units: "esriSRUnit_Meter",
    spatialRel: "esriSpatialRelIntersects", returnGeometry: "true", outSR: "4326", f: "json"
  });
  const j = await getJson(`${base}?${params}`);
  const feats = j.features || [];
  let nearestName = null, nearestMiles = Infinity;
  for (const ft of feats) {
    const g = ft.geometry;
    if (!g) continue;
    const mi = haversineMiles(LAT, LON, g.y, g.x);
    if (mi < nearestMiles) { nearestMiles = mi; nearestName = ft.attributes?.IncidentName || null; }
  }
  const count = feats.length;
  const msg = count === 0 ? "No active incidents within 50 mi"
                          : `${count} active incident${count === 1 ? "" : "s"} within 50 mi`;
  return { count, nearestName, nearestMiles: isFinite(nearestMiles) ? Math.round(nearestMiles) : null,
           msg, status: "ok", stale: false };
}

/* ---------- ROADS: CDOT / COtrip (best-effort, honestly framed) ----------
 * The COtrip v1 feed (auth = COTRIP_KEY query apiKey) is capped at ~100 statewide
 * road-condition segments and its pagination is non-functional (constant cursor,
 * params ignored), so we can't enumerate everything. Vallecito's true access road
 * (US 160 Durango<->Bayfield, then CR 501) is NOT a CDOT reporting segment, and
 * CR 501 is a county road CDOT never covers. So this is an HONEST best-effort: we
 * surface the SW-Colorado approach segments CDOT *can* see (US 550 near Durango,
 * US 160) plus any active incidents on US 160 / US 550, and we tell users the final
 * CR 501 leg isn't CDOT-reported (use the live cameras). A geographic box keeps us
 * to the Durango corner regardless of feed ordering. Cameras are a separate COtrip
 * subscription not on this key (404), so the camera tiles stay deep-links. */
// Tight Durango-access corridor, checked on a feature's OWN coordinate (not route
// name alone): US 550 just south of Purgatory/Hermosa down to Durango; US 160 from
// west Durango east to ~Chimney Rock. Keeps Molas Pass + Pagosa→South Fork out.
function inCorridor(routeName, lat, lon) {
  if (lat == null || lon == null || isNaN(lat) || isNaN(lon)) return false;
  const rn = (routeName || "").toUpperCase();   // matches "US 550", "US-550", "US550", "US-550N"
  if (/US[\s-]?550/.test(rn)) return lat >= 37.20 && lat <= 37.46 && lon >= -108.00 && lon <= -107.70;
  if (/US[\s-]?160/.test(rn)) return lat >= 37.15 && lat <= 37.45 && lon >= -107.95 && lon <= -107.00;
  return false;
}
const ROAD_SCOPE = "Durango-area state highways (US 550 · US 160); CR 501 isn't covered by CDOT.";
const ROAD_NOTE  = "The final leg (CR 501) isn't CDOT-reported — check the live cameras or dial 511.";

async function getRoads(env) {
  const key = env.COTRIP_KEY;
  if (!key) {
    return { level: "ok", title: "Clear", status: "unconfigured", scope: ROAD_SCOPE,
             msg: "Live CDOT status unavailable. Check the cameras or dial 511.", note: ROAD_NOTE };
  }
  const base = "https://data.cotrip.org/api/v1/";

  // --- incidents on US 160 / US 550 in our corner (the actionable signal) ---
  let incidents = [];
  try {
    const ij = await getJson(`${base}incidents?apiKey=${encodeURIComponent(key)}`);
    incidents = (ij.features || []).filter(f => {
      const p = f.properties || {};
      if (!/US-?160|US-?550/i.test(p.routeName || "")) return false;
      const g = f.geometry; let lat = null, lon = null;
      if (g && g.coordinates) {
        const c = Array.isArray(g.coordinates[0]) ? g.coordinates[0] : g.coordinates;
        if (Array.isArray(c)) { lon = c[0]; lat = c[1]; }
      }
      return inCorridor(p.routeName, lat, lon);   // tight geo box, not region/name alone
    }).map(f => {
      const p = f.properties;
      // Real closure = actual lane closures (count > 0 / closed lane types), or the
      // traveler text says the road is closed. NOTE: don't stringify laneImpacts —
      // its field NAMES ("laneClosures","closedLaneTypes") contain "closed" and would
      // false-positive on every incident.
      const laneClosed = (p.laneImpacts || []).some(li =>
        (parseInt(li.laneClosures, 10) || 0) > 0 || (li.closedLaneTypes || []).length > 0);
      const closed = laneClosed || /\bclosed\b|\bclosure\b|road closed/i.test(p.travelerInformationMessage || "");
      return { route: p.routeName, severity: (p.severity || "").toLowerCase(),
               type: p.type, closed, msg: p.travelerInformationMessage || p.type || "" };
    });
  } catch (e) { console.error("CDOT incidents:", e.message); }

  // --- surface conditions on US 160 / US 550 segments in our corner ---
  let segments = [];
  try {
    const rj = await getJson(`${base}roadConditions?apiKey=${encodeURIComponent(key)}`);
    segments = (rj.features || []).filter(f => {
      const p = f.properties || {};
      if (!/^US 160$|^US 550$/.test(p.routeName || "")) return false;
      const midLat = (p.primaryLatitude + p.secondaryLatitude) / 2;
      const midLon = (p.primaryLongitude + p.secondaryLongitude) / 2;
      return inCorridor(p.routeName, p.primaryLatitude, p.primaryLongitude)
          || inCorridor(p.routeName, p.secondaryLatitude, p.secondaryLongitude)
          || inCorridor(p.routeName, midLat, midLon);
    }).map(f => {
      const p = f.properties;
      // pick the first real surface condition (skip "forecast text"/"no data" fillers)
      const cond = (p.currentConditions || [])
        .map(c => (c.conditionDescription || "").toLowerCase())
        .find(d => d && !/forecast|no data/.test(d)) || null;
      return { route: p.routeName, name: p.name, cond };
    });
  } catch (e) { console.error("CDOT roadConditions:", e.message); }

  // --- derive level / title / message ---
  const sev = s => (s === "major" || s === "severe") ? 2 : (s ? 1 : 0);
  const anyClosed = incidents.some(i => i.closed) || segments.some(s => /closed|closure/.test(s.cond || ""));
  const anyBad    = segments.some(s => /snow|ice|icy|pack|slush|wet/.test(s.cond || ""));
  const worstInc  = incidents.reduce((m, i) => Math.max(m, sev(i.severity)), 0);

  let level = "ok", title = "Clear";
  if (anyClosed || worstInc >= 2)          { level = "danger"; title = "Closure / major"; }
  else if (incidents.length || anyBad)     { level = "warn";   title = "Caution"; }

  let msg;
  if (incidents.length) {
    const top = incidents.slice().sort((a, b) => (b.closed - a.closed) || (sev(b.severity) - sev(a.severity)))[0];
    msg = shorten(top.msg, 140);
    if (incidents.length > 1) msg += ` (+${incidents.length - 1} more CDOT incident${incidents.length - 1 === 1 ? "" : "s"} nearby).`;
  } else if (anyBad) {
    const s = segments.find(s => /snow|ice|icy|pack|slush|wet/.test(s.cond || ""));
    msg = `${s.route}: ${s.cond}.`;
  } else {
    msg = "No reported issues on the Durango access corridor.";
  }

  return {
    level, title, msg, note: ROAD_NOTE, scope: ROAD_SCOPE,
    incidents, segments, source: "CDOT / COtrip",
    asOf: new Date().toISOString(), status: "ok", stale: false
  };
}

/* ---------- FIRE RESTRICTIONS: editor-controlled restrictions.json ---------- */
async function getRestrictions(env) {
  if (!env.RESTRICTIONS_URL) return { stage: "none" };
  const j = await getJson(env.RESTRICTIONS_URL);
  return {
    stage: j.stage || "none", issuedBy: j.issuedBy, scope: j.scope, effective: j.effective,
    summary: j.summary, prohibited: j.prohibited, allowed: j.allowed, penalty: j.penalty,
    resources: j.resources, url: j.url, updated: j.updated, note: j.note || j.summary
  };
}

// Fold the editor restriction stage into the NWS-derived alert tile, applying
// the BUILD-SPEC precedence: Red Flag or Stage 2 -> danger; Fire Weather Watch
// or Stage 1 -> warn; else whatever the NWS alerts already produced.
function mergeRestrictionStage(alert, restrictions) {
  if (!alert || alert.status === "error") return alert;
  const stage = (restrictions && restrictions.stage) || "none";
  alert.fireRestrictionStage = stage;
  if (stage === "none") return alert;

  const rank = { ok: 0, warn: 1, danger: 2 };
  const stageLevel = stage === "2" ? "danger" : "warn";
  if (rank[stageLevel] > rank[alert.level]) {
    alert.level = stageLevel;
    // Only override the title if the stage is now the most severe thing.
    if (!alert.redFlag) alert.title = `Stage ${stage} fire restrictions`;
  }
  const extra = `Stage ${stage} fire restrictions in effect` +
    (restrictions.issuedBy ? ` (${restrictions.issuedBy})` : "") + "." +
    (restrictions.note ? " " + restrictions.note : "");
  alert.msg = alert.level === "ok" || /no red-flag/i.test(alert.msg) ? extra : `${alert.msg} ${extra}`;
  return alert;
}

/* ---------- helpers ---------- */
async function getJson(url, headers) {
  const r = await fetch(url, { headers: { "User-Agent": UA, ...(headers || {}) }, cf: { cacheTtl: 60 } });
  if (!r.ok) throw new Error("HTTP " + r.status + " " + url);
  // Force UTF-8 decode: some upstreams (e.g. Pages serving JSON without a
  // charset) caused fetch().json() to mis-decode multibyte chars like em dashes.
  const buf = await r.arrayBuffer();
  return JSON.parse(new TextDecoder("utf-8").decode(buf));
}
function headlineFor(items, re) { return (items.find(i => re.test(i.event || "")) || {}).headline; }
function shorten(s, n) { s = (s || "").trim(); return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s; }
function round(n) { return n == null || isNaN(n) ? null : Math.round(n); }
function r2(n) { return n == null || isNaN(n) ? null : Math.round(n * 100) / 100; }
function cToF(c) { return c == null ? null : Math.round(c * 9 / 5 + 32); }
function msToMph(ms) { return ms == null ? null : Math.round(ms * 2.236936); }
// NWS unit-aware converters (each takes the {value, unitCode} object)
function nwsF(o) { return o && o.value != null ? Math.round(o.value * 9 / 5 + 32) : null; }
function nwsWind(o) {
  if (!o || o.value == null) return null;
  return (o.unitCode || "").indexOf("m_s") >= 0
    ? Math.round(o.value * 2.236936)   // m/s → mph
    : Math.round(o.value * 0.621371);  // km/h → mph (NWS default)
}
function nwsInHg(o) { return o && o.value != null ? Math.round((o.value / 3386.389) * 100) / 100 : null; }
function nwsMi(o) { return o && o.value != null ? Math.round((o.value / 1609.344) * 10) / 10 : null; }
function degToCompass(d) {
  if (d == null) return "";
  return ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"][Math.round(d / 22.5) % 16];
}
function shortDay(iso) { return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date(iso).getUTCDay()]; }
function iconFor(text) {
  const t = (text || "").toLowerCase();
  if (t.includes("snow")) return "snow";
  if (t.includes("rain") || t.includes("shower")) return "showers";
  if (t.includes("thunder")) return "storm";
  if (t.includes("partly") || t.includes("mostly")) return "partly";
  if (t.includes("cloud")) return "cloudy";
  return "sunny";
}
function haversineMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8, toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function friendly(d) {
  // e.g. "9:17 PM MDT" (MST in winter) — timeZoneName gives the abbreviation.
  return d.toLocaleString("en-US", { timeZone: "America/Denver",
    hour: "numeric", minute: "2-digit", hour12: true, timeZoneName: "short" });
}
function fallback() {
  return { updated: new Date().toISOString(), updatedFriendly: "—",
    weather:{status:"error"}, lake:{status:"error"}, stream:{status:"error"},
    alert:{level:"ok",title:"—",msg:"Conditions loading…"}, fires:{status:"error"}, road:{status:"error"} };
}
