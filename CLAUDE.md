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
- **Data sources:** weather = **marina PWS LIVE** (`KCOBAYFI100`, Weather Underground; `WU_API_KEY` set Jun 8 2026) with NWS auto-fallback + 5-day; ⚠️ the station isn't reporting barometric pressure yet so `pressureInHg` is null and the anglers' barometer-trend is pending (ask marina to enable pressure on the console); lake = USACE CWMS →
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
- `WU_API_KEY` — **SET and WORKING (Jun 8 2026)** on `govallecito-conditions`; weather now reads the marina
  PWS **`KCOBAYFI100`** (verified: `sourceType:"pws"`, source "Vallecito Reservoir station (KCOBAYFI100)",
  real lakeside temp/wind/humidity). `WU_STATION_ID=KCOBAYFI100` (var). **Caveat:** the station's `pressure`
  field returns null, so `pressureInHg`/`pressureTrend` don't populate yet — the barometer is pending the
  marina enabling barometric (sea-level) pressure on the station console. NWS fallback still auto-engages if
  the PWS goes stale (>90 min).

## Workflow convention
Each change is specced in `docs/REVIEW-UPDATES-NN.md`, then built by Claude Code, deployed, pushed. Keep doing this.
- **FULL AUTOPILOT (David-approved June 7 2026):** David has granted Claude Code blanket permission for
  coding work — file edits, bash/PowerShell, web fetches, deploys, commits, pushes. Don't ask
  per-action permission; he reviews results visually + via Cowork project review after each run. (To
  make the prompts stop entirely: launch with `claude --dangerously-skip-permissions`, or add
  `"defaultMode": "bypassPermissions"` inside the `permissions` block of `.claude/settings.local.json`.)
  Standing exceptions that STILL require explicit David sign-off: the go-live domain cutover, anything
  touching money/accounts, and deleting data.

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
- **DONE — Round 21 (SEO + launch-readiness; built, verified, deployed + pushed):** robots.txt +
  sitemap.xml (20 URLs, clean canonical paths, git lastmod — `scripts/gen-sitemap.mjs`) + custom 404.html
  (nav + links) + favicons (PIL `scripts/gen_seo_assets.py`: favicon-32, apple-touch-icon, og-default.jpg
  1200×630 from Beall panorama). Per-page canonical + OG + twitter:card on all 20 pages; per-page og:image
  (heroes). JSON-LD: home WebSite+Organization, BreadcrumbList on all inner pages, FAQPage on first-visit
  (from visible content), directory LocalBusiness ×21 + Julie RealEstateAgent generated from directory.json
  via `scripts/gen-schema.mjs` (re-run after editing directory.json; markers in directory.html) — **no
  invented ratings/reviews**. Alt-text audit clean; internal cross-linking already strong. All 22 JSON-LD
  blocks validated. **PROJECT-STATUS.md rewritten + CUTOVER RUNBOOK added** (DAVID/CLAUDE-CODE steps +
  rollback; step 0 = VERIFY old-site host before cutover). Worker untouched.
