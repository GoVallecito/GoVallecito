# Review Updates — Round 40: quick wins (readability + iOS Maps/Share + gallery schema)

A tight, low-risk bundle of fast-to-ship improvements pulled from FABLE-02/03/04 — the items that
are small, independently shippable, and touch no content meaning. Heavier items (jump-subnavs,
section chips, the dated `/fishing-report` page) stay in their own rounds (38 §3 / FABLE-02 A3).

**Byte-safe edits only** (Write/Edit per file; NEVER an in-place bash heredoc rewrite of existing
HTML — that has corrupted pages before). After build: `node scripts/gen-sitemap.mjs` (lastmod),
byte-check every touched HTML (`</html>` present, zero NUL bytes), deploy Pages, push. Bump the
service-worker `VERSION` if any precached asset (styles.css / pwa.js) changes, so installed PWA
users get the update.

## ⚠️ Constraints (binding, unchanged)
- Do NOT merge/deploy `fisher-partner`. Leave `REVIEW-UPDATES-12.md`, the Jeree WIP, and the
  marketing/contract drafts unstaged. No domain/money/data-deletion actions.
- Reconcile the working tree to clean HEAD first if anything is mid-edit.
- `--bg` token gotcha + clean-URL 308 redirects still apply (absolute `/…` asset paths).

---

## 1. Readability — use the widescreen on list-heavy sections (CSS-only)

**Corrected diagnosis (verified live at 1920px):** `.wrap.prose` is already *centered* (symmetric
~642px gutters) at `max-width:72ch` (~621px). 72ch is a *good* reading measure — do NOT widen it
globally (long lines hurt readability). The real complaint is "wasted widescreen / page feels
long" on **list-heavy** sections, where a single skinny column of bullets leaves the right half
empty and doubles the scroll. Fix = let *flat bullet lists* flow into two columns on wide screens
only.

### 1a. Add a `.cols2` utility to `styles.css`
```css
/* Two-column flow for long FLAT bullet lists on wide screens; 1 col on tablet/phone.
   Only use on <ul>/<ol> of short, self-contained items — never on prose paragraphs. */
@media (min-width: 1080px) {
  .prose ul.cols2, .prose ol.cols2 { columns: 2; column-gap: 44px; }
  .prose ul.cols2 > li, .prose ol.cols2 > li { break-inside: avoid; margin-top: 0; }
}
```

### 1b. Apply `class="cols2"` to the qualifying lists (Edit, per occurrence)
Add ONLY to long flat bullet lists of short items where columns read cleanly. Strong candidates,
verified to be flat short-item lists:
- `things-to-do.html` — the **Trails** bullets (Lakeside & easy / Vallecito Creek & Pine River /
  High routes) and **The lake** bullets (Boating / Fishing / Swimming / Kayak-SUP / Ice fishing /
  Find it on the map).
- `things-to-do.html` — the **Camping** "Private RV parks" list and the winter-activities list.
- `first-visit.html`, `plan-your-visit.html` — any "what to pack" / checklist `<ul>` of one-line
  items.
- Do NOT apply to lists whose items are multi-sentence (they'll create uneven, hard-to-scan
  columns) or to lists that contain nested sub-lists.
**Verify each at 1920px (fills width, balanced) AND 390px (collapses to one column, untouched).**
If a given list looks worse in two columns, leave it single — judgment call per list.

### 1c. (Optional, same file) gentle measure bump
Leave `.prose{max-width:72ch}` as-is. (Considered 74–76ch; 72ch tested fine — no change needed.)

---

## 2. Back-to-top button, site-wide (JS + CSS, no per-page HTML)

Added once in `nav.js` (loaded on every page) so it needs zero HTML edits.

### 2a. Append to `public/assets/js/nav.js` (inside the existing IIFE, before the closing `})();`)
```js
  // ----- back-to-top -----
  (function () {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);
    var shown = false;
    function onScroll() {
      var show = window.scrollY > window.innerHeight * 0.9;
      if (show === shown) return;
      shown = show;
      btn.classList.toggle('is-on', show);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    btn.addEventListener('click', function () {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      btn.blur();
    });
  })();
```

