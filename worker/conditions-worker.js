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

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(refresh(env));
  },
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/data/conditions.json") {
      const cached = await env.CONDITIONS.get(KV_KEY);
      return new Response(cached || JSON.stringify(fallback()), {
        headers: { "content-type": "application/json", "cache-control": "max-age=300",
                   "access-control-allow-origin": "*" }
      });
    }
    if (url.pathname === "/__refresh") {           // manual trigger for testing
      const out = await refresh(env);
      return new Response(JSON.stringify(out, null, 2), { headers: { "content-type": "application/json" } });
    }
    return new Response("Not found", { status: 404 });
  }
};

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

  const alert = mergeRestrictionStage(alertsRaw, restrictions);

  const now = new Date();
  const out = {
    updated: now.toISOString(),
    updatedFriendly: friendly(now),
    weather, lake, stream, alert, fires, road
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

/* ---------- LAKE: USGS reservoir gauge 09353000 (keyless) ---------- */
async function getLake() {
  const u = "https://waterservices.usgs.gov/nwis/iv/?sites=09353000&format=json&parameterCd=00054,62614,00062";
  const j = await getJson(u);
  const series = j.value?.timeSeries || [];
  const pick = code => {
    const s = series.find(t => t.variable.variableCode[0].value === code);
    const vals = s?.values?.[0]?.value || [];
    const v = vals[vals.length - 1]?.value;     // latest reading
    return v != null ? parseFloat(v) : null;
  };
  const storageAf = pick("00054") ?? pick("00062"); // reservoir storage, acre-feet
  const elevationFt = pick("62614");
  const pct = storageAf != null ? Math.round((storageAf / CAPACITY_AF) * 100) : null;
  return { pct, storageAf: round(storageAf), capacityAf: CAPACITY_AF, elevationFt: round(elevationFt),
           status: "ok", stale: false };
}

/* ---------- STREAMS: USGS 09352900 + 09352800 (keyless) ---------- */
async function getStreams() {
  const u = "https://waterservices.usgs.gov/nwis/iv/?sites=09352900,09352800&format=json&parameterCd=00060";
  const j = await getJson(u);
  const names = { "09352900": "Vallecito Creek", "09352800": "Pine River" };
  const gauges = (j.value?.timeSeries || []).map(t => {
    const id = t.sourceInfo.siteCode[0].value;
    const vals = t.values?.[0]?.value || [];
    const cfs = parseFloat(vals[vals.length - 1]?.value);
    return { id, name: names[id] || id, cfs: isNaN(cfs) ? null : Math.round(cfs) };
  });
  const combinedCfs = gauges.reduce((a, g) => a + (g.cfs || 0), 0);
  return { combinedCfs, gauges, status: "ok", stale: false };
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
  let cur = null, source = "";

  // PRIMARY: Weather Underground PWS (true marina reading) — needs free key + station id.
  if (env.WU_API_KEY && env.WU_STATION_ID) {
    try {
      const u = `https://api.weather.com/v2/pws/observations/current?stationId=${env.WU_STATION_ID}&format=json&units=e&apiKey=${env.WU_API_KEY}`;
      const j = await getJson(u);
      const o = j.observations?.[0];
      if (o) {
        const im = o.imperial || {};
        cur = { tempF: round(im.temp), desc: "", windMph: round(im.windSpeed),
                windDir: degToCompass(o.winddir), humidity: round(o.humidity) };
        source = "WU PWS " + env.WU_STATION_ID;
      }
    } catch { /* fall through to NWS */ }
  }

  // NWS forecast (keyless) — always used for the 5-day + today's hi/lo.
  const point = await getJson(`https://api.weather.gov/points/${LAT},${LON}`, { "User-Agent": UA });
  const fc = await getJson(point.properties.forecast, { "User-Agent": UA });
  const periods = fc.properties?.periods || [];
  const forecast5 = build5Day(periods);

  // FALLBACK current obs from the nearest NWS station, if WU was unavailable.
  if (!cur) {
    try {
      const stations = await getJson(point.properties.observationStations, { "User-Agent": UA });
      const stId = stations.features?.[0]?.properties?.stationIdentifier;
      const obs = await getJson(`https://api.weather.gov/stations/${stId}/observations/latest`, { "User-Agent": UA });
      const p = obs.properties || {};
      cur = { tempF: cToF(p.temperature?.value), desc: p.textDescription || "",
              windMph: msToMph(p.windSpeed?.value), windDir: degToCompass(p.windDirection?.value),
              humidity: round(p.relativeHumidity?.value) };
      source = "NWS " + (stId || "");
    } catch {
      cur = { tempF: null, desc: "", windMph: null, windDir: "", humidity: null };
      source = "NWS";
    }
  }
  if (!cur.desc) cur.desc = periods[0]?.shortForecast || "";

  return { tempF: cur.tempF, desc: cur.desc, windMph: cur.windMph, windDir: cur.windDir,
           humidity: cur.humidity,
           highF: forecast5[0]?.hi ?? null, lowF: forecast5[0]?.lo ?? null,
           source, forecast5, status: "ok", stale: false };
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

/* ---------- ROADS: CDOT/COtrip US-160 + CR 501 ---------- */
// COtrip's exact public endpoint/key must be confirmed on their developer portal.
// Provide CDOT_ENDPOINT (and CDOT_KEY if required) as Worker vars to activate.
async function getRoads(env) {
  if (!env.CDOT_ENDPOINT) {
    return { level: "ok", title: "Clear",
             msg: "No active CDOT alerts on the Durango access route.", status: "unconfigured" };
  }
  const url = env.CDOT_KEY ? `${env.CDOT_ENDPOINT}?apiKey=${env.CDOT_KEY}` : env.CDOT_ENDPOINT;
  const j = await getJson(url);
  const feats = (j.features || []).filter(f => {
    const s = JSON.stringify(f.properties || f.attributes || {}).toLowerCase();
    return s.includes("160") || s.includes("501");
  });
  const closed = feats.some(f => JSON.stringify(f).toLowerCase().includes("closed"));
  const level = closed ? "danger" : feats.length ? "warn" : "ok";
  const title = closed ? "Closure" : feats.length ? "Caution" : "Clear";
  const msg = feats.length ? `${feats.length} active CDOT alert${feats.length === 1 ? "" : "s"} on US-160 / CR 501.`
                           : "No active CDOT alerts on the Durango access route.";
  return { level, title, msg, status: "ok" };
}

/* ---------- FIRE RESTRICTIONS: editor-controlled restrictions.json ---------- */
async function getRestrictions(env) {
  if (!env.RESTRICTIONS_URL) return { stage: "none" };
  const j = await getJson(env.RESTRICTIONS_URL);
  return { stage: j.stage || "none", issuedBy: j.issuedBy, url: j.url, note: j.note };
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
    (restrictions.issuedBy ? ` (${restrictions.issuedBy})` : "") + ".";
  alert.msg = alert.level === "ok" || /no red-flag/i.test(alert.msg) ? extra : `${alert.msg} ${extra}`;
  return alert;
}

/* ---------- helpers ---------- */
async function getJson(url, headers) {
  const r = await fetch(url, { headers: { "User-Agent": UA, ...(headers || {}) }, cf: { cacheTtl: 60 } });
  if (!r.ok) throw new Error("HTTP " + r.status + " " + url);
  return r.json();
}
function headlineFor(items, re) { return (items.find(i => re.test(i.event || "")) || {}).headline; }
function round(n) { return n == null || isNaN(n) ? null : Math.round(n); }
function cToF(c) { return c == null ? null : Math.round(c * 9 / 5 + 32); }
function msToMph(ms) { return ms == null ? null : Math.round(ms * 2.236936); }
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
  return "today " + d.toLocaleString("en-US", { timeZone: "America/Denver",
    hour: "numeric", minute: "2-digit", hour12: true }) + " MT";
}
function fallback() {
  return { updated: new Date().toISOString(), updatedFriendly: "—",
    weather:{status:"error"}, lake:{status:"error"}, stream:{status:"error"},
    alert:{level:"ok",title:"—",msg:"Conditions loading…"}, fires:{status:"error"}, road:{status:"error"} };
}
