# GoVallecito.com — Project Status & Launch Readiness

_Snapshot as of June 7, 2026. Preview is live; the public domain has NOT been cut over yet._

## Where everything lives
- **Preview (live on the web):** https://govallecito-web.pages.dev
- **Code repo:** github.com/GoVallecito/GoVallecito (`main`)
- **Real site:** govallecito.com — still the OLD site, untouched. Nothing publishes there until cutover.
- **Hosting:** Cloudflare Pages (static `public/`) + a Cloudflare Worker (`govallecito-conditions`, 15-min
  cron) that pulls every source, writes one `conditions.json` to KV, and serves it. Preview reads the
  Worker via its CORS endpoint; production serves it same-origin once the domain is attached (see runbook).

## What's built & working (Rounds 13–21 shipped)
**Live conditions dashboard** (auto-refresh 15 min; last-good cached; honest stale badges):
weather (NWS; marina PWS staged), lake level (USACE CWMS → USBR RISE; dead USGS gauge ruled out;
**72 h stale threshold**), streamflow (USGS), NWS alerts + Red Flag, fire restrictions (editor toggle,
Stage 1), wildfires within 50 mi (NIFC), **roads (CDOT/COtrip LIVE** — tight Durango-corridor filter,
honest CR-501 caveat). Each tile shows source + local-time "updated".

**Pages (20 + custom 404):** Home, Conditions, Things To Do (incl. Camping & RV, Where to eat), Fishing
(weekly report, 7 species, calendar, access, regs), **Lake Map** (Leaflet/OSM, 12 verified pins),
Directory, Real Estate (Julie — direct contact, no demo form), Plan Your Visit, **First Visit**, Living
in Vallecito (+6 sub-stubs, delinked "coming soon"), About, How We Verify (sources), Contact (direct
email), Pine River Lodge profile.

**Navigation:** grouped-dropdown header on every page (Conditions · Explore · Local Guide · Plan Your
Visit · About) + mobile hamburger + live conditions strip; consistent footer.

**Trust & SEO:** positioning statement; per-tile source/timestamp; editorial + corrections + photo-credits
on the sources page; real freely-licensed photography (credited); robots.txt, sitemap.xml, canonical +
Open Graph/Twitter on every page, JSON-LD (WebSite/Organization, BreadcrumbList, FAQPage, LocalBusiness),
favicons. No invented ratings/reviews anywhere.

## Open items that need DAVID (no code blocked on me)
1. **Marina weather** — free Weather Underground key for KCOBAYFI57 (+ station online); until then NWS.
2. **Julie** — confirm exact years / "25+ years in Four Corners" wording; courtesy heads-up before launch.
3. **Excel Excavation** — business Facebook Page or owner name+phone (slot reserved, unpublished).
4. **Vallecito Church** — logo (site is empty).
5. **Bayfield clinic** — name/phone (currently we list Mercy Hospital ER + 911 only).
6. **Map "drop-a-pin" asks** — north-end swim area, and exact pins for Country Market / Weminuche Grill
   (no authoritative coordinate found — excluded rather than guessed).
7. **COTRIP_KEY** is in chat transcripts — rotate when convenient (see runbook step 5).

## Launch readiness
**Launch-ready as a conditions + local-guide hub.** Content, live data, trust signals, and SEO plumbing
are in place. Remaining niceties (marina weather, more David photos, Living-Here guide content) can land
after launch without visible gaps.

---

## CUTOVER RUNBOOK (preview → govallecito.com)
Each step tagged **[DAVID]** (Cloudflare/registrar/Google account actions) or **[CLAUDE-CODE]** (repo
edits + redeploys). Order matters. Reversible — see Rollback.

0. **[DAVID — VERIFY FIRST] Where is the old site hosted?** Confirm the current host/registrar and DNS
   for govallecito.com (e.g., is DNS already on Cloudflare, or at another registrar?). This determines
   how the domain attaches and how rollback works. **Do not proceed until this is known.**
1. **[DAVID]** Add the **govallecito.com** zone to the Cloudflare account (if not already), then attach
   it as a **custom domain** on the `govallecito-web` Pages project — add both `govallecito.com` and
   `www.govallecito.com`. (Cloudflare will guide the DNS records; this is the step that moves traffic.)
2. **[CLAUDE-CODE]** Uncomment the `routes` block in `worker/wrangler.toml` (the
   `govallecito.com/data/conditions.json` + `www` routes), then redeploy the worker
   (`npx wrangler deploy` from `worker/`). This makes the worker own `/data/conditions.json` same-origin.
3. **[CLAUDE-CODE]** Flip `DATA_URL` in `public/assets/js/conditions.js` from the
   `…workers.dev/data/conditions.json` CORS URL back to same-origin `/data/conditions.json`; redeploy
   Pages (`npx wrangler pages deploy public --project-name=govallecito-web`).
4. **[DAVID + CLAUDE-CODE] Verify the live domain:** conditions paint on https://govallecito.com;
   `/data/conditions.json` is served by the worker (check response headers / `cf-ray`); all clean URLs
   return 200 (`curl -I https://govallecito.com/conditions` etc.); `robots.txt` + `sitemap.xml` reachable;
   hard-refresh / `?cb=` for edge cache. Then announce.
   - **Freshness assertion (do NOT skip):** `curl -s https://govallecito.com/data/conditions.json | jq .updated`
     must be within ~20 min of now. If it isn't — or the path 404s — the Worker route is NOT serving
     `/data/conditions.json`; the cutover is incomplete. Re-check the routes (step 2) / roll back (step 1)
     before announcing. (Round 33 deleted the stale committed `public/data/conditions.json`, so if the
     Worker route ever detaches, Pages now **404s** the path — fail-loud by design, not a frozen 200 — and
     `conditions.js` falls back to its localStorage last-good cache with stale badges.)
5. **[DAVID] Post-launch:** create the Google Search Console property and submit
   `https://govallecito.com/sitemap.xml`; **delete the stray `govallecito-site`** Worker project the
   importer made; **rotate `COTRIP_KEY`** (regenerate in manage-api.cotrip.org → `npx wrangler secret put
   COTRIP_KEY` from `worker/`); set the WU marina-weather secrets if/when available.

### Rollback
The new site only goes live at **step 1** (custom-domain attach). To roll back: **remove the custom
domain from the `govallecito-web` Pages project** (and revert the DNS change from step 1). Because the
old site lives on a separate host (per step 0 — **VERIFY**), it is unaffected by anything in this repo
until DNS actually points at Cloudflare; reverting DNS restores it. Steps 2–3 are repo-only and revert by
re-commenting the worker routes / restoring the `workers.dev` `DATA_URL` and redeploying.

## docs/ index
`PROJECT-STATUS.md` (this) · `REVIEW-UPDATES-01..21.md` (change specs) · `FREE-IMAGES-VALLECITO.md`
(photo rights record) · `DATA-SOURCES.md` · `DIRECTORY-CONTACTS.md` · `DAVID-QA-INSIDER.md` (pending
insider content) · `PHOTO-WISHLIST.md` · `REVIEW-PERSONAS-01.md` + `PERSONA-REVIEW-PROMPT.md`.
