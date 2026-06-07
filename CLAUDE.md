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
  (currently Stage 1); roads = CDOT (being wired via COtrip key).

## Deploy / commands (David is wrangler-logged-in)
- Pages: `npx wrangler pages deploy public --project-name=govallecito-web`
- Worker: from `worker/`, `npx wrangler deploy`
- Commit + push to GitHub after each change.
- Secrets (in Cloudflare, never in repo): `npx wrangler secret put NAME`.

## Secrets / config state
- `COTRIP_KEY` — **SET on `govallecito-conditions` (June 6 2026), but the value is REJECTED by the COtrip
  API.** Empirically (probed direct + via `/__cdottest`): base `https://data.cotrip.org/api/v1/` is
  correct and the gateway recognizes routes; `roadConditions` + `incidents` routes EXIST (HTTP 403) but
  the key is not accepted — **every request returns 403 "Not Authorized" (Akamai), identical with the
  key, without a key, and across all param-name variants** (`apiKey`/`key`/`api_key`/`apikey`/`ApiKey`
  query + `Ocp-Apim-Subscription-Key`/`apiKey` headers). `cameras` + root return 404 "not defined by this
  API" → that route isn't in the plan (matches: **Cameras is a separate subscription, NOT active**).
  Conclusion: this is a **key activation / wrong-value problem, not a code problem.** The value looks like
  a 4-group dashed license code, not a typical API key. **David to verify in `manage-api.cotrip.org`:**
  (1) the subscription is *approved/active* (CDOT approves manually); (2) copy the real API key from
  "API Access URLs / subscriber API details"; (3) Road Conditions + Incidents products are attached.
  Until a working key is in, `getRoads()` stays the safe "Clear" default. Subscription per portal =
  Incidents/Planned Events/Weather Stations/Road Conditions.
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
- **In progress:** CDOT integration. A TEMP diagnostic route `/__cdottest` exists in the Worker to probe
  CDOT feeds server-side (so the key isn't exposed in the shell). **Deploy worker → hit /__cdottest →
  use the output to wire `getRoads()` (live road conditions) and, if the cameras feed returns data,
  upgrade the Plan-Your-Visit camera tiles to live stills. REMOVE `/__cdottest` + `cdotProbe()` after.**
- **Round 13 (queued, approved):** grouped-dropdown top nav + retire the scrolling realtor bar → a
  "Real Estate at the Lake" featured card (home + directory) + Real Estate in nav/footer. Spec in
  `docs/REVIEW-UPDATES-13.md`.
- **Pending on David:** photos (`docs/PHOTO-WISHLIST.md` → `public/assets/img/`); marina `WU_API_KEY`;
  Excel Excavation data + Vallecito Church logo; a heads-up to Julie; the **go-live cutover** (attach
  govallecito.com to Pages, activate the Worker route in wrangler.toml, flip `conditions.js` DATA_URL to
  same-origin); delete the stray **govallecito-site** Worker project from the dashboard importer.
- **Phase 2 roadmap:** weekly fishing report, species pages, seasonal guides, Living-in-Vallecito content,
  photo gallery, schema (FAQ/LocalBusiness/Article/Breadcrumb), image alt-text, internal linking,
  AI-search Q&A pages. Positioning: "the most complete independent guide to Vallecito Lake."

## docs/ index
- `PROJECT-STATUS.md` — full status + launch readiness (read after this).
- `REVIEW-UPDATES-01..13.md` — chronological change specs (13 = nav + realtor card).
- `DATA-SOURCES.md` — every feed + exact endpoints. `FIRE-RESTRICTIONS.md` — restriction authorities.
- `DIRECTORY-CONTACTS.md`, `FEATURED-ASSETS.md` — business data/logos.
- `STRATEGY-nav-and-realtor.md` — competitor patterns + nav/realtor plan.
- `marina-weather-request.md`, `PHOTO-WISHLIST.md` — things to hand off to David/marina.