### 2b. CSS in `styles.css`
```css
.to-top {
  position: fixed; right: 16px;
  bottom: calc(16px + env(safe-area-inset-bottom));
  z-index: 1100; width: 44px; height: 44px; border-radius: 50%;
  border: 1px solid var(--line); background: var(--card); color: var(--ink);
  font-size: 1.2rem; line-height: 1; box-shadow: var(--shadow); cursor: pointer;
  opacity: 0; transform: translateY(8px); pointer-events: none;
  transition: opacity .2s ease, transform .2s ease;
}
.to-top.is-on { opacity: 1; transform: none; pointer-events: auto; }
@media (prefers-reduced-motion: reduce) { .to-top { transition: none; } }
/* keep it clear of the install coach card if both are visible */
.a2hs ~ .to-top.is-on { bottom: calc(86px + env(safe-area-inset-bottom)); }
```
Verify: appears after ~1 screen of scroll on a long page (fishing/trails), smooth-scrolls up,
Tab-focusable + Enter works, hidden at the top, doesn't overlap the danger banner or coach card.

---

## 3. Apple Maps "Directions" deep links (iPhone — highest bang/buck, mostly hrefs)

Opens the native Maps app on iPhone with turn-by-turn from the user's current location. (Lifted
from spec 39 §5 — not built in the PWA round.)

### 3a. Helper — add near the top of `public/assets/js/pwa.js`
```js
// One-tap native directions (Apple Maps app on iPhone; web map elsewhere).
window.gvDirections = function (lat, lng) {
  return 'https://maps.apple.com/?daddr=' + lat + ',' + lng + '&dirflg=d';
};
```
Gotcha: keep exactly the `maps.apple.com/?daddr=lat,lng` form (a `daddr` regression was reported
around the iOS 18.4 "unified URLs" change) — confirm on a real iPhone during verify. No `saddr`
needed; Maps uses current location.

### 3b. Lake map popups — `public/map.html`
Popup builder `popupHtml(p)` (~line 154); markers bind ~line 245. Between `var html =
popupHtml(p);` and `m.bindPopup(html);`:
```js
if (p.lat && p.lng) {
  html += '<br><a class="popup-dir" href="' + window.gvDirections(p.lat, p.lng) +
          '" rel="noopener">▸ Directions ↗</a>';
}
```
Do the same for the Middle Mountain trailhead popups (~line 289) using their derived coords, and
add a Directions link to each coord-bearing entry in the plain-text "All locations" fallback list.

### 3c. CSS
```css
.popup-dir { font-weight: 600; }
```
(Directory/things-to-do business directions are deferred — only add there once verified `lat`/`lng`
exist in `directory.json`; no guessing coordinates.)

---

## 4. Web Share — native iOS share sheet (small handler + a few buttons)

(Lifted from spec 39 §6 — not built.) Delegated handler, clipboard fallback on desktop.

### 4a. Add to `public/assets/js/pwa.js`
```js
// Native share sheet on iOS; clipboard copy fallback elsewhere.
document.addEventListener('click', function (e) {
  var t = e.target.closest('[data-share-url]'); if (!t) return;
  e.preventDefault();
  var data = { title: t.getAttribute('data-share-title') || document.title,
               text: t.getAttribute('data-share-text') || '',
               url: t.getAttribute('data-share-url') };
  if (navigator.share) { navigator.share(data).catch(function () {}); }
  else if (navigator.clipboard) {
    navigator.clipboard.writeText(data.url).then(function () {
      t.setAttribute('data-shared', '1');
      setTimeout(function () { t.removeAttribute('data-shared'); }, 1500);
    });
  }
});
```

