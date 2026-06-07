# CLAUDE.md — GoVallecito.com (read this first)

Orientation for any new Claude Code / Cowork thread. The project's memory lives in this repo (code +
`docs/`) and in Cloudflare (deploys, KV, secrets) — not in any chat. Start by reading this file, then
`docs/PROJECT-STATUS.md`, then the newest `docs/REVIEW-UPDATES-*.md`.

## What this is
A rebuild of GoVallecito.com — a community/conditions hub for Vallecito Lake, CO.
- **Preview (live):** https://govallecito-web.pages.dev
- **Repo:** github.com/GoVallecito/GoVallecito
- **Real domain:** govallecito.com — still the OLD site; NOT cut over yet (do only on David's explicit OK).

## Architecture
- **Static site** in `public/` → Cloudflare Pages project **govallecito-web**.
- **Worker** in `worker/` (`conditions-worker.js`, `wrangler.toml`, project **govallecito-conditions**):
  cron every 15 min fetches all sources → writes one `conditions.json` to **KV** (binding `CONDITIONS`,
  id in wrangler.toml) → serves it at `/data/conditions.json`. Also a `/__refresh` manual trigger.
- **Front-end data:** `public/assets/js/conditions.js` fetches the conditions JSON (currently the Worker's
  CORS endpoint via a `DATA_URL` constant; switch to same-origin `/data/conditions.json` at domain cutover)
  and paints the dashboard; calm "Checking…" first paint; localStorage last-good cache.
- **Data sources:** weather = NWS (marina PWS `KCOBAYFI57` staged, needs `WU_API_KEY`); lake = USACE CWMS →
  USBR RISE (USGS 09353000 is DEAD/2012 — never use); streams = USGS 09352900+09352800; alerts/Red Flag =
  NWS; fires = NIFC within 50 mi; fire restrictions = editor toggle `public/data/restrictions.json`
  (currently Stage 1); roads = CDOT/COtrip (LIVE, Durango corridor; final CR-501 leg via cameras/511).

## Deploy / commands (David is wrangler-logged-in)
- Pages: `npx wrangler pages deploy public --project-name=govallecito-web`
- Worker: from `worker/`, `npx wrangler deploy`
- Commit + push to GitHub after each change.
- Secrets (in Cloudflare, never in repo): `npx wrangler secret put NAME`.

## Secrets / config state
- `COTRIP_KEY` — **SET and WORKING on `govallecito-conditions` (key `Y6ANSTG-…`, June 6 2026).**
  `getRoads()` is LIVE: reads CDOT `roadConditions` + `incidents`, filtered to the Durango access corridor
  (US 550 / US 160), with honest scoping. The TEMP `/__cdottest` probe + `cdotProbe()` have been REMOVED.
  **Honest caveat:** CDOT does NOT report US-160 Durango→Bayfield or CR 501, so the roads tile can't be a
  complete "is the road to the lake open" indicator — it's scoped to "Durango-area highways," with the
  camera deep-links + 511 for the final CR-501 leg. **Cameras = separate COtrip subscription (NOT active)**
  → camera tiles stay link-only (Path A). To rotate the key: regenerate in `manage-api.cotrip.org`, then
  `npx wrangler secret put COTRIP_KEY` from the `worker/` folder. (David has waived secrecy on this key.)
- `WU_API_KEY` — NOT set yet (marina weather stays on NWS until it is). `WU_STATION_ID=KCOBAYFI57` (var).

## Workflow convention
Each change is specced in `docs/REVIEW-UPDATES-NN.md`, then built by Claude Code, deployed, pushed. Keep doing this.

## Gotchas (learned the hard way)
- **Cloudflare edge-caches** HTML/CSS/JS — hard-refresh or add `?cb=` when verifying; "old content" is
  usually cache, not a failed deploy.
- `/foo.html` **308-redirects to `/foo`** on Pages — verify clean URLs / use `curl -L`.
- `--bg` is BOTH an inline image var AND the global color token `#f7f5f0`; `.pagehero` needs a solid
  `background-color:var(--pine)` base or text goes white-on-cream.
- COtrip is JS-only (no scrapeable image URLs); CDOT data needs the Worker (key) not the shell.

## Current open items (June 2026)
- **DONE:** CDOT roads integration — `getRoads()` live, `/__cdottest` removed, deployed + pushed
  (commit `8afba75`). See Secrets/config above.
- **DONE (June 6 2026): Rounds 13+14** (commit `46f58b3`) — grouped nav on all 19 pages, annbar retired,
  Real Estate featured card, two-hop directory links + `#biz-<slug>` anchors, Blue Spruce photo, home
  reorder, conditions alert/emoji/button polish. **Round 15** (commit `470902c`) — positioning statement,
  per-tile source+timestamp (+stale badge), editorial/corrections anchors on sources page, About-the-Team
  placeholder, `first-visit.html`. Specs in `docs/REVIEW-UPDATES-13..15.md`.
- **DONE — micro-fixes (Cowork-made, verified + deployed + pushed):** (a) `directory.json` — Dining + Retail merged into one **"Dining & Markets"**
  category (Country Market, Weminuche Grill, Rocky Mountain General Store; per David — the general store
  has a deli + elk brats/hand-cut meats); (b) `things-to-do.html` — Kayak/SUP line now says "rent at the
  marina or bring your own" (marina rents them); (c) `index.html` — hero "Start here →" CTA repointed
  from plan-your-visit to `first-visit.html`; (d) `first-visit.html` — ANS line tightened (VERIFIED:
  CPW lists Vallecito as an inspection station, ramp inspections in season; ANS stamp required for
  motorized/sail; clean-drain-dry law).
- **DONE — Rounds 16+17 (built, verified, deployed + pushed):** R16 fishing hub v1 — corrected the live
  regs inaccuracy (Grimes Creek inlet closure Sep 1–Nov 14, snagging Nov 15–Dec 31 that stretch only;
  pike/smallmouth unlimited), six species sections, month-by-month calendar, shore/boat access, and a
  weekly report via `public/data/fishing-report.json` (editor file; >14-day auto-fallback). R17 interactive
  lake map — `map.html` with self-hosted Leaflet (`public/assets/vendor/leaflet/`) + OSM, config-driven
  `public/data/map-pois.json`; "Lake Map" added to Explore nav on all 20 pages. **Map POIs: only verified
  coords shipped (9)** — 5 USFS campgrounds + Old Timers + dam (fs.usda.gov / Wikipedia-USBR), Blue Spruce
  (spec), marina (Google listing). **EXCLUDED pending verified coords** (build report): trailheads
  (FS pages 403/404), Johnson Creek (no drive-to TH), PRID public ramp, Grimes Creek inlet pin, most
  businesses (Country Market/Weminuche/Rocky Mtn GS/lodges), emergency stations, road pull-off viewpoints.
  Add these to `map-pois.json` with a `src` once coordinates are verified.
- **DONE — Round 18 (persona-panel fixes; built, verified, deployed Pages + Worker, pushed):** A1 lake
  copy now cites USACE/USBR (dead USGS 09353000 removed); A2 real-estate demo form → direct phone/email/
  site buttons + IDX scaffolding copy removed (also fixed the same demo-form on contact.html → direct
  email); A3 years unified to "25+ years in Four Corners" (meta lake-residency dropped — CONFIRM exact
  number w/ Julie); A4 getRoads() now uses a tight per-route corridor box (verified: Molas Pass dropped,
  Durango US-550 kept); A5 LAKE_STALE_MS 7d→72h (verified: 5-day-old reading now flags stale); A6 nav
  current on all 20 pages; A7 drive time standardized to "~45 min from Durango (23 mi)". B1 PRID fees
  ($6/day veh, $50/yr, $12/day boat, SUP/kayak vehicle-only; buy online/marina/Vallecito Resort; ramp
  May 1–Nov 1) on home/plan/things-to-do/fishing/first-visit; B2 where-to-eat on things-to-do; B3 Mercy
  Hospital ER (970) 247-4311 on conditions + first-visit; B4 "one road in"→"one paved route in (CR 501)"
  + Florida Rd alt, "≈7,665 ft at full pool", Missionary Ridge in firewise; B5 living-here cards delinked
  w/ "Guide coming soon"; B6 home "Talk to Julie" quick-action removed. **FLAG for David:** confirm Julie's
  exact years/lake-residency; Bayfield clinic name/phone not verified (listed Mercy + 911 only).
  **DONE — Round 19 (free photos placed; built, verified, deployed + pushed):** 12 freely-licensed photos
  fetched (`scripts/fetch-free-images.sh`; originals in gitignored `assets-originals/`), optimized via
  `scripts/optimize_images.py` (heroes ≤349 KB @1920/auto-width, inline ≤150 KB; EXIF stripped) → web
  copies in `public/assets/img/`. Placed: home hero (lake panorama) + 5 pageheros (things-to-do/conditions/
  living/fishing/first-visit) + 6 inline figures (about aerial+1911, things-to-do stargazing+trails,
  first-visit campsite+aspen). Attribution: required `#photo-credits` table on sources.html (author→source,
  license→deed) + inline figcaptions + footer "Photo credits" link site-wide. Aspen captioned honestly as
  Weminuche (not the reservoir). **Note:** pre-existing `coronado-ops.jpg` (2.8 MB) + `blue-spruce.jpg`
  (0.66 MB) are oversized — flag for a future optimize pass (out of R19 scope). Flickr originals (fireworks,
  three-relics) not placed (need manual Flickr download).
  **DONE — Round 20 (camping/RV + map pins + perch; built, verified, deployed + pushed):** things-to-do
  🏕️ Camping section (5 USFS CGs w/ counts + fs.usda.gov links + rec.gov reserve link; amenities = vault
  toilets/water, mostly no-hookup; Old Timers = day-use; private RV parks two-hop; dispersed → Columbine
  RD). first-visit "camping on a budget" line. directory.json: new `rv` field rendered (🚐) on Blue Spruce
  (30 & 50 amp, water/sewer — own site) + 5 Branches (**phone (970) 884-2582 ADDED** + 30-amp lakeshore,
  addr 4677 CR 501A). Map +3 pins (12 total): PRID ramp (at marina, src PRID), Grimes Creek inlet (GNIS
  37.4356,-107.5467), Vallecito Creek TH (=Vallecito CG, src FS trail page) + new 🥾 Trailheads category.
  fishing #perch section + at-a-glance row + Jan calendar link. **VERIFY-OR-EXCLUDE outcomes:** rec.gov
  per-CG nightly fees/dates NOT machine-readable → softened to rec.gov links; 5 Branches sewer/40-ft NOT
  on their site → omitted; JW Vallecito RV unverified → left as-is. **EXCLUDED pins (no authoritative
  coord — Nominatim empty):** Country Market + Weminuche Grill eateries, north-end swim area → David-asks.
- **Insider Q&A:** `docs/DAVID-QA-INSIDER.md` — 20 questions David answers inline async. When he says
  "Q&A has answers," turn them into fishing insider notes, seasonal pages, and Insider-tips content
  (verify anything he marks "verify"). Skipped for now: community submissions.
- **Pending on David:** photos (`docs/PHOTO-WISHLIST.md` → `public/assets/img/`); marina `WU_API_KEY`;
  Excel Excavation data + Vallecito Church logo; a heads-up to Julie; the **go-live cutover** (attach
  govallecito.com to Pages, activate the Worker route in wrangler.toml, flip `conditions.js` DATA_URL to
  same-origin); delete the stray **govallecito-site** Worker project from the dashboard importer.
- **Phase 2 roadmap:** weekly fishing report, species pages, seasonal guides, Living-in-Vallecito content,
  photo gallery, schema (FAQ/LocalBusiness/Article/Breadcrumb), image alt-text, internal linking,
  AI-search Q&A pages. Positioning: "the most complete independent guide to Vallecito Lake."

## docs/ index
- `PROJECT-STATUS.md` — full status + launch readiness (read after this).
- `REVIEW-UPDATES-01..15.md` — chronological change specs (13 = nav; 14 = linking/polish; 15 = trust pass).
- `DATA-SOURCES.md` — every feed + exact endpoints. `FIRE-RESTRICTIONS.md` — restriction authorities.
- `DIRECTORY-CONTACTS.md`, `FEATURED-ASSETS.md` — business data/logos.
- `STRATEGY-nav-and-realtor.md` — competitor patterns + nav/realtor plan.
- `marina-weather-request.md`, `PHOTO-WISHLIST.md` — things to hand off to David/marina.