- **DONE — Round 22 (built, verified, deployed Worker+Pages, pushed):** David's batch — spec in
  `docs/REVIEW-UPDATES-22.md`, trails content source in `docs/TRAILS-VALLECITO.md`. **B LIVE FIXES:**
  PRID annual corrected **$50→$60** (2026) site-wide; "or Vallecito Resort" PRID-outlet refs → "or Pine
  River Lodge" (3 spots; **"JW Vallecito Resort" business name preserved**); outlets = PRID office (13029
  CR 501) / Pine River Lodge / Vallecito Marina. **B HUB:** full 🎫 Licenses & permits hub on
  `fishing.html#permits` (3 `.tbl` tables — fishing/boating/trail+OHV — w/ cpwshop.com + PRID pay-page
  BUY links); all other pages keep only a "$6/day" teaser + link to the hub (prices stated once).
  **A:** home `.hero` scrim layer removed (CSS) — readability via text-shadow only, NO translucent
  overlay (verified desktop+mobile; `.pagehero` scrim left intact by design). **C:** new
  `public/trails.html` (cautions box w/ ⚠️ Oct 2025 flood — Middle Bridge on Vallecito Creek #529 washed
  out; Granite Peaks Ranch private inholding on Pine River #523; Wilderness regs; Emerald closure; trails
  by difficulty w/ FS numbers + `#t-<slug>` anchors); "Trails" added to Explore nav on all 20 pages;
  things-to-do 🥾 section → teaser + "Full trail guide →"; map Vallecito Creek TH pin → `trails.html#t-
  vallecito-creek` + washout caveat in popup. **D:** Julie photo removed from home dive-deeper Real
  Estate card (text-only `.ecard`). **E:** map text-list + popups — bold name IS the link, trailing
  "info"/"More info →" dropped (external→new tab, anchors→same tab). **F:** second Worker cron
  `0 13 * * SUN` → `generateWeeklyWater()` writes KV `weekly-water` → served at `/data/weekly-water.json`
  (+`/__weekly` manual); `fishing.html` shows editor `fishing-report.json` if fresh (<14d) else the auto
  block w/ honest "Auto-generated from live data, updated Sundays" label — **NO invented data** (real
  lake %/ft, inflow cfs, NWS outlook, seasonal bite, regs reminder). Sitemap re-run (21 URLs incl.
  /trails). **FLAG for David:** verify JW Vallecito RV details; rec.gov per-CG fees still link-only.
