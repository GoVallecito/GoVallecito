# Review Updates — Round 25 (mini): contacts accessibility + hero artifact cleanup (for Claude Code)

Small round; can be built together with Round 24. Deploy Pages + push.

## A. Hero mountain-silhouette artifact — ALREADY FIXED IN WORKING TREE (verify + ship)
Cowork removed the `.hero:before` rule in `public/assets/css/styles.css` — it was a leftover decorative
SVG mountain-range overlay (two ridge paths at 50% opacity) drawn OVER the real lake-panorama photo;
David spotted it as a "transparent mountain range" near the top of the home hero. Just verify: home hero
renders the photo clean, no silhouette, text still readable (text-shadow only), desktop + 375px. Check
`.pagehero` for a similar leftover decoration while there (the gradient scrim on `.pagehero` is
intentional — leave it; only remove pattern/silhouette artifacts if any exist).

## B. Important contacts — always one tap away
The full verified list lives at conditions.html#contacts. Make it reachable from EVERYWHERE:
1. **Footer (all pages, incl. the business/ subdir and the new partner pages):** add
   `🚨 Emergency & lake contacts` to the footer linklist (next to "How we verify") →
   `conditions.html#contacts` (mind `../` on subdir pages). Keep it FIRST in the list — emergencies
   shouldn't require scanning.
2. **Directory page:** add a compact "📞 Important local contacts" card pinned ABOVE the category list
   (it's local info — belongs in the local guide): 911 · Sheriff non-emergency (970) 385-2900 ·
   Mercy Hospital ER (970) 247-4311 · Upper Pine River Fire (station/admin number already verified on
   conditions) · PRID (970) 884-2558 · marina (970) 884-7000 — each `tel:`, plus "Full list incl. fire
   stations, Poison Control, and Forest Service →" linking conditions.html#contacts. Use ONLY numbers
   already verified on the conditions page — copy from there, don't re-research.
3. Sanity: the conditions #contacts anchor has the existing "screenshot this" framing — unchanged.

## After applying
Deploy + push (this can ride along with Round 24's deploy). Verify: footer contact link on every page
incl. subdir + partner pages; directory contacts card renders with tap-to-call; hero clean per A.
