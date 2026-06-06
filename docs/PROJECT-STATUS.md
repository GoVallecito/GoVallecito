# GoVallecito.com — Project Status & Launch Readiness

_Snapshot as of June 6, 2026. Preview is live; the public domain has NOT been cut over yet._

## Where everything lives
- **Preview (live on the web):** https://govallecito-web.pages.dev
- **Code repo:** github.com/GoVallecito/GoVallecito
- **Your real site:** govallecito.com — still the OLD site, untouched. Nothing publishes there until you say go.
- **Hosting:** Cloudflare Pages (static site) + a Cloudflare Worker (15-min cron) that pulls every data
  source, writes one `conditions.json` to KV, and serves it. Preview reads the Worker via its CORS
  endpoint; production will serve it same-origin once the domain is attached.

## What's built & working
**Live conditions dashboard** (auto-refresh every 15 min, calm "Checking…" first paint, last-good cached):
- Weather — NWS (marina PWS `KCOBAYFI57` staged, lights up when the free key is in + station online)
- Lake level — USACE CWMS / USBR RISE (the dead USGS gauge is permanently ruled out + guarded)
- Streamflow — USGS Vallecito Creek + Pine River, with "last updated"
- Weather alerts + Red Flag — NWS (automatic)
- **Fire restrictions — currently showing Stage 1** (San Juan NF; editor-controlled toggle)
- Wildfires within 50 mi — NIFC/InciWeb
- Roads — CDOT (safe default until the endpoint is set)

**Pages:** redesigned Home, Conditions (full dashboard + alerts + fire-restriction detail + emergency
contacts + fire-station table + map), Things To Do, Fishing, Local Guide/Directory, Real-Estate Partner
(Julie), Plan Your Visit, About, Contact, "How We Verify / Sources," and a "Living in Vallecito" landing
+ 6 stub pages (Phase-2 content to write later).

**Directory:** 8 categories incl. new **Local Services** + **Community**; tiered listings with **Featured
Partners** — Marina, Coronado Consulting & Fire Mitigation, Blue Spruce, Country Market, Vallecito Church,
and Julie. Real logos/photos wired for Marina & Coronado (Blue Spruce + Country Market added in Round 10).

**Trust & safety:** verified emergency contacts (incl. Poison Control, CPW, State Patrol, Search & Rescue)
with a disclaimer; sources page; honest "automated + locally curated" wording; AA-contrast pass (Round 10).

**Audits:** two external reviews (factual/credibility + UX/persona) addressed across Rounds 6–10.

## In-flight
- **Round 10** (contrast fixes + Facebook logo icons + featured-logo sizing + Blue Spruce/Country Market
  images) — prompt delivered; apply via Claude Code, then it's done.

## Open items that need YOU (no code waiting on me)
1. **Photos** — the single biggest visual upgrade. Drop files into `public/assets/img/` per
   `PHOTO-WISHLIST.md`; the hero, sections, and gallery are wired with graceful fallbacks.
2. **Marina weather** — a free Weather Underground API key from KCOBAYFI57's owner (and the station back
   online). Until then weather stays on NWS.
3. **Excel Excavation** — a business Facebook *Page* or owner name + phone (the link sent was a personal
   group profile); it's reserved but unpublished.
4. **Vallecito Church** — confirm the display name (you said "Community Church"; verified name is
   "Vallecito Church / Baptist") and provide a logo (its website is empty).
5. **Julie** — a courtesy heads-up before launch that she's featured (her info is already public).
6. Optional: a CDOT road-data endpoint; a real `og-default.jpg` social-share image.

## Go-live (the cutover — your Cloudflare account, ~20 min, reversible)
1. Add **govallecito.com** as a custom domain on the `govallecito-web` Pages project.
2. Deploy the Worker + activate its route for `/data/conditions.json` on the zone (uncomment `routes` in
   `wrangler.toml`); switch `conditions.js` `DATA_URL` back to same-origin.
3. (When available) set the WU secrets so marina weather goes live.
4. Verify the live domain, then announce. Old site is replaced only at this step.
- Housekeeping: delete the stray **`govallecito-site`** Worker project the dashboard importer created.

## My read on launch readiness
The site is **launch-ready as an information/conditions hub right now** — accurate, fast, trustworthy,
mobile-friendly, with live data and Stage-1 fire status showing correctly. The two things I'd want before
a public push: **(a) at least a hero photo or two** (so first-timers get the emotional hook), and **(b) a
final mobile eyeball** of the `/conditions` map + fire-station table. Everything else (marina weather,
more logos, Living-in-Vallecito content) can land *after* launch without anyone noticing gaps.
