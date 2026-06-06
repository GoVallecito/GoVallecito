# Review Updates — Round 10: Contrast + directory polish + new logos (for Claude Code)

Combines the Round-9 readability pass with David's new directory requests and newly-found assets.
Apply to `public/` (CSS + directory render + `data/directory.json`), redeploy + push.

---

## 1. Readability / contrast pass (was Round 9)
Light-grey text on cream/tan backgrounds is hard to read (Julie's page, Conditions, others). Fix in
`assets/css/styles.css`; keep the palette. WCAG AA: normal ≥ 4.5:1, large/labels ≥ 3:1 — test against the
tan backgrounds (`--sand #e9e1d0`, `--sand-2 #f4efe4`), not just white.
- Darken secondary token: **`--ink-soft:#4b554d` → `#3c463e`**.
- Body/bio/long-form text on any tan/sand/cream background uses **`--ink`** (not grey) — especially
  **Julie's bio + listing cards** and the **Conditions prose**. Reserve `--ink-soft` for small secondary
  labels that still pass AA.
- Fix light captions: **`.tile .src{color:#aab2a8}` → `#5f6b61`**; bump placeholder text on `--sand`
  (`.pcard .pimg`, `.prop .img`, `.agent-card .ph`, `.bizhero .ph`) to read clearly.
- Audit all text on `--sand`/`--sand-2` (`section.band.alt`, `.tbl th`, featured cards) for AA.
- Leave the light-on-pine hero/footer (`#9fe6d6`, `#cfe0d7`, `#dfeae3` on `--pine`) as is — it's fine.

## 2. Facebook references → small FB logo icon (directory)
Anywhere a Facebook link appears on the **Local Guide / directory** (featured cards + listing contact
rows), replace the plain "f"/text with a **small Facebook brand glyph** (inline SVG, ~16–18px, brand
blue `#1877F2` or monochrome to match the row), with `aria-label="Facebook"`. Cleaner than a lone "f".
Do the same for other socials if present (Instagram, YouTube) for consistency. Reusable icon snippet:
```html
<svg viewBox="0 0 24 24" width="16" height="16" aria-label="Facebook" role="img" fill="currentColor">
  <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.14 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.8 8.44-4.94 8.44-9.94Z"/>
</svg>
```

## 3. Featured-card logo sizing (fix overflow)
Logos in featured cards aren't fitting their box (varied aspect ratios — wide marina logo vs. squareish
Coronado). Make the logo slot robust:
- Fixed logo box (e.g. the `.pimg`/logo area), **`object-fit:contain`**, `max-width:100%`, `max-height:100%`,
  centered, with small padding and a clean white/neutral backing so transparent PNGs read well.
- Never crop or stretch a logo; letterbox within the box. Apply consistently to **all** featured cards
  (Marina, Coronado, Blue Spruce, Country Market, Church, future ones).
- Verify on mobile (cards stack; logos stay contained).

## 4. New assets — wire these in (download to `public/assets/img/featured/`)
**Blue Spruce RV Park** — logo found:
- Logo → `bluespruce-logo.png` — https://www.bluesprucervpark.com/App_Themes/BlueSpruceRvPark/images/Blue-Spruce-Top-Sticky-Logo.png
- Socials: FB facebook.com/Blue-Spruce-RV-Park-Cabins-168321524197 · IG instagram.com/funstaysllc ·
  YouTube @BlueSpruceRVPark · Book: bookingsus.newbook.cloud/bluesprucervpark · 1875 CR 500, Bayfield · (970) 884-2641

**Vallecito Lake Country Market** — listing image from the official Durango tourism site (usable; confirm
with owner when possible):
- Image → `countrymarket.gif` (or re-save as .png) — https://assets.simpleviewinc.com/simpleview/image/upload/c_pad,h_250,q_75,w_250/v1/crm/durangoco/vallecito0-f993de33afb86cc_f993def9-b2d8-30bc-6870aba87ced5707.gif

**Still no image (owner-provided needed):**
- **Vallecito Church** — vallecitochurch.org is empty/JS-walled; no logo retrievable. Keep the branded
  placeholder until the church provides one.
- **Excel Excavation** — still unpublished pending its business Page/owner data.

> Chrome note: Facebook business Pages remain login/canvas-walled (no clean logo pull), so the website
> route above is the reliable one. The only featured items still on placeholders are the Church and Excel.

## After applying
Redeploy + push. Confirm: secondary text passes AA on tan; FB (and other social) icons render as small
logos on the directory; all featured logos sit cleanly inside their boxes (no overflow/crop) on desktop +
mobile; Blue Spruce + Country Market now show images.
