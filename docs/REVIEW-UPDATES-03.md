# Review Updates — Round 3 (for Claude Code)

Apply to `public/` + worker as noted; redeploy (pages + worker) and push. Pairs with FIRE-RESTRICTIONS.md.

## 1. Stage 1 alert link → real fire-restriction detail section

Right now the Alert tile links to a `/conditions` anchor that still says "All clear" / no restrictions.
Build out that anchor target (`#alerts` / a new `#fire-restrictions`) into a proper, **data-driven**
detail block fed by `restrictions.json` + the NWS alert, so it always matches the tile.

When a stage is active, show:
- **Headline:** "🔥 Stage 1 Fire Restrictions — in effect" (color by stage: 1=amber/warn, 2=orange, 3=red).
- **Issued by / effective date / scope:** "San Juan National Forest · effective May 22, 2026 · NF lands
  below 8,000 ft, including Vallecito Lake; designated Wilderness excluded."
- **What's prohibited:** campfires, charcoal, wood/coal stove fires, outdoor smoking (except in a vehicle
  or building), fireworks/explosives.
- **What's allowed:** propane/gas stoves & lanterns with shut-off valves; fires in permanent Forest
  Service campfire rings in developed sites.
- **Penalty:** minimum $530 fine.
- **Direct resource links** (from FIRE-RESTRICTIONS.md):
  - San Juan NF — Forest Orders: https://www.fs.usda.gov/r02/sanjuan/newsroom/forest-orders
  - San Juan NF — Current Conditions: https://www.fs.usda.gov/r02/sanjuan/conditions
  - La Plata County — Fire Restrictions: https://www.lpcgov.org/departments/emergency_management/fire_restrictions.php
  - Colorado DFPC restrictions map: https://dfpc.colorado.gov/firerestriction
  - Non-emergency dispatch (confirm current stage): (970) 385-2900
- When `stage` is "none", show a brief "No fire restrictions currently in effect — always check before
  you burn" with the same resource links (so the section is never empty/contradictory).

Drive ALL of the above from `restrictions.json` fields (add `prohibited`, `allowed`, `penalty`,
`resources[]` as needed) so David updates one file and both the tile and the detail section change.

## 2. Inflow (streamflow) gauges — show "last updated"

The USGS instantaneous-values response includes a timestamp per reading; the worker currently drops it.
- **Worker (`getStreams`)**: capture each gauge's latest `dateTime` and include `asOf` (ISO) on the
  stream object (and/or per gauge).
- **UI**: show "Updated <relative/time>" under the streamflow figure, like the lake tile's `asOf`.
- Keep the `safe()` + stale handling consistent with the lake feed.

## 3. Marina weather — display everything the gauge reports

The marina's Weather Underground PWS can return far more than temperature (sensor-dependent). When the
**WU key + station ID** are in (still pending from the marina), expand the weather panel to show all
available fields:

- **Temperature** + **feels-like** (heat index in heat / wind chill in cold)
- **Dew point**
- **Humidity**
- **Wind:** speed, **gust**, and direction (compass)
- **Barometric pressure** (+ rising/falling trend if we track last reading)
- **Precipitation:** current rate + **today's accumulation**
- **UV index**
- **Solar radiation** (W/m²)
- **Station elevation** + **observation time** ("as of HH:MM")

Worker: in `getWeather`, when reading the WU PWS observation, map all of the above from
`observations[0]` and `observations[0].imperial` (temp, heatIndex, windChill, dewpt, windSpeed,
windGust, pressure, precipRate, precipTotal, elev) plus top-level humidity, winddir, uv,
solarRadiation, obsTimeLocal. Omit any field the station doesn't report.

**Before the marina key arrives:** we can still enrich the current NWS-based panel beyond just temp —
NWS gives dew point, wind + gust, barometric pressure, relative humidity, visibility, and sky/conditions.
Worth surfacing those now so the panel looks complete, then the marina station makes it station-exact.
> Note for David: still need the **WU station ID + free API key** from the marina (see
> docs/marina-weather-request.md) to unlock the true at-the-marina readings.

## 4. Julie Coffelt — add her active listings

Add these to her real-estate-partner page. **Link-out cards** (each links to the live cbmp listing) so
price/status/photos are always current — do NOT hard-code prices (aggregators showed conflicting/stale
numbers, and a wrong price would misrepresent her). 6 unique listings (one URL was duplicated):

```json
[
  { "address": "1896 County Road 500, Bayfield, CO 81122",
    "url": "https://www.cbmp.com/homes/1896-County-Road-500-Bayfield/CO/81122/AGT-119835099-989151/index.html" },
  { "address": "1429 County Road 500, Bayfield, CO 81122",
    "url": "https://www.cbmp.com/homes/1429-County-Road-500-Bayfield/CO/81122/AGT-119834474-989151/index.html" },
  { "address": "18 Vallecito Creek, Bayfield, CO 81122",
    "url": "https://www.cbmp.com/homes/18-Vallecito-Creek-Bayfield/CO/81122/AGT-119833295-989151/index.html" },
  { "address": "48 W Vallecito Creek, Bayfield, CO 81122",
    "url": "https://www.cbmp.com/homes/48-W-Vallecito-Creek-Bayfield/CO/81122/AGT-119833289-989151/index.html" },
  { "address": "18-20-22-48 W Vallecito Creek, Bayfield, CO 81122",
    "url": "https://www.cbmp.com/homes/18-20-22-48-W-Vallecito-Creek-Bayfield/CO/81122/AGT-119833303-989151/index.html" },
  { "address": "210 Ponderosa, Bayfield, CO 81122",
    "url": "https://www.cbmp.com/homes/210-Ponderosa-Homes-Bayfield/CO/81122/AGT-119833569-989151/index.html" }
]
```

- Render as a "Current Listings" section on her page: address + "View listing on Coldwell Banker →".
- Build the card to *optionally* show price / beds / baths / sqft / a photo **if provided** in the JSON,
  so David or Julie can fill those in later (or we pull them when the Chrome tool is available). Leave
  those fields empty for now rather than guessing.
- Keep the "do not scrape MLS" note; these are authorized links to her brokerage listings.

## 5. After applying
- Redeploy pages + worker; push. Show me the updated stream JSON (with `asOf`) and confirm the
  fire-restriction detail section renders Stage 1 with working resource links.
