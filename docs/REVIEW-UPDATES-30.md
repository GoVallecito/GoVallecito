# Review Updates — Round 30: Middle Mountain page (for Claude Code)

One new page: `middle-mountain.html` — the dedicated ATV/OHV + horse + hiking hub for Middle Mountain
(FR 724), David-requested. **Content source (binding, incl. disambiguation + accuracy flags):**
`docs/MIDDLE-MOUNTAIN-CONTENT.md`. Build after/with Round 29. Deploy Pages + push.

## Page structure
1. Pagehero — "Middle Mountain" / "The lake's backyard mountain: 11 miles of road, ATV loops, a karst
   wilderness hike, and a 1920s ghost camp." (Reuse an existing aspen/shoreline hero image.)
2. **"Know before you ride" box at top** (the ride-legal essentials): trailer up — no OHVs on CR 501
   (state law, link respect-vallecito #ride-legal); $26.25 CPW registration; **download the Columbine
   MVUM before you drive (fs.usda.gov/media/73572) — no cell up there, and the MVUM is the legal map**;
   spark arrester; season ~June 1–Nov 30; Columbine RD (970) 884-2512.
3. **The routes** — a table/cards from the content doc: FR 724 itself, Beri ATV #812 (the ≤50" loop),
   Vallecito View #808, Runlett Park two-track, Dark Canyon #814 (single-track — phrase per the flag),
   Cave Basin #530 (foot/horse ONLY — Wilderness). Per-route: who's allowed, length, character, FS link.
   Make the vehicle-class column unmistakable (icons: 🚙 full-size / 🛻≤50" / 🏍️ moto / 🥾🐴 only).
4. **The destinations** — Tuckerville story (1913 rush → gone by 1929; look-don't-take/ARPA; Weaselskin
   as legend; the theisite world-type-locality nerd fact), Runlett Park, Cave Basin/Dollar Lake
   overlook, fall aspens on Beri.
5. **Horses & hikers** — Cave Basin + Vallecito View allow stock; share-the-trail note (machines in
   season); Wilderness rules at the boundary.
6. **Basecamp & services** — Middle Mountain CG (APPLY THE CORRECTION: reservable rec.gov, $28–32,
   late May–Sept, RV ≤35 ft, potable water, no horses — also fix this in things-to-do camping + map
   popup if they say first-come); Altitude ATV at the base (two-hop, "based at the bottom of Middle
   Mountain Road" only); no services/water/cell up top.
7. Honor EVERY flag in the content doc (no First/Second Notch, no staging-lot claim, "about 11 miles,"
   Hinsdale County fact OK, no invented gate dates/drive times, Pagosa #654 never linked).

## Wiring
- Nav: add **"Middle Mountain"** under **Explore ▾** (after Trails) on all pages.
- Cross-links: things-to-do 🏍️ ATV section → this page (trim any duplicated detail to a teaser);
  trails.html Cave Basin/Tuckerville entries → `middle-mountain.html` anchors; respect-vallecito
  #ride-legal ↔ this page; map.html — add verified-coord pins for Vallecito View TH + Cave Basin TH +
  Tuckerville road-end IF authoritative coords exist (FS pages/GNIS; verify-or-exclude as always) under
  the Trailheads category.
- Round-21 patterns (canonical/OG/breadcrumb/meta) + gen-sitemap re-run.

## After applying
Deploy + push. Verify: page live + in nav/sitemap; vehicle classes per route match the content doc; the
MVUM download link works; Middle Mountain CG correction applied in all three spots; map pins (if added)
have `src`; flags honored (grep: no "First Notch", no "654", no staging lot, no invented dates). Report
which map pins were added vs excluded.