- **DONE — Round 23 (built, verified against the live RFW, deployed Pages, pushed):** spec in
  `docs/REVIEW-UPDATES-23.md`. **A (life-safety, front-end only):** when `alert.level === "danger"`
  (RFW / Stage 2) the slim condbar strip becomes a **full-width solid-red warning banner on EVERY page**
  — `🔴 {TITLE} — extreme fire danger · no open fires · details →` (uppercased `alert.title` so Stage-2
  reads right; RFW uses `redFlag` tagline), white bold centered, `aria-live="polite"`, links
  `conditions.html#alerts` (href derived from existing strip link so `../` subdir pages resolve). Logic
  in `conditions.js` `paintStrip()` (captures normal strip markup/href once, restores verbatim when the
  alert clears; runs before the temp/lake writes); CSS `.condbar-danger` in styles.css. Added a
  `visibilitychange` refetch (returns-to-stale-tab case) on top of the existing 15-min interval. Home
  alert tile already names the hazard ("Red Flag Warning") — verified, not generic. sources.html
  #how-we-verify alerts row now documents the exact-coordinate (37.336,−107.562, not a city zone) +
  RFW-priority protocol. **VERIFIED live** against the real June 7–9 RFW: banner red + correct text on
  home/conditions/directory, `../conditions.html#alerts` on business subdir, no JS errors. **B:** marina
  directory image → `marina-1.jpg` (boats at the dock; optimized 310KB→139KB, `imageAlt`+`imageFit:cover`;
  logo kept in `photos`). gen-schema re-run (doesn't consume `image`, schema unchanged). **C:** Vallecito
  Church — site is Constant Contact (redirect from vallecitochurch.org); rendered-source sweep found only
  stock graphics (Stronger Together / Give Online / Illumination Station / Join us for Worship), a generic
  mountain-lake landscape (stock, not the building), and their circular logo — **no photo of the actual
  building.** Per spec: church entry LEFT AS-IS, NOT pulled from Facebook. **FLAG for David:** ask the
  church directly for an exterior building photo (easy partner ask).
- **DONE — Round 23b / item A6 (built, verified both states, deployed Pages, pushed):** on
  conditions.html a new `#rfwLead` div sits above `#fire-restrictions`. While `alert.redFlag === true`,
  `conditions.js` `paintDetail()` renders the **RFW as the governing lead notice** (red `restriction-card
  is-danger`: "🔴 Red Flag Warning — extreme fire danger (through {ends})" + no-burn copy: no open flames
  incl. developed rings, propane/gas stoves & lanterns w/ shut-off valves only) and **demotes the Stage
  block** to ONE line ("Stage {n} fire restrictions remain in effect as the baseline and resume as the
  lead notice when this warning ends."). `{ends}` = latest RFW item end, lake-local time, via new
  `rfwEnds()` helper. When NWS drops `redFlag`, `#rfwLead` clears and the full Stage card auto-leads
  again — purely render-order driven by the live JSON. **VERIFIED:** live RFW (lead = RFW, Stage 1
  demoted, condbar red) AND a mocked cleared state via patched fetch + forced `visibilitychange` (lead
  gone, full Stage 1 card returns, condbar back to normal) — no console errors.
- **Round 24 (queued, approved June 7 2026):** preferred-partner profile pages — spec
  `docs/REVIEW-UPDATES-24.md`, repeatable process `docs/PARTNER-PROFILE-PROCESS.md`, researched facts
  `docs/PARTNER-PROFILES-RESEARCH.md`. Church main image from the About page
  (vallecito-church.constantcontactsites.com/about-vallecito-church-). Build `partner-<slug>.html` for
  marina, country-market, blue-spruce, coronado, vallecito-church (NOT Julie = bespoke; NOT Excel =
  unpublished). Standing rule: every NEW `tier:featured` partner gets a deep-dive + own page via the
  process doc. Honesty flags baked in: drop "non-ethanol" (Country Market), "ISA arborist" (Coronado),
  "yacht-club membership" (marina) — all unverified.
- **Round 25 mini (queued, approved June 7 2026):** spec `docs/REVIEW-UPDATES-25.md` — (A) hero
  mountain-silhouette artifact: `.hero:before` SVG overlay REMOVED by Cowork in the working tree
  (styles.css), verify + ship; (B) contacts accessibility: "🚨 Emergency & lake contacts" FIRST in the
  footer linklist on every page → conditions.html#contacts, + a compact tap-to-call contacts card pinned
  atop directory.html (use only the already-verified numbers from conditions). Build with Round 24.
- **Round 26 (queued, approved June 7 2026):** "Respect Vallecito" stewardship page — spec
  `docs/REVIEW-UPDATES-26.md`, verified content + binding accuracy flags in
  `docs/RESPECT-VALLECITO-CONTENT.md` (wow-facts: Weminuche 499,771 ac/Divide/14ers, 1868 Ute water +
  SUIT one-sixth interest, New Deal/CCC build, native Tier-1 bighorns, lynx return, CPW record fishery;
  rules each grounded in statute: OHV C.R.S. 33-14.5-108 — NO La Plata roads designated open, litter
  18-4-511, quiet hours, fireworks always illegal on NF, no drones in Wilderness, feeding wildlife $100,
  county Good Neighbor Policy for STR hosts). Tone: celebrate first, cooperative "we," never scolding.
  Inspired by a neighbor's ask; addressed to visitors AND full-timers.
- **Round 27 (queued, approved June 7 2026):** dam OUTFLOW — spec `docs/REVIEW-UPDATES-27.md`. CWMS
  series VERIFIED: `Vallecito.Flow-Res Out.Ave.~1Day.1Day.Raw-USBRSLC` (cms → cfs ×35.3147, daily,
  72h-stale like the lake). Adds `stream.outflow` to conditions JSON; shown on conditions #streamflow
  ("Outflow — dam → Pine River" + irrigation-release context), home tile ("In X · Out Y cfs"), weekly
  water bullet, sources row. FUTURE: same catalog has Vallecito SNOTEL SWE (`Depth-SWE...NRCS`) — a
  ready-made winter snowpack tile.
- **Round 28 (queued, approved June 7 2026):** fishing visuals + wildlife page — spec
  `docs/REVIEW-UPDATES-28.md`. (A) fish species BUTTONS w/ PD USFWS illustrations (`FISH-SPECIES-IMAGES.md`
  — Duane Raver matched set, public domain; use correct walleye NOT sauger); (B) fishing pagehero →
  person fishing (cogdog CC BY 2.0 Vallecito frame if usable, else generic captioned honestly); (C)
  guides `#guides` → two-hop logo/thumb card grid (logos from guides' own sites, text fallback); (D) new
  `wildlife.html` anchored on **Bear Smart Durango** (content `WILDLIFE-CONTENT.md`) — bears/moose/lions/
  elk-deer/eagles/rattlesnakes/scavengers/cattle, one behavior-change each, binding accuracy flags
  (rattlesnakes=lower-elevation, non-lead=best-practice-not-rule, "local nonprofit" not a tax class,
  fight-back=black-bear-specific). Nav "Wildlife" under Plan Your Visit.
- **Round 29 (queued, approved June 7 2026):** Living Here guides ×6 — spec `docs/REVIEW-UPDATES-29.md`,
  verified content + tone rules ("the old way" lens, helpful-local, never smug) in
  `docs/LIVING-HERE-CONTENT.md`. SITE-WIDE CORRECTIONS bundled: CodeRED→**LPC Alerts!** sweep, SJBPH→
  **La Plata County Public Health**, Bayfield clinic VERIFIED = **CommonSpirit Primary Care Bayfield
  (970) 764-9150** (resolves R18 flag; add to contacts ×3), CenturyLink-not-Brightspeed, AlignTec.
  Headlines: CR 501 = Level 1 plow priority; real snowfall ~85 in/yr at the dam (NOT 200+); Clearnetworx
  fiber building up CR 501 NOW (~summer 2026); school bus Route 23 from "Top of Vallecito"; FAIR Plan
  April 2025; wells <35 ac = household-use-only; septic $110 acceptance doc at sale.
- **Round 29 content UPDATED (June 2026):** `LIVING-HERE-CONTENT.md` now carries David's confirmations
  (USPS/FedEx/UPS/Amazon deliver; NO July-4 fireworks for years — fireworks photo = historic only;
  Winterfest active; WM Wednesday trash + biweekly recycling at the lake; Basin Co-op + Ferrellgas =
  reliable propane, no negative supplier claims; Clearnetworx wires visibly going up at the lake, not
  live) + the UPRFPD deep-dive (3 of 8 stations staffed 24h incl. Station 4 North Vallecito; ALS ≤8-min
  goal; CAAS perfect score; 2026 slash days May 15–16 + June 19–20 at McCarty's gravel pit 14015 CR 502
  — published name, NOT "Ferris"; vallecitorecovery.com flood sponsorship; DON'T publish ISO/mill rate).
- **Round 30 (queued, approved June 2026):** Middle Mountain page — spec `docs/REVIEW-UPDATES-30.md`,
  content `docs/MIDDLE-MOUNTAIN-CONTENT.md`. David: OHVs ARE allowed up there (FS routes). Key finds:
  **Beri ATV Trail #812** (3.4 mi ≤50" loop off FR 724 — new, wasn't in trails research), Vallecito View
  #808, Runlett two-track, Dark Canyon #814 single-track (no ATVs, 1-src), Cave Basin = Wilderness
  foot/horse only; Tuckerville is in HINSDALE County; theisite world type locality; NO "First/Second
  Notch" anywhere; Middle Mountain CG correction (reservable rec.gov $28–32, no horses). Nav under
  Explore. Build with/after Round 29.
- **Phase 2 remaining:** seasonal guides (blocked on David's insider Q&A),
  weekly fishing report feed (needs marina/guide source), species deep-pages, photo gallery,
  AI-search Q&A pages. Positioning: "the most complete independent guide to Vallecito Lake."

## docs/ index
- `PROJECT-STATUS.md` — full status + launch readiness (read after this).
- `REVIEW-UPDATES-01..15.md` — chronological change specs (13 = nav; 14 = linking/polish; 15 = trust pass).
- `DATA-SOURCES.md` — every feed + exact endpoints. `FIRE-RESTRICTIONS.md` — restriction authorities.
- `DIRECTORY-CONTACTS.md`, `FEATURED-ASSETS.md` — business data/logos.
- `STRATEGY-nav-and-realtor.md` — competitor patterns + nav/realtor plan.
- `marina-weather-request.md`, `PHOTO-WISHLIST.md` — things to hand off to David/marina.
