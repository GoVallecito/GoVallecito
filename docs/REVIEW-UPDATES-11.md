# Review Updates — Round 11: Realtor bar, footer link, page-hero green bar (for Claude Code)

All changes queued from David's review. Apply to `public/` (CSS + index/announcement bar + every page
footer + the 4 sub-pages), redeploy + push.

## 1. Realtor announcement bar — shorten + make the WHOLE bar a link
The scrolling message is too long (painful on mobile) and only the trailing text is clickable.
- **Shorten the copy** so it reads fast and barely needs to scroll. New text:
  **"🏡 Dreaming of a place at the lake? Meet Julie Coffelt — your local Vallecito real-estate broker →"**
- **Make the entire bar a single hyperlink** to `real-estate-partner.html` — the whole message is
  clickable, not just the end. (Keep the ✕ dismiss button working and separate from the link.)
- With the shorter text, ease the scroll: if it fits the viewport, don't animate; on narrow screens let
  it scroll but at a comfortable speed. Keep the 7-day dismiss memory.

## 2. Footer — add a "Real Estate" link on EVERY page
In the footer "Explore" list (present site-wide), add **Real Estate → `real-estate-partner.html`** so
Julie's profile is reachable from every page. Apply to all pages' shared footer.

## 3. Page-hero green bar missing on Conditions / Julie / About / Contact (readability bug)
These four use `<section class="pagehero">` with **no `--bg` image**, and the white intro text is
rendering on a white background (unreadable). The image pages (Fishing, Things To Do, Directory, Plan
Your Visit, Living-in-Vallecito) render the green bar fine.
- **Fix in `assets/css/styles.css`:** add a solid base so the bar is ALWAYS dark-green behind the text,
  regardless of `--bg`:
  ```css
  .pagehero{ background-color: var(--pine); /* solid base — guarantees readable white text */
    background:
      linear-gradient(180deg,rgba(18,36,28,.6),rgba(18,36,28,.45)),
      var(--bg,none),
      linear-gradient(180deg,var(--pine),var(--pine-2));
    background-size:cover;background-position:center;color:#fff;padding:40px 0 34px}
  ```
  (Keep `background-color` as a separate declaration BEFORE the `background` shorthand so it isn't reset;
  or fold a solid `var(--pine)` color into the shorthand. The point: a guaranteed opaque green base.)
- Verify the four pages (Conditions, real-estate-partner, About, Contact) now show the green bar with
  readable white text — and that the image pages are unaffected.

## 4. (Bonus, same first-paint issue) Conditions-page dashboard tiles
The `/conditions` dashboard tiles still show **"⚠ delayed —"** on first paint (Round 8 only calmed the
home page). Apply the same calm initial state there: tiles arrive as **"Checking…"**, and "⚠ delayed /
unavailable" appears only after a confirmed stale/failed fetch. (Keep it consistent with the home tiles.)

## After applying
Redeploy pages + push. Confirm:
- The realtor bar is short, the whole bar links to Julie's page, and the ✕ still dismisses.
- Every page footer has a "Real Estate" link to real-estate-partner.html.
- Conditions, real-estate-partner, About, and Contact show the green page-hero bar with readable text.
- /conditions tiles no longer show "⚠ delayed" on first paint.
(Note: a hard refresh may be needed to clear Cloudflare's edge cache when reviewing.)
