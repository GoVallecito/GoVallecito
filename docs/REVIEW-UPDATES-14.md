# Review Updates — Round 14: linking, Blue Spruce image, home reorder, conditions polish (for Claude Code)

Apply to `public/`. Redeploy (pages + worker only if touched) + push. Hard-refresh / `?cb=` when verifying
(edge cache). Spot-check ~375px mobile on every change.

> Pattern used twice below (#1 and #8): a **two-hop link** — an on-site listing links to that business's
> entry on the **Local Guide / Directory** page (via an anchor), and the directory entry is where the
> **external** link (their website or Facebook) lives. So the site keeps people on-site one hop, then hands
> off. Anchors: give each directory business entry a stable `id` (e.g. `id="biz-blue-spruce"`,
> `id="biz-vallecito-marina"`) and link to `directory.html#biz-...`.

## 1. Things To Do — link businesses to the directory
On the Things To Do page, every business/operator mentioned should be a hyperlink to its entry on the
Local Guide / Directory page using the anchor pattern above (`directory.html#biz-<slug>`). Do **not** link
straight off-site from Things To Do — the external (website/Facebook) link lives on the directory entry
(#8). Use normal in-page links (not new tab) since they stay on-site. Make sure every business named on
Things To Do has a matching `id` anchor in the directory; if one isn't in the directory yet, add a basic
entry so the link resolves.

## 2. Blue Spruce image — replace (currently white-on-white logo)
The current Blue Spruce image is the logo PNG, which is **white text on transparent** → invisible on the
light card. Replace it with a real **campground photo** (more inviting than a logo anyway). Good sources
from their official site (`bluesprucervpark.com`) — download into `public/assets/img/featured/` as
`blue-spruce.jpg`:
- RV sites in the pine forest: `https://www.bluesprucervpark.com/GalleryHandler.ashx?ImageID=12564`
- Cabins: `https://www.bluesprucervpark.com/GalleryHandler.ashx?ImageID=12558`
- Glamping/Deluxe RVs: `https://www.bluesprucervpark.com/GalleryHandler.ashx?ImageID=12556`
Pick the most scenic (the pine-forest RV/cabin shot). `object-fit: cover`, `loading="lazy"`, descriptive
alt ("Blue Spruce RV Park & Cabins — wooded sites near Vallecito Lake"). If you'd rather keep a logo, the
color top logo is `https://www.bluesprucervpark.com/App_Themes/BlueSpruceRvPark/images/Blue-Spruce-Top-Sticky-Logo.png`
— but verify it's not also white-on-transparent before using; the **photo is the safer choice**.
- Confirmed details to keep accurate: 1875 County Road 500, Bayfield CO 81122 · 970-884-2641 ·
  bluesprucervpark.com · 80 RV sites + cabins/apartments + glamping · open ~May 1–Nov 1 (seasonal).

## 3. Local Guide order — Real Estate first, outfitters last
On the Local Guide / Directory page, reorder so **Julie Coffelt / Real Estate is the first listing**
(top of the page / first category), and move **guides & outfitters to the last** category. Everything
else keeps its current relative order in between.

## 4. Conditions — make Alert/Caution status clickable
In the status/alert area on the Conditions page (and the home live-conditions strip if it shows the same
text), make the alert/caution **text itself a clickable link** to the full alert detail — important when
the message is truncated/ellipsized. Behavior:
- If the alert has a source URL (e.g. an NWS alert link), the text links there (`target="_blank"
  rel="noopener"`).
- Otherwise, clicking expands the tile to show the full untruncated message in place (toggle), or links
  to a `#` detail anchor — no message should ever be permanently cut off with no way to read the rest.
- Make the whole tile keyboard-focusable, show a pointer cursor, and add `title`/`aria-label` with the
  full text. Don't truncate without an affordance.

## 5. Inflow / stream gauges — add emoji / visual polish
Give the inflow (stream) gauges the same friendly emoji treatment as the rest of the dashboard (consistent
with the weather tile style David liked). Suggested: 🌊 for flow, and a small trend arrow (⬆️/➡️/⬇️) or
💧 level cue based on the value vs. typical. Keep it lightweight and readable — emoji + number + short
label (e.g. "🌊 Pine River inflow — 142 cfs ➡️ steady"). Don't reintroduce the verbose panel David
rejected earlier; keep it compact.

## 6. "See live conditions" button — fix sizing
The "See live conditions" button is mis-sized and doesn't fit its container properly. Fix: consistent
padding, `white-space: nowrap` only if it fits, otherwise allow it to size to content; ensure it matches
the other primary buttons (same height/`line-height`/font-size), doesn't overflow its parent on mobile,
and has a sensible `max-width`/full-width-on-mobile treatment. Verify at ~375px and desktop.

## 7. Home page — section order + remove "Getting Here"
Reorder the home page sections to exactly:
1. **Live conditions** (top)
2. **Vallecito at a glance**
3. **Plan the rest of your trip**
4. **By the numbers**

And **remove the "Getting Here" section from the home page only** (keep it on the Plan Your Visit page —
do not delete it site-wide). If the "Dive deeper"/featured grid currently sits among these, keep it but
make sure the four named sections fall in this order; "Getting Here" content does not appear on home.

## 8. Guides area — two-hop linking (on-site anchor → external)
For the guides/outfitters listings (fishing/Things To Do), each guide links **into the Local Guide page
at its anchor** (`directory.html#biz-<slug>`), and on the directory that entry carries the **external**
link out to the guide's own **website or Facebook** (`target="_blank" rel="noopener"`). Same two-hop
pattern as #1. Ensure every guide named on-site has a directory entry + `id` so anchors resolve; add the
external URL to each directory entry (use the website if they have one, else their Facebook page).

## After applying
Redeploy pages (+ worker only if #4/#5 required worker JSON changes — they're mostly front-end), push.
Verify: Things-To-Do + guides links land on the right directory anchors and the directory entries link
out correctly; Blue Spruce shows a real photo; Real Estate is first / outfitters last on Local Guide;
conditions alerts are fully readable/clickable even when long; inflow gauges show emoji; "See live
conditions" button fits; home order is Live conditions → At a glance → Plan the rest → By the numbers
with no Getting Here on home.
