# Review Updates — Round 33: full-site review fixes (for Claude Code)

Source: Cowork full-site review, June 9 2026 (preview browsed desktop + 390px mobile sim, source
audited; live RFW active during review). David approved ALL buckets June 9 2026. Numbering note:
REVIEW-UPDATES-32.md lives on the `fisher-partner` branch — this round is 33 on `main`.

**Build order: A (accuracy) → B (quick wins) → C (approved decisions) → D (bigger bets, optional /
post-launch OK).** Ship A–C in one deploy; D items may ship separately. Deploy Pages; Worker only
if D3 is built. Commit + push after each phase.

## ⚠️ Constraints (binding — easy to get wrong)
- Do NOT merge or deploy the `fisher-partner` branch. Round-32 Phase B stays held.
- Leave `docs/REVIEW-UPDATES-12.md`, `docs/MARKETING-CONTRACTS-RESEARCH.md`, `docs/contracts/`,
  and other unrelated working-tree changes UNSTAGED. Commit only files this round touches.
- The working tree shows several `public/` files as modified with **line-ending-only churn**
  (`git diff -w` is clean). When editing those files, keep diffs minimal — verify with
  `git diff -w --stat` before committing and don't commit pure-whitespace churn in files this
  round doesn't otherwise touch.
- No invented facts, ratings, or reviews — every factual edit below is verified (sources inline).
- Domain cutover, money, data deletion still need David's explicit OK. (A3 deletes one committed
  stale data file — David pre-approved that specific deletion in this round.)

---

## A. Accuracy fixes (trust-critical, ship first)

### A1. "Six species" → seven (perch was added in Round 20)
fishing.html has 7 species sections (`#rainbow #brown #kokanee #pike #walleye #smallmouth #perch`).
Fix every stale "six":
- `fishing.html` h1: "Six species, four seasons, one very good lake" → "**Seven species**, four
  seasons, one very good lake".
- `fishing.html` meta description + og:description: "six species with tactics" → "seven species
  with tactics".
- `fishing.html` species intro: "Six gamefish in the reservoir, plus brook trout up the creeks."
  → "**Seven gamefish** in the reservoir, plus brook trout up the creeks."
- `index.html` Fishing ecard: "Six species, four seasons, permits, regs…" → "Seven species…".
- `things-to-do.html`: "six species and four seasons" → "seven species and four seasons".
- `first-visit.html`: "six species and four seasons" → "seven species and four seasons".
- Sweep: `grep -rin "six species\|six gamefish" public/` must return zero afterward.

### A2. "Six USFS campgrounds" → five (Old Timers is day-use, not a campground)
Verified: USFS campgrounds at the lake = Vallecito, Graham Creek, Pine Point, Middle Mountain,
North Canyon (5). Old Timers = day-use area (per R20 build + fs.usda.gov).
- `things-to-do.html` #camping: "Six U.S. Forest Service campgrounds ring the reservoir" →
  "**Five** U.S. Forest Service campgrounds ring the reservoir"; "All six are on the lake map" →
  "All five — plus the private RV parks — are on the lake map".
- `first-visit.html`: "six USFS campgrounds ring the reservoir" → "five USFS campgrounds…".
- **Map category split** (`public/data/map-pois.json` + `map.html`): Blue Spruce RV Park currently
  sits in the `campground` category, making the legend chip read "Campgrounds 6". Add a new
  category `rv` ("🚐 RV parks (private)") and move Blue Spruce into it, so "Campgrounds" counts 5
  (all USFS). Keep Blue Spruce's pin, popup, and partner links unchanged. Update the text list
  ("All locations") grouping to match.
- Sweep: `grep -rin "six usfs\|six u.s. forest" public/` must return zero afterward.

