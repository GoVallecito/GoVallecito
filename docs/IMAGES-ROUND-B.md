# Images Round B — finish the gallery + give every page header a fitting hero

Follow-up to `IMAGES-PLAN.md`. The gallery page (`public/gallery.html`) was **rewritten by Cowork**:
expanded educational copy per section, a feature-image + hover-zoom grid layout, a Vallecito aerial hero,
a jump-nav, and a new **Wildflowers** section. All off-Vallecito "representative" images were removed.
**Byte-safe edits only; verify-or-exclude; honest captions; credit on `sources.html#photo-credits`.**

## Task 1 — Finish the gallery imagery (all must be Vallecito / its immediate surroundings)
- **Wildflowers section (`#flowers`)** currently has copy but no photos. Fetch + add CC/PD images taken in
  the **San Juans around Vallecito / the Weminuche** of: Colorado blue columbine, Indian paintbrush, lupine,
  mountain bluebells/elephant heads, and an alpine-basin bloom. Caption honestly (species + where shot).
- **The lake today (`#today`)**: add a **boating/marina** shot and a **fishing-with-a-catch** shot if you
  can find genuinely Vallecito (or honestly-captioned San Juan NF) CC/PD images. A USFS Vallecito-reservoir
  photo is ideal.
- **Optional cleanup:** the now-unused off-target files can be deleted from `public/assets/img/gallery/`
  and their `sources.html` rows removed: `rec-williams-creek-reservoir`, `rec-haviland-lake`,
  `rec-ice-lakes-hike`, `wild-ice-lake-basin`, `wild-aspen-gold`, `wild-milkyway`.
- Keep the feature/grid markup pattern Cowork used (`.gfeature` for the lead image, `.gallery-grid figure`
  with a `.gimg` wrapper for the rest, every `<img>` gets `class="zoomable"` + `data-cap`).

## Task 2 — "Every header has an image that directly applies, appealing and colorful" (David)
Give each **plain** pagehero a relevant, colorful Vallecito `--bg` (and ensure `.pagehero` keeps the solid
`background-color:var(--pine)` base so hero text never goes white-on-cream — the known CLAUDE.md gotcha).
Reuse existing images where they fit; fetch only what's missing (a real **winter** scene is the main gap).

**Plain pages → suggested hero (reuse existing unless noted "fetch"):**
- `about.html` → history feel: `creek-1911.jpg` or `hero-lake-panorama.jpg`
- `map.html` → `lake-aerial.jpg` (aerial reads as "map")
- `launch-your-boat.html` → `hero-shoreline.jpg` (or **fetch** a boat-ramp/marina shot)
- `winter-access.html` → **fetch** a snowy Vallecito / CR-501 / San-Juan-winter CC/PD image (real gap)
- `firewise-living.html` → ponderosa forest: `wild-weminuche-hills.jpg` (or **fetch** a defensible-space/forest shot)
- `living-here-year-round.html` → `hero-community.jpg` or a seasonal scene
- `real-estate-partner.html` → `hero-community.jpg` (or a cabin/home Vallecito shot)
- `buying-property.html` → `lake-aerial.jpg` or `town.jpg`
- `contact.html` → `hero-shoreline.jpg`
- `sources.html` → `hero-dam.jpg`
- `internet-cell.html` → a scenic (`hero-lake-panorama.jpg`)
- `utilities-services.html` → a scenic (`lake.jpg` / `hero-shoreline.jpg`)

**Upgrade generic re-uses to better-fitting heroes:**
- `wildlife.html` (currently `hero-shoreline`) → a wildlife/forest image, e.g. `gallery/wild-elk.jpg` or `weminuche-aspen.jpg`
- `middle-mountain.html` (currently `hero-shoreline`) → a forest-road / Middle Mountain shot (**fetch** if none)

Partner pages (`partner-*.html`, `real-estate-partner` aside) intentionally lead with their own logo/owner
imagery — leave those unless David asks.

## After
Add every new image to `sources.html#photo-credits`, re-run `gen-sitemap.mjs`, byte-check all touched HTML
(`</html>`, zero null bytes), deploy, push. Report which heroes reused existing art vs. needed a fetch, and
list anything excluded for unconfirmable licensing.
