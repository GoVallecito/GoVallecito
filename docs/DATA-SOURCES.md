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
- **USGS reservoir gauge (free):** site **`09353000` — Vallecito Reservoir near Bayfield, CO**.
  `https://waterservices.usgs.gov/nwis/iv/?sites=09353000&format=json&parameterCd=00062,62614` (00062 = reservoir storage, 62614 = elevation NGVD29).
- **PRID** also publishes levels (good for a human cross-check / link).

**Recommendation:** USGS `09353000` IV service is the simplest reliable JSON. Cross-check capacity against USBR for the `% full` denominator.

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
