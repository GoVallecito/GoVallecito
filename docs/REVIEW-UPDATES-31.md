# Review Updates — Round 31: Middle Mountain on the lake map (for Claude Code)

David's ask: Middle Mountain and its trails ON the lake map. The Round-30 build correctly excluded
guessed pins — now we have the authoritative source: **USFS EDW ArcGIS REST** serves official trail/road
GEOMETRY (verified working June 2026 — a live query for `TRAIL_NAME LIKE 'VALLECITO VIEW%'` on
`EDW_TrailNFSPublish_01` returned trail 808's full polyline, gis_miles 1.724, matching the FS page's
1.7 mi). Draw the routes as real lines + derive trailhead pins from the geometry. Deploy Pages + push.

## 1. Fetch authoritative geometry (build-time script, committed output)
New `scripts/fetch-mm-trails.mjs`:
- Query `https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_TrailNFSPublish_01/MapServer/0/query`
  (f=json, outFields incl. trail_no, trail_name, gis_miles, geometry) for the Middle Mountain set:
  **808 (VALLECITO VIEW), 812 (BERI), 814 (DARK CANYON), 530 (CAVE BASIN)** + try RUNLETT (name LIKE).
  Use a bbox filter around Middle Mountain (≈ -107.56..-107.42, 37.38..37.55) AND/OR trail_no+name
  match to avoid same-numbered trails on other forests — verify each hit's gis_miles against the
  published lengths (1.7 / 3.4 / ~2.1 / 4.5) before accepting.
- Query the roads layer (`EDW_RoadBasic_01` or RoadCore service — find the current EDW roads service)
  for **FR 724 / MIDDLE MOUNTAIN** within the same bbox for the road spine. If the roads layer can't be
  cleanly matched, ship trails-only and report (the road is visible on OSM base tiles anyway).
- Convert Esri JSON → GeoJSON (simple script; paths→LineString, keep WGS84/NAD83 lon-lat as-is),
  round coords to 5 decimals, add props: `{name, no, use: "ohv50|moto|foot-horse|road", miles}` —
  use classes per docs/MIDDLE-MOUNTAIN-CONTENT.md (Cave Basin = foot-horse; Dark Canyon = moto per
  flag). Write `public/data/middle-mountain-trails.geojson` (committed — no runtime USFS dependency).
  Keep it lean (<150 KB; simplify if needed).

## 2. Map layer
- map.html: new toggle chip **"🏔️ Middle Mountain"** (default OFF — it extends beyond the lake view).
  When toggled ON: load the geojson (lazy fetch), draw polylines **color-coded by use** (legend:
  ≤50" OHV / motorcycle single-track / foot & horse / road if present), popups = name + class + length
  + link to `middle-mountain.html#<anchor>`; and `fitBounds` to include the layer.
- **Derived pins (src = USFS EDW geometry):** Vallecito View TH + Cave Basin TH + Beri south junction =
  the endpoint of each trail's polyline nearest FR 724/the road corridor; Tuckerville road-end = FR 724
  geometry endpoint if the road layer matched (else omit). Add to the Trailheads category with
  `"src": "USFS EDW TrailNFSPublish geometry (trail <no>)"`. These are authoritative — the rule is
  satisfied.
- Text list below the map gains the Middle Mountain section (same data, rendered as text).
- Cross-link: middle-mountain.html routes table → "see them on the lake map →".

## 3. Verify
Each polyline's length ≈ published miles (reject mismatches); pins land on FR 724's corridor
(spot-check against the FS pages' "~9.5 mi up", "~8 mi up" descriptions); toggling works on mobile;
popups link the right anchors; map still defaults to the lake view with the layer off; geojson size
sane. Report: which features matched/were excluded, and the file size.
