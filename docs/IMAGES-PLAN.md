# Vallecito imagery expansion — gallery page + per-page visuals (plan + sourcing)

David wants the site to feel visually alive: **a dedicated gallery PLUS more images woven through existing
pages**, spanning **full history → modern** (Ute heritage, the dam/New Deal, old Vallecito families, and
today's fishing/boating/hiking/stargazing/wildlife). This doc is the plan + a vetted sourcing map so the
build (Claude Code, via the Round 19 image process) ships only properly-licensed, honestly-captioned images.

## Non-negotiable licensing rule (project standard)
Ship an image ONLY if its license is verified **public domain or an explicit CC license that allows reuse**,
with a real source recorded. Honest captions — never imply a generic photo is a specific Vallecito
person/place if it isn't. Everything gets a row in the `#photo-credits` table on `sources.html`
(author → source, license → deed) plus an inline figcaption. When in doubt, **exclude or link out** (don't
rehost). This mirrors how Round 19 + the partner photos were handled.

## Sourcing map (by gallery category)
**1. Ute heritage & the "little valley"** — *public domain, federal:*
- Library of Congress Prints & Photographs (search "Ute") — PD. https://www.loc.gov/pictures/
- National Archives (NARA) Catalog — Ute / Southern Ute, PD. https://catalog.archives.gov/
- Smithsonian Open Access (NMAI/BAE) — many CC0. https://www.si.edu/openaccess
- Denver Public Library Western History digital collection — verify per-image. https://history.denverlibrary.org/research/western-history/photographs
- Caption honestly: "Ute / Southern Ute people, <date>, <source>" — don't fabricate a specific-to-Vallecito claim. Vallecito = Spanish "little valley," ancestral Ute (Weenuchiu) territory.

**2. The dam & the New Deal (1938–1941)** — *public domain, federal:*
- Bureau of Reclamation project page + photo archive (Pine River Project / Vallecito Dam). https://www.usbr.gov/projects/index.php?id=383
- USACE (built/now-operates flood control). Construction by the Army Corps = federal, PD.
- Center of Southwest Studies (Fort Lewis) — digitized **Vallecito Dam construction album, 1938–40** (Maj. C.A. Burns; accession 2005:09015). Federal-origin photos likely PD, but **confirm rights with the Center** before rehosting. https://swcenter.fortlewis.edu/finding_aids/inventory/PineRiver.htm
- Living New Deal — Vallecito Dam entry (verify photo license). https://livingnewdeal.org/sites/vallecito-dam-and-reservoir-bayfield-co/
- Wikimedia Commons "Vallecito Dam" (check each file's license).

**3. Old Vallecito & early families** — *mixed; verify or get permission:*
- Pine River Library Digital Archives — Vallecito-area history photos. https://prlibrary.cvlcollections.org/iiif-items/tree — **likely rights-reserved; ask Friends of Pine River Public Library for reuse permission** (community ask; flag for David).
- Denver Public Library Western History — early La Plata/Pine River; verify per-image.
- Wikimedia Commons (1915 Bayfield flood, early Pine River) where PD.

**4. The lake today — recreation** (fishing · boating · hiking/trails · campgrounds) — *public domain / CC:*
- USDA Forest Service San Juan NF site + the agency's **Flickr** (PD/CC). https://www.fs.usda.gov/r02/sanjuan/recreation
- USBR reservoir photos (PD). USGS (PD).
- Flickr Creative Commons (filter BY/CC0) — Vallecito Lake recreation; verify license + caption author.

**5. Wild & scenic** (Weminuche Wilderness, wildlife, seasons, **night skies/stargazing**) — *PD/CC:*
- USFS / NPS / USFWS (wildlife) — PD. https://www.fws.gov/
- NPS night-sky program / USFS dark-sky imagery (PD) for the stargazing set; caption honestly if not the exact Vallecito sky.

> Reuse what the site already has (Round 19 set: `hero-shoreline`, `creek-bridge`, `campground-creek`,
> `star-trails`, `hero-dam`, etc.) inside the gallery too — don't re-fetch those.

## Deliverable A — the gallery page (`public/gallery.html`)
- Title: **"Vallecito in Pictures"** (H1 "Vallecito through the years"). `noindex` NO — this should be
  indexable (good for image SEO). Canonical + OG like other pages; title `… | GoVallecito`.
- Sectioned by the 5 categories above, each a short intro line + a **responsive image grid** with
  **click-to-enlarge lightbox** (reuse the directory.html lightbox pattern — already built + accessible).
- Every image: honest `alt`, a visible caption with **date + source + license**, lazy-loaded, optimized.
- Add **"Gallery"** to the nav (Explore group reads well: Things To Do · Fishing · Trails · Middle Mountain ·
  Lake Map · Gallery) — site-wide nav sweep, byte-safe. Link it from the home page and About.
- Add all gallery images to `sources.html#photo-credits`.

## Deliverable B — per-page visuals
Seed 1–3 inline figures (or a hero) on the thinner/text-heavy pages, drawing from the same sourced set:
- `about.html` → heritage + dam-construction history images.
- `respect-vallecito.html` → Ute heritage / stewardship image.
- `fishing.html` → an action fishing/boat shot (beyond the existing fish illustrations).
- `things-to-do.html` → already has several; add 1–2 (hiking, stargazing) if light.
- `wildlife.html` → USFWS species photos.
- `living-in-vallecito.html` / `plan-your-visit.html` → a seasonal/scenery figure each.
- Home → a small rotating set or one more scenic band (optional).

## Build process (Claude Code — same as Round 19; byte-safe)
1. Add the verified image URLs to `scripts/fetch-free-images.sh`; fetch originals into the gitignored
   `assets-originals/`.
2. Optimize via `scripts/optimize_images.py` → `public/assets/img/` (gallery thumbs small ≈≤120 KB; inline
   figures ≤150 KB; heroes ≤349 KB; strip EXIF). New gallery images under `public/assets/img/gallery/`.
3. Build `gallery.html` + the per-page figures; add the nav item site-wide; update `sources.html`
   credits; re-run `gen-sitemap.mjs`.
4. **Verify-or-exclude:** only ship images with a confirmed license + recorded source; drop anything
   ambiguous and note it in the build report (exactly like the Round 17/20 map-pin discipline).
5. Byte-check all touched HTML before deploy; deploy; push.

## Flag for David (community ask)
For the richest **old-Vallecito family photos**, email the **Pine River Library / Friends of Pine River
Public Library** (they hold the digital archive + the original dam-construction album) asking permission to
feature a few with credit — same playbook as partner photos. That's the one source that can give the page
genuine local soul, and it's a relationship worth having anyway.
