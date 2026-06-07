# Build prompt — Rounds 13 + 14 together (for Claude Code)

Build both rounds in one pass, **Round 13 first** (it changes shared structure: nav, the announcement
bar, and the directory's Real Estate lead), **then Round 14** (linking + polish that sits on top of that
structure). Full specs:
- `docs/REVIEW-UPDATES-13.md` — grouped nav + retire scrolling realtor bar → Real Estate featured card.
- `docs/REVIEW-UPDATES-14.md` — linking/Blue Spruce/home reorder/conditions polish.

## Order of operations
1. **Round 13** in full (shared nav on every page, remove `annbar`, add the "Real Estate at the Lake"
   featured card to home + directory, Real Estate in nav + footer).
2. **Round 14** in full, on top of 13.

## Watch the overlaps (13 and 14 touch the same places — reconcile, don't double-do)
- **Directory / Local Guide page:** Round 13 makes Real Estate the *featured lead* card; Round 14 #3
  makes **Real Estate the first listing and outfitters the last** category. Do both consistently — Real
  Estate sits at the very top (featured card + first category), guides/outfitters at the bottom.
- **Directory anchors:** Round 14 #1 and #8 need every business to have a stable `id`
  (`id="biz-<slug>"`) so Things-To-Do and the guides listings can deep-link to `directory.html#biz-<slug>`,
  and each directory entry carries the **external** website/Facebook link. Add anchors as you build the
  directory order in 13 so 14's links resolve. Confirm every business named on Things-To-Do / guides has
  a matching directory entry (add a basic one if missing).
- **Home page:** Round 13 adds the Real Estate featured card to the home "Dive deeper"/featured grid;
  Round 14 #7 fixes the home **section order** (Live conditions → Vallecito at a glance → Plan the rest
  of your trip → By the numbers) and **removes "Getting Here" from home only** (keep it on Plan Your
  Visit). Make sure the featured grid (with Julie's card) still lands within that ordering.
- **Nav:** build the grouped dropdowns once (Round 13) and don't reintroduce Events or the scrolling bar.

## Blue Spruce image (Round 14 #2)
Replace the white-on-white logo with a real campground photo — download from the official site into
`public/assets/img/featured/blue-spruce.jpg` (pine-forest RV/cabin shot,
`https://www.bluesprucervpark.com/GalleryHandler.ashx?ImageID=12564`). Details in the Round 14 spec.

## After applying
Redeploy pages (worker only if a conditions JSON field changed — #4/#5 are mostly front-end), commit +
push. **Leave `docs/REVIEW-UPDATES-12.md` untouched** (David's uncommitted edit). Hard-refresh / `?cb=`
when verifying (edge cache); spot-check ~375px mobile.

**Verify checklist:** grouped nav works desktop (keyboard + hover/click) and mobile (hamburger
accordions); scrolling bar fully gone; Real Estate featured card on home + directory with Julie's photo
sized cleanly; Real Estate first / outfitters last on Local Guide; Things-To-Do + guides links land on
the right directory anchors and those entries link out correctly; Blue Spruce shows a real photo;
conditions alerts fully readable/clickable when long; inflow gauges show emoji; "See live conditions"
button fits; home order correct with no Getting Here on home.