### 4b. Buttons (Edit, per page)
- `fishing.html` (near the weekly report):
  `<button class="btn btn-share" data-share-url="https://govallecito.com/fishing" data-share-title="Vallecito fishing report" data-share-text="This week on the water at Vallecito:">🔗 Share</button>`
- Each `partner-*.html` profile: a "🔗 Share" button with that page's canonical URL + name.
- `conditions.html`: a "Share current conditions" button; in `conditions.js`, after the tiles
  paint, build a short string (e.g. "Vallecito: 79% full, Red Flag today") and set it on the
  button's `data-share-text`. The handler degrades to clipboard, so the button can always render.

### 4c. CSS
```css
.btn-share[data-shared]::after { content: " \2713 copied"; }
```

---

## 5. Gallery image schema + meta trim (`public/gallery.html`) — quick SEO

The new gallery page has canonical + OG but no image schema, so it's invisible to Google Images /
image rich results. It's a strong asset (curated, credited, historic + scenic).

### 5a. Add an `ImageGallery` + `ImageObject` JSON-LD block (visible images only — site convention)
Insert a second `<script type="application/ld+json">` in `<head>` listing the gallery's figures.
Generate it from the existing `<figure>` markup — for each `img.zoomable`, emit an `ImageObject`
with `contentUrl` (absolute), `name`/`caption` from the `data-cap` or `<figcaption>`, and
`creditText`/`license` parsed from the credit line. Shape:
```json
{ "@context":"https://schema.org", "@type":"ImageGallery",
  "name":"Vallecito in Pictures",
  "url":"https://govallecito.com/gallery",
  "image":[
    {"@type":"ImageObject",
     "contentUrl":"https://govallecito.com/assets/img/gallery/ute-delegation-1880.jpg",
     "name":"Ute delegation, 1880",
     "creditText":"Mathew Brady · Library of Congress (public domain)"},
    /* …one per visible figure… */
  ]}
```
**Do not invent** licenses/credits — copy them verbatim from each figure's existing caption. If a
build script is cleaner, add `scripts/gen-gallery-schema.mjs` that reads the `data-cap`/figcaption
and writes the block between markers (mirrors `gen-schema.mjs`), so it stays in sync when photos
change.

### 5b. Trim the meta description
Current is 181 chars (truncates in SERPs). Cut to ≤160 while keeping the key terms (Vallecito
Lake, photo gallery, history/dam/fishing). Mirror the trim into `og:description`.

---

## 6. Verify checklist
1. **1a/1b:** at 1920px the chosen lists flow into 2 balanced columns; at 390px each is a single
   column, unchanged. No list with multi-sentence items was columnized. No layout shift on the
   `.cards`/grid sections.
2. **Back-to-top:** appears after ~1 viewport on fishing/trails, smooth-scrolls up (instant under
   reduced-motion), keyboard-operable, hidden at top, clears the danger banner + coach card.
3. **Apple Maps:** on a real iPhone, tap Directions in a map popup → Apple Maps opens driving
   directions from current location (test marina + a campground + a Middle Mountain TH).
4. **Web Share:** iPhone → native sheet; desktop Chrome → clipboard + "✓ copied".
5. **Gallery schema:** validate the JSON-LD (Rich Results Test / schema validator) — all
   `contentUrl`s 200, credits match captions; meta description ≤160.
6. **No regressions:** nav, condbar, conditions paint, map render, PWA install/offline all
   unaffected; no console errors. Byte-check touched HTML; bump SW `VERSION` if styles.css/pwa.js
   changed; `gen-sitemap.mjs` re-run; hard-refresh / `?cb=` for edge cache.

## Deferred to their own rounds (not this bundle)
- Jump-subnavs (Things To Do / wildlife / respect / launch-your-boat) + Conditions section chips
  (spec 38 §3).
- Dated standalone `/fishing-report` page + water-temp tile (FABLE-02 A3).
- Web Push fire/road alerts + Apple Wallet pocket-card + geolocation "nearest ramp" (FABLE-04
  Tier 2.3 / Tier 3).
