# Review Updates — Round 34: LPEA power-outage tile (for Claude Code)

David's ask: show LPEA power-outage info live. Research (June 9 2026) confirmed a pollable public JSON
feed with per-outage coordinates → a real, lake-filtered live tile is achievable. Worker + front-end.
Build after Round 33. Deploy Worker + Pages, push.

## Source (verified June 9 2026)
LPEA's outage map = **Milsoft "Web Outage Viewer"**, self-hosted, serving static JSON (no KUBRA):
- **System totals:** `https://outage.lpea.coop/data/outageSummary.json` →
  `{ customersAffected, customersRestored, customersOutNow, customersServed, updateTime, ... }`
  (`updateTime` is the freshness field; ISO with -06:00 offset).
- **Per-outage detail:** `https://outage.lpea.coop/data/outages.json` → array of
  `{ outageRecID, outageName (street), outagePoint:{lat,lng}, customersOutNow, customersOutInitially,
  estimatedTimeOfRestoral, crewAssigned, isPlanned, outageStartTime, ... }`.
- **CORS is NOT open** → must be fetched server-side by the Worker (browser can't). Cache header is
  `max-age=60`; a 15-min poll is polite. No X-Frame-Options (iframe technically possible) but the app is
  a heavy full-screen map — we are NOT iframing; we build a compact tile.
- Verified: per-outage `outagePoint` enables near-Vallecito filtering (7 of 9 live outages were ≤2.5 mi
  of the lake at fetch time, in Forest Lakes).

## 1. Worker — new `getPower()` in conditions-worker.js
- Fetch both JSON URLs (wrap in the existing `safe()` last-good discipline; one failure never blanks).
- Filter `outages.json` to entries whose `outagePoint` is within **~8 mi** of LAT/LON (37.3361,
  -107.5617) via Haversine. Sum `customersOutNow` over the nearby set = `nearbyAffected`;
  `nearbyCount` = number of nearby outages.
- Attach a `power` block to conditions.json:
  `{ nearbyCount, nearbyAffected, systemOutNow, systemServed, asOf: updateTime,
     source: "La Plata Electric Association", stale }`.
- Stale rule: flag `stale:true` if `updateTime` older than ~2h (the feed updates ~hourly/by-event; don't
  over-flag). Sanity: ignore absurd values; nearbyAffected ≥ 0.
- **No invented data.** If the feed is unreachable, keep last-good + stale, or omit the tile's numbers
  and show "status unavailable" — never fake "all on."

## 2. Front-end — a "⚡ Power" tile (home grid + conditions page)
- Add a tile to the home `#conditions` grid AND the conditions page, styled like the others, with the
  per-tile source + timestamp line + stale badge (matches R15 pattern).
- Copy:
  - **No nearby outages:** big "Power: on" / small "No outages reported near Vallecito" (optionally
    "· LPEA system: {systemOutNow} out" as muted context).
  - **Nearby outages:** big "{nearbyCount} nearby" / small "~{nearbyAffected} homes affected near the
    lake · crews {assigned/—}". Link the tile to `https://outage.lpea.coop/` ("LPEA outage map →").
  - Source line: "Source: La Plata Electric Association · updated {asOf}".
- Honesty caveats (bake into the conditions-page detail, not the tile): the outage point is a reporting
  rollup anchor (not every affected meter), and customer counts can lag or be estimated — link the
  official map as the authority. Tie-in: cross-link the living-here/utilities power section.
- conditions.js: render the `power` block; if absent, hide the tile gracefully (don't show empty).

## 3. Sources + docs
- sources.html #how-we-verify: add a row — "Power outages → ⚡ Power tile → La Plata Electric Association
  (Milsoft Web Outage Viewer), polled every 15 min, filtered to ~8 mi of the lake."
- DATA-SOURCES.md: document the two endpoints + the 8-mi filter + updateTime field.
- conditions.json sample (`conditions.sample.json`): add a `power` example block.

## ⚠️ Flag for David (do before/around launch)
No explicit LPEA license permits feed reuse (the data is already public and powers their own map, and
we attribute + link them as the source). **Send LPEA a short courtesy note** — good-neighbor, and they
may welcome the added visibility for outage awareness. Draft if David wants one. Until then, attribution
+ link is the responsible posture; pull instantly if LPEA ever objects.

## After applying
Deploy Worker + Pages, push. Verify via /__refresh: `power` block present with sane nearby/system
numbers + a recent `asOf`; tile renders on home + conditions with source/stale line; link opens the LPEA
map; no console errors; tile hides cleanly if the feed is down (test by temporarily pointing at a bad
URL). Report the first live reading (nearby vs system counts).