### A3. Delete the stale committed `public/data/conditions.json` + runbook freshness check
A June-5 snapshot is committed and served by Pages at `/data/conditions.json` with HTTP 200 +
`max-age=300`. Today it's a misleading public endpoint; post-cutover it would silently mask a
Worker-route failure (Pages would answer 200 with frozen data).
- `git rm public/data/conditions.json` (KEEP `conditions.sample.json` — it's the documented shape
  reference). Nothing front-end references the same-origin path until cutover (`conditions.js`
  uses the workers.dev DATA_URL on preview) — verify with
  `grep -rn "data/conditions.json" public/assets/js/` before and after.
- `docs/PROJECT-STATUS.md` CUTOVER RUNBOOK step 4: add a freshness assertion — after cutover,
  `curl -s https://govallecito.com/data/conditions.json | jq .updated` must be within ~20 min;
  if it isn't, the Worker route is NOT serving the path (rollback step 2 / re-check routes).
  Also note: if the route ever detaches, Pages now 404s the path (fail-loud — that's the point),
  and `conditions.js` falls back to its localStorage last-good cache with stale badges.
- Verify on preview post-deploy: `/data/conditions.json` returns 404 from Pages; dashboard tiles
  still paint normally (they read the workers.dev URL).

### A4. Conditions tile label garbled (Round-27 leftover)
`conditions.html` (~line 118): `<h3>🏞️ Streamflow in</h3>` renders as "STREAMFLOW IN" above
"In 283 · Out 627 cfs". Change to `<h3>🏞️ Streamflow</h3>`. (Home tile already says "Streamflow"
— leave it; the detail-section eyebrow "Streamflow — in & out" is correct — leave it.)

---

## B. Quick wins

### B1. Dedupe near-identical NWS alerts in the Active alerts list
During the June 7–9 RFW the #alerts list showed THREE "Red Flag Warning" rows — same event, three
end times (June 9 / 10 / 11 successively extended). In `conditions.js` where the alert items list
renders: group items by event name (`item.event` / title), keep ONE row per event using the item
with the **latest end time**, and append "(extended)" when >1 instance was merged. Don't touch the
underlying JSON or the Worker — render-side only. The condbar/banner logic already uses the
aggregate `alert.level` — unchanged. Also trim the row-body redundancy: the row label already says
"Red Flag Warning"; the body shouldn't restate "— Red Flag Warning issued…" — start at "issued…".

### B2. Fix "✓ Verified Locals" contrast in the directory hero
`directory.html` line ~86 uses `<b class="muted">✓ Verified Locals</b>` inside the dark-green
`.pagehero` — gray-on-green, near-invisible. Drop the `muted` class (plain `<b>` inherits hero
white) or style with the hero's mint accent. Check the same pattern doesn't appear in other
pageheros: `grep -n 'class="muted"' public/*.html` and fix any other instance sitting on a dark
background.

### B3. Compact the danger banner on small screens
The `.condbar-danger` banner wraps to 3 lines on phones (~110px sticky, on every page, for the
entire RFW). In `paintStrip()`'s danger markup, wrap the tagline segment ("— extreme fire danger ·
no open fires") in `<span class="condbar-tagline">`. CSS `@media (max-width:640px)`: hide
`.condbar-tagline`, reduce padding/font so the banner is ONE line: "🔴 RED FLAG WARNING ·
details →". Keep `aria-live="polite"`, the link target, and the full text on ≥641px. Also drop the
leading "— " from the tagline so desktop reads "RED FLAG WARNING — extreme fire danger…" without a
dangling dash when wrapped. Verify against the live RFW (or mock via patched fetch as in R23b).

### B4. Analytics — Cloudflare Web Analytics (needed before launch)
- **[DAVID]** Cloudflare dashboard → `govallecito-web` Pages project → Metrics/Web Analytics →
  enable (built-in toggle, cookie-less, free). No code change needed if the toggle injects the
  beacon. If you'd rather self-manage: create a Web Analytics site token and hand it to Claude
  Code.
- **[CLAUDE-CODE]** only if David supplies a token: add the beacon `<script defer
  src="https://static.cloudflareanalytics.com/beacon.min.js" data-cf-beacon='{"token":"…"}'>` to
  all pages (footer include sweep, all 30 HTML files + 404.html).
- Rationale on record: zero measurement today; partner packages (Fisher $500/yr) need traffic
  proof.

### B5. Optimize the oversized images (R19 optimizer never touched them)
Run `scripts/optimize_images.py` (inline target ≤150 KB, EXIF stripped) on:
- `public/assets/img/Julie_Coffelt.png` (1.4 MB) → JPEG ~480px wide (displays ~115px; 480 covers
  retina). Update refs: `real-estate-partner.html`, `public/data/directory.json`,
  `public/data/listings.json` (grep for the filename). Add `width`/`height` attrs.
- `public/assets/img/featured/coronado-banner.png` (1.27 MB) → JPEG/WebP ≤200 KB (it's a wide
  banner; keep 1600w max).
- `public/assets/img/featured/blue-spruce.jpg` (673 KB) → ≤150 KB.
- `public/assets/img/featured/coronado-owners.jpg` (275 KB) + `coronado-logo.jpg` (221 KB) →
  ≤150 KB each.
- Originals → gitignored `assets-originals/` per R19 convention. Re-run `gen-schema.mjs` only if
  any directory.json filename changed. Visual-check each page after (no stretched/cropped
  surprises; keep aspect ratios).

### B6. Skip-to-content link, site-wide
No page has one; the header is 30+ tab stops. Add as first element inside `<body>` on all 30
pages + 404.html: `<a class="skip-link" href="#main">Skip to content</a>`, add `id="main"` to each
page's main content container (the element right after the header/condbar), and CSS:
visually-hidden until `:focus` (standard pattern, use `--lake` focus ring consistent with nav).
Keyboard-verify on home + conditions.

### B7. Polish batch
- `index.html`: "full conditions page →" — the arrow wraps alone; join with `&nbsp;`
  ("page&nbsp;→").
- `business/pine-river-lodge.html`: remove the "Lodge photo coming soon" placeholder box (no
  verified lodge photo exists; an empty promise box reads worse than nothing). Keep layout intact.
  FLAG for David: a Pine River Lodge exterior photo is an easy partner ask.
- `real-estate-partner.html`: Julie's bio is one ~150-word paragraph — split into 3 paragraphs at
  the natural seams ("Her earlier careers…", "Whether you're buying…"). No wording changes.
- Trim meta descriptions to ≤160 chars on the worst offenders (respect-vallecito 249,
  middle-mountain 246, wildlife 229, sources 216, winter-access 202, first-visit 197,
  partner-blue-spruce 196, fishing 194 (gets the "seven" edit anyway), partner-vallecito-church
  194, trails 192, map 191, plan-your-visit 187). Keep the page's key terms; cut clauses, not
  facts. Mirror each page's og:description.

---

## C. Approved decisions (David, June 9 2026)

### C1. Directory + home ordering: Lodging first, Real Estate second
- `public/data/directory.json`: reorder categories to **Lodging → Real Estate → Dining & Markets →
  Marina & Water → Local Services → Community**. No entry changes; Julie's featured card styling
  and "Full profile →" links unchanged. Re-run `scripts/gen-schema.mjs` (markers in
  directory.html) and verify the JSON-LD block count is unchanged (22).
- `index.html` dive-deeper grid: move "🏡 Real estate at the lake" from first to second; "🧭 First
  time here?" becomes first. No copy changes.

### C2. Home hero H1
Replace `index.html` H1 "Key information most visitors need before heading to the lake." with:
**"Know the lake before you go."**
Keep the kicker, the "Elevation Changes Everything" line, the subparagraph, and both CTAs exactly
as they are. This also fixes the 5-line H1 wrap on phones. (The old line is the positioning
statement — it stays in the subparagraph/footer where it already lives.) **FLAG for David:** he
reviews visually post-deploy; if he vetoes, revert this one edit — it's isolated.

### C3. Map tile-failure toast: fire only on real failure
The "Map tiles couldn't load" notice flashed during a normal (slow) load, then cleared. In
`map.html`'s tile-handler: show the notice only when BOTH (a) ≥3 `tileerror` events have fired
across providers AND (b) zero `load` (tile success) events have occurred; any successful tile load
cancels/dismisses it permanently for the session. Keep the 10s timer as the earliest the notice
may appear, the Esri fallback behavior, and the existing shared-handler race fix (commit
`6b5054b`) intact. Verify: normal load (no toast), and a mocked failure via devtools request
blocking or a bogus tile URL (toast appears, fallback engages).

---

## D. Bigger bets (post-launch OK; build after A–C ships)

### D1. Responsive hero images (mobile LCP lever)
Every page ships its ~350 KB 1920px hero to phones — no `srcset`/`image-set` anywhere on the site.
- Extend `scripts/optimize_images.py` to also emit `-960w` variants (≤120 KB) for: home hero
  (`hero-lake-panorama`) + the photo pageheros (things-to-do, conditions, living, fishing,
  first-visit + any added since: trails/wildlife/respect/middle-mountain — check each page's
  `--bg`).
- Mechanism (keep inline-var convention): each hero/pagehero element sets a second inline var
  `--bg-sm:url('…-960w.jpg')` alongside `--bg`; in styles.css add
  `@media (max-width:768px){ .hero,.pagehero{ background-image:var(--bg-sm,var(--bg)) } }`.
  (Remember the gotcha: `--bg` is also the global color token — touch only the background-image
  usage, nothing else.)
- `index.html` preload: split into two `<link rel="preload" as="image" media="…">` tags (≤768px →
  960w, ≥769px → full).
- Verify both breakpoints visually + network panel shows the small file on mobile width.

### D2. Printable emergency-contacts card
The contacts section already says "Cell coverage is spotty — screenshot this." Add a print path:
`@media print` rules for `conditions.html` that hide header/nav/condbar/footer/tiles/JS sections
and print `#contacts` as a clean one-pager (black on white, phone numbers in plain text, site URL
+ "updated <date>" footer). Add a small "🖨️ Print this card" button atop #contacts
(`onclick="window.print()"`). Verify via print preview at Letter size — one page.

### D3. Fishing/weekly-water RSS feed (Worker)
Distribution loop for content that already auto-generates. In `worker/conditions-worker.js`: new
route `GET /feed/fishing.xml` → RSS 2.0 built at request time from KV `weekly-water` (+ the editor
`fishing-report.json` item when fresh, fetched from the Pages origin). One `<item>` per weekly
entry, plain-text summaries, no invented data — same honesty labels as the on-page block
("Auto-generated from live data"). Add `<link rel="alternate" type="application/rss+xml"
title="Vallecito weekly fishing & water report" href="…">` to `fishing.html` + a small "Subscribe
(RSS) →" link near the weekly block. Deploy Worker + Pages. NOTE: route is workers.dev until
cutover; use the absolute workers.dev URL in the `<link>` for now and add the same-origin flip to
the cutover runbook (alongside DATA_URL).

---

## Verify checklist (whole round)
1. `grep` sweeps in A1/A2 return zero; species count on /fishing matches the 7 sections.
2. `/data/conditions.json` on the preview → 404; tiles still paint; no console errors.
3. Alerts list shows ONE Red Flag row while the RFW lasts (or mock it if it's expired).
4. Mobile (≤640px): danger banner = 1 line; skip-link works; directory hero badge readable.
5. `npx wrangler pages deploy` + hard-refresh/?cb= (edge cache gotcha); commit + push;
   re-run `scripts/gen-sitemap.mjs` (lastmod refresh) before the deploy.
6. Working tree after commit: REVIEW-UPDATES-12.md, marketing/contracts docs still unstaged;
   `fisher-partner` branch untouched.
