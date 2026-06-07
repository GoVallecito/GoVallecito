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
- **Later (from June 2026 strategy review, David-approved order TBD):** fishing hub v1 (species pages,
  calendar, weekly report via editor file), interactive Leaflet map, insider-knowledge + seasonal content
  (needs a David Q&A session). Skipped for now: community submissions.
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
