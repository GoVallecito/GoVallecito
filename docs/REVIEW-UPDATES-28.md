# Review Updates — Round 28: fishing page visuals + wildlife page (for Claude Code)

Four items. Image sources: `docs/FISH-SPECIES-IMAGES.md`. Wildlife content: `docs/WILDLIFE-CONTENT.md`.
Deploy Pages + push.

## A. Fish species buttons + images on fishing.html
Turn the species at-a-glance into a clean **species selector**: a row of buttons (one per species —
rainbow, brown, kokanee, pike, walleye, smallmouth, perch), each with the PD USFWS illustration as a
thumbnail + the name. Clicking a button reveals/scrolls to that species' existing `#<species>` section
(the deep sections from Round 16 already exist) — pure CSS/anchor or tiny JS, no framework. Keep the
at-a-glance table too (or fold it in). Place a species illustration in each species section as well
(small inline figure). Images: download the set in FISH-SPECIES-IMAGES.md → optimize to
`public/assets/img/fish/` (~400–600px, ≤60 KB). PD = no attribution required, but add a single
"Fish illustrations: U.S. Fish & Wildlife Service (public domain)" line to #photo-credits. **Use the
correct walleye plate (NOT the sauger).** Mobile: buttons wrap to a grid, big tap targets.

## B. Fishing pagehero → person fishing
Replace the fishing pagehero background (currently `hero-los-pinos.jpg`, a creek) with a **person-fishing**
hero per FISH-SPECIES-IMAGES.md (prefer the cogdog CC BY 2.0 Vallecito angler frame if a usable one
exists; else a generic Unsplash/Pexels angler, captioned honestly). Optimize ≤350 KB; keep readability
(text-shadow, no scrim — matches the home hero treatment). Move los-pinos to an inline figure in the
streamflow/regs area if you like. Credit in #photo-credits if CC BY.

## C. Guides as buttons with logos/thumbnails
The `#guides` list at the bottom of fishing.html → a **card/button grid**. For each guide (Fisher Guide
Service, Vallecito Lake Outfitters, Charter Vallecito, Go Fish Durango — all in directory.json under
Outfitters & Guides), make a tappable card: logo or a representative thumbnail + name + one-line + phone.
Gather each guide's logo/photo from their own website first (they're verified-tier businesses — courtesy
basis, same as the partner images); Facebook only if no site image. Download → optimize
(`public/assets/img/guides/`, ≤80 KB) → `imageAlt`. Each card is a **two-hop** link to
`directory.html#biz-<slug>` (where the external site link lives), consistent with the site's pattern —
NOT straight off-site. If a logo can't be found for one, use a clean text card (emoji 🎣 + name) so the
grid stays consistent. Record any images pulled in FREE-IMAGES (courtesy-of-business basis).

## D. New wildlife.html page (Bear Smart Durango–anchored)
Build `wildlife.html` from `docs/WILDLIFE-CONTENT.md` (binding accuracy flags). Structure:
- Pagehero "Wildlife & you" / warm sub ("We share this valley with bears, moose, eagles and elk — a few
  small habits keep them wild and everyone safe"). Reuse an existing hero image (aspen or shoreline).
- Lead with 2–3 of the striking verified facts (La Plata bear stats; moose-not-bears; "a candy bar is
  all it takes").
- **Bear Smart Durango** authority block (who they are + link + the bear hotline + $100 rebate).
- **Species blocks** (🐻 bears, 🫎 moose, 🦁 lions, 🦌 elk/deer, 🦅 osprey/eagles, 🐍 rattlesnakes,
  🦝 camp scavengers, 🐄 open-range cattle) — each with the ONE headline behavior change + CPW/source
  link. Honor every accuracy flag (non-lead = best practice not rule; rattlesnakes = lower-elevation;
  cattle = courtesy; "local nonprofit" not a tax class; fight-back advice is black-bear-specific).
- **Report-it box** (970) 247-BEAR + CPW + 911.
- **Hosts box** (Bear Smart vacation-rental guidance + flyer link + BearWise).
- Nav: add **"Wildlife"** under **Plan Your Visit ▾** (after Respect Vallecito) on all pages.
  Cross-links: respect-vallecito ↔ wildlife (feeding law / bear trash), first-visit common-mistakes,
  camping section (bear/cooler rules), trails (moose/dogs, cattle). Canonical/OG/breadcrumb + sitemap
  re-run + meta. Standard header (RFW banner present).

## After applying
Deploy + push. Verify: fish buttons render with illustrations + jump to sections (mobile grid works);
walleye image is a walleye not a sauger; fishing hero shows a person fishing (honest caption); guide
cards are two-hop links with logos/thumbs (or clean text fallback); wildlife.html live + in nav/sitemap
with every accuracy flag honored and all source links resolving. Report: which guide logos were found
vs. text-fallback; which fishing hero option was used (cogdog vs generic); any fish plate that needed a
photo fallback.
