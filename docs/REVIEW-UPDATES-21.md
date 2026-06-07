# Review Updates — Round 21: SEO / discoverability + launch-readiness (for Claude Code)

The content is in good shape; this round makes it findable and cutover-ready. All static-site work,
worker untouched. Redeploy + push.

## 1. Crawl plumbing
- **robots.txt** — allow all, point to sitemap. **sitemap.xml** — all 21 public pages, canonical
  `https://govallecito.com/<clean-url>` paths (correct even pre-cutover), `lastmod` from git where easy.
- **Custom 404.html** (Cloudflare Pages serves it automatically): friendly, on-brand, links to home /
  conditions / map / directory. Include the nav header.
- **Favicon set** if missing (a simple 🏔️/lake-pine mark is fine; generate 32px + 180px touch icon).

## 2. Per-page meta (audit all 21 pages)
- `<link rel="canonical">` → `https://govallecito.com/<clean-url>` on every page (home already has one).
- Unique `<title>` + `<meta name="description">` everywhere (most exist — audit for dupes/missing).
- **og:title / og:description / og:image / og:url + twitter:card** on every page.
- **og-default.jpg**: create 1200×630 from `assets-originals/free-images/` lake panorama (Beall CC BY 4.0
  — fine for derivatives; note the og crop in the `#photo-credits` table + FREE-IMAGES doc). Per-page
  og:image where natural: fishing → hero-los-pinos, conditions → hero-dam, things-to-do → hero-shoreline,
  first-visit → hero-vallecito-creek, else og-default.

## 3. Structured data (JSON-LD, static — the directory is JS-rendered, so schema must be inlined)
- Home: `WebSite` + `Organization` (name, url, logo, sameAs none yet).
- All inner pages: `BreadcrumbList` (Home → section → page, matching the nav groups).
- first-visit: `FAQPage` from its real Q&A-style content (and/or home's at-a-glance Q&A — pick ONE page
  for FAQPage to avoid duplicate-FAQ spam; first-visit is the better fit).
- directory.html: inline a `<script type="application/ld+json">` block of `LocalBusiness` entries
  **generated from directory.json at build time** (write a small script `scripts/gen-schema.js|py` that
  reads directory.json → emits the JSON-LD; re-run it whenever directory.json changes — note this in the
  file's _comment). Include only published businesses with verified name/phone/address; tier doesn't
  matter. Julie's entry: `RealEstateAgent` type.
- fishing: `Article`-ish is overkill — skip; map: skip. No invented ratings/reviews ANYWHERE (schema
  spam kills trust with Google and humans).

## 4. Alt-text + internal-link audit
- Sweep every `<img>` for missing/weak `alt` (decorative → `alt=""`; informative → descriptive).
- Internal links: every content page should contextually link ≥3 related pages (fishing ↔ conditions ↔
  map ↔ first-visit ↔ directory etc.). Fix orphans; don't force it where unnatural. Footer doesn't count.
- Check the two-hop pattern still holds (no page deep-links straight off-site where a directory anchor
  exists).

## 5. Launch-readiness checklist → update docs/PROJECT-STATUS.md
Refresh PROJECT-STATUS.md to current state (Rounds 13–21 shipped) and add a **CUTOVER RUNBOOK** section:
1. David: add govallecito.com zone to the Cloudflare account (if not already), attach custom domain to
   the `govallecito-web` Pages project (+ www).
2. Uncomment the worker `routes` in `worker/wrangler.toml`, redeploy worker.
3. Flip `DATA_URL` in `public/assets/js/conditions.js` to same-origin `/data/conditions.json`, redeploy
   Pages.
4. Verify: conditions paint on the live domain; `/data/conditions.json` served by the worker (check the
   `cf-ray`/headers); all clean URLs 200; sitemap reachable; hard-refresh for edge cache.
5. Post-launch: submit sitemap in Google Search Console (David creates the property), delete the stray
   `govallecito-site` project, rotate COTRIP_KEY.
Each step marked DAVID or CLAUDE-CODE. Include the rollback (detach domain → old site unaffected since
it lives elsewhere until DNS moves — VERIFY where the old site is hosted before writing this step).

## After applying
Deploy + push. Verify: sitemap/robots/404 live; spot-check og tags + canonical on 5 pages; JSON-LD
validates (paste one page into a validator or use a quick script); no alt-text regressions; PROJECT-STATUS
runbook reads as a step-by-step David can follow. Report anything skipped.
