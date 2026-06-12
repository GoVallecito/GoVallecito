# Analytics pipeline — build status (June 2026)

Built per `docs/REVIEW-UPDATES-ANALYTICS.md`. The dashboard at `/analytics`
(`public/analytics.html`, noindex, not in nav, excluded from sitemap) renders from
`/data/analytics.json`.

## What's built + deployed (CODE COMPLETE)
**Worker (`govallecito-conditions`, deployed):**
- `getAnalytics()` — one GraphQL POST to Cloudflare Web Analytics (RUM,
  `rumPageloadEventsAdaptiveGroups`) → visits, pageviews, top pages, referrers,
  device split, US share, an 8-week trend. **Verified live against the real RUM data.**
- `/__ev` counters are read from KV (`ev:<slug>:<action>`) into `partners[].clicks`;
  per-partner profile views come from the RUM page paths; partner list + names from
  the live `directory.json`.
- `refreshAnalytics()` merges CF + KV events + the editor seed → writes KV `analytics`
  (`meta.live=true`). Manual blocks (`ops` request/country export; `searchQueries`)
  come from the committed seed `public/data/analytics.sample.json`; `searchQueries` is
  blanked in live mode (never show sample queries as real).
- **New daily cron `0 9 * * *`** + manual trigger **`/__analytics`**.
- `wrangler.toml`: `CF_ACCOUNT_ID` + `WA_SITE_TAG` added as `[vars]`. Secret
  `CF_ANALYTICS_TOKEN` already set.

**Pages Functions (deployed with the site):**
- `functions/data/analytics.json.js` — serves the rollup SAME-ORIGIN from KV; falls
  back to `public/data/analytics.sample.json` if KV isn't bound / empty (so the
  dashboard never breaks; shows SAMPLE until live).
- `functions/__ev.js` — first-party action counter; POST `{slug,action}` →
  KV `INCR ev:<slug>:<action>`; 204 no-op if KV unbound. Same-origin (the Worker
  route isn't on the apex).

**Front-end:**
- `public/assets/js/partner-events.js` — cookie-free beacon; on any partner page,
  taps on call/text/book/website/email/social/directions links `sendBeacon('/__ev', …)`.
  Wired into all 9 partner pages (`partner-*.html` + `real-estate-partner.html`).
- `public/data/analytics.sample.json` — the SAMPLE seed + the real `ops` export
  (editor-maintained; the function's fallback and the Worker's manual-block source).

## REMAINING — David (Cloudflare dashboard, one-time) to flip it fully live
1. **Bind KV to the Pages project (REQUIRED for live data + click counting).**
   `govallecito-web` → Settings → Functions → KV namespace bindings → add
   **`CONDITIONS`** = the same namespace the Worker uses
   (id `e98b1300cb02405cb6da4f417c51b80c`). Redeploy Pages (any deploy) after.
   - Until this is done: `/data/analytics.json` serves the SAMPLE seed and `/__ev`
     drops events (no breakage, just not live).
2. **Cloudflare Access (PRIVACY — do before sharing real numbers).** Put
   **`/analytics`** and **`/data/analytics.json`** behind an Access policy (email
   allow-list). The data is served same-origin specifically so this wall covers it.
   ⚠️ Right now `/analytics` is reachable by anyone with the URL (noindex only).
3. **(Optional) Google Search Console** → verify govallecito.com (DNS TXT). Until
   wired, the dashboard's Search-queries table is empty in live mode (honest).
4. **Beacon (Web Analytics RUM):** already auto-injected by Cloudflare on the proxied
   zone (David enabled Web Analytics) — no manual `<script>` needed.

## Verify after step 1
- `curl https://govallecito.com/data/analytics.json | jq .meta.live` → `true`.
- Tap a partner's Call button, then re-run the Worker `/__analytics` (or wait for the
  09:00 UTC cron) → that partner's `clicks` increments.
- Dashboard SAMPLE ribbon disappears (`meta.live=true`).

## Notes
- The daily cron writes KV `analytics`; the Pages Function reads it. Both share the
  one `CONDITIONS` KV namespace.
- `ops` (request/country) is a periodic manual export living in
  `analytics.sample.json` — refresh it by editing that file.
- KV counter increments are read-modify-write (fine at click volume; not atomic).
