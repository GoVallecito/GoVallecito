# GoVallecito — Live Data Sources Reference

**Lake reference point:** Vallecito Reservoir, La Plata County, CO
**Coordinates used by the current site:** `37.3361, -107.5617` (lake) — the site also uses `37.38, -107.58` for sky/seeing forecasts.
**Elevation:** 7,665 ft · **Reservoir capacity:** ~129,700 acre-feet (verify exact figure before launch).

> **Architecture rule:** No visitor browser calls these APIs directly. A Cloudflare Worker on a 15-minute cron fetches all of them server-side, normalizes them into a single `conditions.json`, and caches it. The site reads only `conditions.json`. This kills the slow "--" load, avoids per-visitor rate limits, and dodges browser CORS problems.

---

## 1. Weather — at the marina (primary), NWS (fallback)

**Goal:** show the marina's own weather-station reading, free.

- **Weather Underground PWS (primary).** The marina owns a station that broadcasts to Weather Underground. PWS owners get a **free API key** as a data contributor.
  - Current conditions: `https://api.weather.com/v2/pws/observations/current?stationId=<STATION_ID>&format=json&units=e&apiKey=<KEY>`
  - **Need from the marina:** (a) the **station ID** (e.g. `KCOBAYFI12`), (b) a **free API key** from their WU member settings → *Member Settings → API Keys*.
- **AccuWeather (secondary).** Free tier = 50 calls/day (plenty at one call / 15 min = 96/day → may need the next tier, or use only as backup). Requires a free developer key. Marina station also reports here.
- **NWS / NOAA (fallback, no key, government source).** Already used by the current site.
  - Forecast: `https://api.weather.gov/points/37.3361,-107.5617` → follow `properties.forecast` and `properties.forecastHourly`.
  - Current obs: nearest station via `.../points/.../stations`. Grid-based, ~at the lake but not literally the marina.
  - **Set a descriptive `User-Agent` header** (NWS requires it, e.g. `GoVallecito.com (contact@govallecito.com)`).

**Recommendation:** WU PWS as primary (true marina reading, free), NWS for the 5-day forecast + alerts (free, reliable). Use AccuWeather only if WU is unavailable.

---

## 2. Weather alerts + Red Flag Warnings — NWS (free, no key)

- Active alerts for the zone/point:
  `https://api.weather.gov/alerts/active?point=37.3361,-107.5617`
- **Red Flag Warning** is just an alert with `event = "Red Flag Warning"` — detect it in the alerts array and raise the dashboard "Alert status" tile to `danger`/`warn`.
- Also surface: Fire Weather Watch, Flood/Flash Flood, Winter Storm, Air Quality Alert.

---

## 3. Fire restrictions (Stage 1 / Stage 2 bans) — NO clean API

This is the one piece without a machine feed. Restrictions are issued by **San Juan National Forest**, **La Plata County**, and sometimes **PRID**.

**Options (pick one, document for David):**
1. **Manual toggle (recommended to start).** A small `restrictions.json` field David/editors flip: `{ "stage": "none|1|2", "issuedBy": "...", "url": "...", "updated": "..." }`. Surfaced in the Alert tile. Simple, reliable, locally controlled.
2. **Scrape** the San Juan NF alerts page / La Plata County emergency page in the Worker (brittle; needs monitoring).
3. Hybrid: manual toggle + a Worker check that emails David if the NF page text changes.

---

## 4. Active wildfires within 50 mi — NIFC / InciWeb

- **NIFC WFIGS (ArcGIS, free, no key)** — incident locations + acreage, filter by distance from `37.3361,-107.5617`:
  `https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/WFIGS_Incident_Locations_Current/FeatureServer/0/query?where=1%3D1&outFields=*&f=json&geometry=...&distance=80467&units=esriSRUnit_Meter`
  (50 mi ≈ 80,467 m; use a bounding box or `distance` query.)
- **InciWeb** — official incident write-ups for named fires (RSS/JSON): `https://inciweb.wildfire.gov/`
- Worker computes count + nearest incident name/distance for the dashboard tile; full list on `/conditions`.

---

## 5. Lake level — Vallecito Reservoir storage / % full

- **USBR RISE API (free).** Vallecito Reservoir water-operations data (storage, elevation, inflow, release).
  - Catalog: `https://data.usbr.gov/catalog/2469` · example item (release): `https://data.usbr.gov/catalog/2469/item/4323`
  - RISE result API returns JSON time series; pull latest **storage (acre-feet)** and **pool elevation**, compute `% of full = storage / capacity`.
- **⚠️ USGS reservoir gauge `09353000` is STALE — do not use.** Verified June 2026: its latest
  instantaneous value is dated **2012-12-31**. The station no longer reports real-time storage/elevation,
  so it returns a 13-year-old reading. (This produced a false "31% full" in testing; the reservoir was
  actually ~7,658 of 7,665 ft / near capacity.)
