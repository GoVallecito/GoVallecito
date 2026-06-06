# GoVallecito conditions worker

A Cloudflare Worker that fetches every live source on a **15-minute cron**,
normalizes them into a single `conditions.json`, and serves it from Workers KV.
The website **only ever reads `conditions.json`** — no visitor browser calls a
third-party API. This is what kills the slow "--" placeholder load.

> **Status: staged locally, NOT deployed.** Deploying needs a Cloudflare account
> and `wrangler` login, which we are intentionally holding off on. Everything
> below is the runbook for when we're ready.

## Files
- `conditions-worker.js` — the pipeline + the `GET /data/conditions.json` route.
- `wrangler.toml` — bindings, the cron trigger, the data route, and config vars.

## Site hosting (Cloudflare Pages)
The static site is the **`public/`** folder — it is self-contained (`index.html`
plus the `assets/` and `data/` it references, all paths resolve from that root).
In the Cloudflare Pages project settings:

- **Build command:** *(none — it's a plain static site)*
- **Build output directory:** `public`
- **Root directory:** repo root (leave default)

Pages serves every static path (HTML, `/assets/*`, and `/data/restrictions.json`,
`/data/listings.json`). The one dynamic path, `/data/conditions.json`, is served
by the Worker — see below.

## How `/data/conditions.json` is served in production
The site fetches **same-origin** `/data/conditions.json`. In production that path
is owned by **this Worker**, not by Pages:

1. The Worker's `fetch` handler already returns `conditions.json` from KV with
   `Cache-Control: max-age=300`.
2. A **Worker Route** on the live zone (`govallecito.com/data/conditions.json`,
   see the commented `routes` in `wrangler.toml`) makes that one path hit the
   Worker. A Worker route on the same zone takes precedence over the Pages site,
   so everything else stays static while this path is live data.
3. The cron (every 15 min) keeps KV fresh; the route just reads it.

So one Worker does both jobs — **writes** KV on the cron and **serves** the read
on the route. No new code, and the site code is unchanged (still same-origin).

> The committed `public/data/conditions.json` is only a local-dev seed (served by
> the local static server). In production the Worker route shadows it with live
> KV data, so they never conflict.

**Alternative (if you'd rather not use a Worker route):** bind the same KV
namespace to the Pages project and add a Pages Function at
`public/functions/data/conditions.json.js` that returns `env.CONDITIONS.get('conditions')`.
If you do this, **delete** `public/data/conditions.json` first (a static file at
that path would shadow the Function). You'd still need this Worker for the cron
write. The Worker-route approach above is simpler (one deployable, no code change),
which is why it's the wired default.

### Deploy order
1. Push to GitHub (done) → connect the repo in Cloudflare Pages with the settings
   above → first Pages deploy.
2. Add the custom domain `govallecito.com` to the Pages project.
3. Deploy the Worker (next section) and uncomment its `routes` in `wrangler.toml`
   so it claims `/data/conditions.json` on the domain.

## Sources (all in `conditions-worker.js`, see `docs/DATA-SOURCES.md`)
| Tile | Source | Key needed |
|------|--------|------------|
| Weather | Weather Underground PWS (marina) → NWS fallback + 5-day | WU key (free) |
| Lake level | USGS `09353000` storage + elevation | no |
| Streamflow | USGS `09352900` + `09352800` discharge | no |
| Alerts / Red Flag | NWS active alerts | no |
| Wildfires | NIFC WFIGS ArcGIS, within 50 mi | no |
| Roads | CDOT / COtrip US-160 + CR 501 | maybe |
| Fire restrictions | `data/restrictions.json` (editor toggle) | no |

Each source is wrapped in `safe()`: if a fetch fails, the **previous good value
is kept and marked `stale: true`** so one outage can't blank the dashboard.

## Deploy (later)
```bash
cd worker
npx wrangler login
npx wrangler kv namespace create CONDITIONS      # paste the id into wrangler.toml
npx wrangler secret put WU_API_KEY               # free PWS key from the marina's WU account
npx wrangler secret put WU_STATION_ID            # e.g. KCOBAYFI12 (or set in [vars])
# optional: ACCUWEATHER_KEY, CDOT_KEY, AIRNOW_KEY
npx wrangler deploy
```
Test without waiting for the cron: visit `/__refresh` (forces a fetch+write and
returns the JSON), then `/data/conditions.json` (serves from KV).

## How David flips fire restrictions
Edit **`data/restrictions.json`** (committed in the repo — no code, no deploy of
the worker needed):
```json
{ "stage": "1", "issuedBy": "San Juan National Forest",
  "url": "https://...", "note": "No campfires outside developed rings.",
  "updated": "2026-06-20" }
```
- `stage`: `"none"`, `"1"`, or `"2"`.
- The worker reads it every 15 min via `RESTRICTIONS_URL` and folds it into the
  Alert tile using the BUILD-SPEC precedence (Red Flag or Stage 2 → danger;
  Fire Weather Watch or Stage 1 → warn).
- Set `stage` back to `"none"` when the ban lifts.

## Open items before go-live
- **WU station ID + free API key** from the marina's Weather Underground account.
- **CDOT/COtrip endpoint** (`CDOT_ENDPOINT`): until set, Roads shows a safe
  "Clear" default (`status: "unconfigured"`).
- Confirm the USGS storage parameter actually populates for `09353000`
  (worker tries `00054`, then `00062`).
