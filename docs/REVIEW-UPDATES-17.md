# Review Updates — Round 17: Interactive lake map (for Claude Code)

A signature feature: one interactive map of the lake with everything a visitor needs to locate. Free
stack, no API keys. Build AFTER Round 16. Redeploy + push.

## Stack
- New page `map.html` ("Lake Map") + **Leaflet** (self-host `leaflet.js`/`leaflet.css` in
  `public/assets/vendor/leaflet/` — don't rely on a CDN) + **OpenStreetMap** standard raster tiles with
  the required attribution. No build step, no key.
- Nav: add "Lake Map" to **Explore ▾** (all 20 pages). Link it prominently from home ("Plan the rest of
  your trip" grid), things-to-do, fishing (#access), first-visit, and plan-your-visit.
- Mobile first: full-width map ~70vh, touch-friendly, popups not hover; category toggle chips above the
  map; collapsible legend.

## Data: `public/data/map-pois.json` (config-driven, same pattern as directory.json)
`{ "categories": [...], "pois": [ { "id", "name", "category", "lat", "lng", "blurb", "link"?, "phone"? } ] }`
Categories (each a toggleable layer with its own marker color/emoji):
- 🚤 **Boat launches** — PRID public ramp; marina launch/slips.
- 🏕️ **Campgrounds** — USFS: Vallecito CG, Graham Creek, Middle Mountain, Pine Point, North Canyon,
  Old Timers (+ private RV parks: Blue Spruce, 5 Branches, JW Vallecito — link those to their
  `directory.html#biz-<slug>` entries).
- 🥾 **Trailheads** — Vallecito Creek, Pine River, Johnson Creek (Round-16/things-to-do trails).
- 🎣 **Fishing access** — public shore areas, Grimes Creek inlet (mark the Sep 1–Nov 14 closure area
  honestly in its popup), dam area.
- 🏪 **Businesses** — pull the featured/verified tier from directory.json mentions: marina, Country
  Market, Weminuche Grill, Rocky Mountain General Store, lodges with addresses. Popup links to the
  directory anchor (two-hop pattern — external links stay on the directory).
- 🚒 **Emergency** — Upper Pine River fire stations near the lake, nearest medical (Bayfield/Durango),
  with the existing verified phone numbers.
- 📷 **Viewpoints** — dam overlook, lake overlooks on CR 501/CR 500 (only ones that are real pull-offs).

## Coordinates — verify, don't guess (CRITICAL)
- Get lat/lng from authoritative pages: USFS recreation-area pages (each campground/trailhead page
  publishes coordinates), PRID for the ramp, business addresses via their own sites/Google Maps listing.
- Known anchors to sanity-check against: lake center ≈ **37.3361, -107.5617** (the Worker's LAT/LON);
  marina at 14772 CR 501; Blue Spruce at 1875 CR 500 ≈ 37.4661, -107.5539 (from their own site's Google
  Maps link).
- Every POI gets a `"src"` field in the JSON noting where the coordinate came from. Any POI that can't
  be verified gets EXCLUDED, not approximated — a map pin in the wrong place destroys trust faster than
  a missing pin. List excluded/unverified POIs in the build report for David.

## Behavior
- Default view: whole lake fitted (~zoom 13), all categories on except Businesses (reduce first-paint
  clutter); chips toggle layers; each chip shows count.
- Popups: name, 1-line blurb, link (directory anchor or official page), phone as `tel:`.
- A "📍 conditions" note in the corner linking to conditions.html (don't duplicate live data on the map
  in v1).
- Graceful failure: if tiles don't load (offline), show a friendly message + link to the POI list.
- Below the map: a plain HTML list of all POIs grouped by category (same JSON, rendered as text) — for
  SEO, accessibility, and no-JS users.

## After applying
Redeploy + push. Verify: map loads with correct attribution; all pins land where they should (spot-check
campgrounds against USFS pages); toggles + popups work on mobile; directory-anchor links resolve; the
text list renders; nav updated on all pages. Report any POIs excluded for unverifiable coordinates.