- **PRID** also publishes levels (good for a human cross-check / link).

**Recommendation (corrected):** Use a source that is actually current:
1. **USACE CWMS Data API** for the Vallecito location, district **spk** — start at
   `https://water.usace.army.mil/overview/spk/locations/vallecito` and its underlying `cwms-data` API.
2. **USBR RISE** (`data.usbr.gov`), catalog record **2469** (Vallecito Reservoir) — storage (acre-feet) + elevation items.
Prefer whichever returns **storage in acre-feet** so `% full = storage / 129,700`. Always verify the
returned reading's timestamp is recent (within ~48 h), never 2012.

---

## 6. Streamflow into the lake — USGS (free, no key)

Two gauges above the reservoir (already referenced on the site):
- **`09352900` — Vallecito Creek near Bayfield** (Vallecito Creek → lake)
- **`09352800` — Los Pinos / Pine River** (Pine River → lake)

Instantaneous values (discharge cfs + gage height):
`https://waterservices.usgs.gov/nwis/iv/?sites=09352900,09352800&format=json&parameterCd=00060,00065`
(00060 = discharge cfs, 00065 = gage height ft). Sum for the "streamflow in" tile.

---

## 7. Road conditions — CDOT / COtrip

- **CDOT OpenData / COtrip** travel alerts for **US-160** (Durango access) and **CR 501**.
  - CDOT has an open GeoJSON/REST feed for incidents, closures, and road conditions; filter to the US-160 corridor around Durango.
  - Public reference: `https://www.cotrip.org` · statewide phone `511`.
- Worker reduces to a simple status: `clear | caution | closed` + message.

---

## 7b. Power outages — La Plata Electric Association (Round 34)

Vallecito is served by **La Plata Electric Association (LPEA)**. Their public outage map is a
self-hosted **Milsoft "Web Outage Viewer"** that serves static JSON (no KUBRA). **CORS is closed**, so
the Worker (`getPower()`) must fetch it server-side; the browser cannot.

- **System summary:** `https://outage.lpea.coop/data/outageSummary.json` →
  `{ customersAffected, customersRestored, customersOutNow, customersServed, updateTime, hourlyCustomersOut[] }`.
  **`updateTime`** is the freshness field (ISO with a `-06:00` offset).
- **Per-outage detail:** `https://outage.lpea.coop/data/outages.json` → array of
  `{ outageRecID, outageName, outagePoint:{lat,lng}, customersOutNow, customersOutInitially,
  estimatedTimeOfRestoral, crewAssigned, isPlanned, outageStartTime, ... }`.
- **Lake filter:** Worker keeps only outages whose `outagePoint` is within **~8 mi** of the lake
  (LAT 37.3361, LON −107.5617) via Haversine; sums `customersOutNow` over that set = `nearbyAffected`,
  count = `nearbyCount`. System totals come from the summary. Polled every 15 min (feed `max-age=60`,
  but hourly/by-event is plenty); `stale` flagged if `updateTime` is older than ~2h.
- **conditions.json block:** `power: { nearbyCount, nearbyAffected, systemOutNow, systemServed, crews,
  asOf:updateTime, source:"La Plata Electric Association", status, stale }`.
- **Honesty:** the outage point is a reporting **rollup anchor** (not every meter) and counts can lag —
  link `https://outage.lpea.coop/` as the authority. No reuse license is posted; data is public and we
  attribute + link LPEA. Courtesy note to LPEA flagged for David; pull instantly if they ever object.

---

## 8. (Optional, high engagement) extras worth adding

- **Air quality (free):** AirNow API (`https://www.airnowapi.org/`) — wildfire smoke is a real planning factor for this audience.
- **Sun/moon + dark-sky:** sunrise/sunset (`https://api.sunrisesunset.io/`), moon phase; pair with the existing ClearOutside link for stargazing.
- **Webcam:** if the marina or a lodge has a public cam, embed it — single biggest "keep scrolling" element for a lake site.
- **Fishing report:** lightweight, editor-updated "what's biting" line.

---

## Keys & secrets summary (store as Cloudflare Worker secrets, never in the repo)

| Source | Key needed? | Where to get it |
|---|---|---|
| NWS (weather, alerts) | No | n/a — just a User-Agent header |
| USGS (lake, streams) | No | n/a |
| USBR RISE (lake) | No | n/a |
| NIFC WFIGS (fires) | No | n/a (public ArcGIS) |
| CDOT (roads) | Maybe | CDOT/COtrip developer portal |
| Weather Underground PWS | **Yes (free)** | Marina's WU member settings |
| AccuWeather (backup) | Yes (free tier) | developer.accuweather.com |
| AirNow (optional) | Yes (free) | airnowapi.org |
