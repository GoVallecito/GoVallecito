# Review Updates — Round 19: place the free photos (for Claude Code)

Goal: get real Vallecito imagery live across the site. Licenses/credits per image are in
`docs/FREE-IMAGES-VALLECITO.md` (the rights record — keep it updated with where each image is used).
Redeploy + push when done.

## 1. Fetch
- Run `bash scripts/fetch-free-images.sh` from the repo root → originals land in
  `assets-originals/free-images/` (kept OUT of `public/` — never deploy 8–22 MB files).
- Verify each is a real JPEG at roughly the expected resolution; report any failures.
- Optionally also grab the two Flickr originals (Lake Fireworks, Three Relics — URLs in the script
  comments) if retrievable without login; skip cleanly if not.

## 2. Optimize (no new tooling assumptions — use Python/PIL or sharp, whatever's available)
Create web copies in `public/assets/img/` (descriptive names, JPEG quality ~80):
- Hero/pagehero use: 1920px wide (≤ ~350 KB each).
- Inline/card use: 800–1000px wide (≤ ~150 KB).
- Keep aspect; no upscaling; strip EXIF.

## 3. Placement map (hero = `.pagehero` background; remember the gotcha: `.pagehero` needs its solid
`background-color:var(--pine)` base — already in CSS, don't remove)
| Image (original) | Page / spot |
|---|---|
| vallecito-reservoir-beall (lake panorama) | **Home hero background** — the flagship change |
| vallecito-rec-area-beall (shoreline) | things-to-do pagehero |
| vallecito-dam-beall | conditions pagehero (subtle, darkened overlay so tiles stay readable) |
| vallecito-community-beall (CR 501) | living-in-vallecito pagehero |
| los-pinos-river-beall | fishing pagehero (replaces the missing/placeholder `/assets/img/fishing.jpg` ref) |
| vallecito-aerial-lund | about page inline figure ("the whole lake at a glance") |
| vallecito-star-trails-lee | things-to-do stargazing section, inline figure |
| vallecito-creek-bridge-sfch | things-to-do trails section, inline figure |
| vallecito-creek-usfs / campground-creekside-usfs | first-visit pagehero or inline; campsite shot is ALSO the Round-20 camping-section image — place it on first-visit "where to stay" for now |
| vallecito-creek-1911-usfs (historic) | about page, "the valley's story" inline figure |
| weminuche-aspen-pd | first-visit seasonal-weather section or fall content, inline |
- Every `<img>` gets honest descriptive `alt`; heroes get `aria-hidden` treatment as decorative bg.
- Inline figures: `<figure>` + small `<figcaption>` credit (see #4). `loading="lazy"` on all inline
  images; hero images referenced via CSS bg (consider a `<link rel="preload">` for the home hero).
- Don't caption any stand-in as being Vallecito if it isn't (the aspen shot is Weminuche — caption it
  as such).

## 4. Attribution (REQUIRED for the CC BY/BY-SA images — legal obligation, not decoration)
- New anchored section on sources.html: **`#photo-credits`** — list every placed image: what/where used,
  author, license (linked to the license deed), source link. Add "Photo credits" to the footer linklist
  (next to Corrections).
- Inline figures additionally carry a quiet figcaption credit: "📷 Jeffrey Beall · CC BY 4.0".
- Hero/background images (no caption possible): covered by the #photo-credits section — that's
  acceptable for CC BY ("reasonable to the medium") as long as the section credits them explicitly.
- Public-domain images: courtesy credit "USDA Forest Service" in #photo-credits (not legally required).

## 5. Verify
- Hard-refresh / `?cb=` (edge cache). Check: home hero renders the lake (text readable — add a dark
  overlay/gradient if contrast suffers), all pageheroes paint with the solid color fallback intact,
  inline figures lazy-load with captions, #photo-credits lists every placed image, footer link works,
  mobile ~375px (heroes crop sensibly — set `background-position` thoughtfully).
- Lighthouse-style sanity: no image over ~350 KB shipped; total home-page image weight reasonable.
- Update `docs/FREE-IMAGES-VALLECITO.md` "where used" notes. Deploy Pages + push.
