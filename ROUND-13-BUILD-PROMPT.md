# Round 13 — ready-to-run build prompt

Paste this into a fresh Claude Code thread (or run next session) to execute Round 13.
The full spec is in `docs/REVIEW-UPDATES-13.md`; this is the actionable wrapper.

---

**Prompt:**

Read `CLAUDE.md`, then `docs/REVIEW-UPDATES-13.md`, then apply Round 13 to `public/`. This is
approved, local front-end work only — **no deploy, no push** until I give the OK (deploy gate).

Build, in this order:

1. **Grouped-dropdown top nav** replacing the 8 flat links, on the **shared header markup of every
   page** in `public/` (every `*.html`). Five top-level items, brand on the left, sticky + condensing
   on scroll; keep the slim live **conditions strip** as an unchanged secondary row:
   - **Conditions** → `conditions.html` (direct, no dropdown)
   - **Explore ▾** → Things To Do · Fishing
   - **Local Guide ▾** → Directory (Businesses) · **Real Estate** (`real-estate-partner.html`)
   - **Plan Your Visit ▾** → Getting Here (`plan-your-visit`) · Living Here (`living-in-vallecito`)
   - **About ▾** → About · How We Verify (`sources`) · Contact
   - Accessible: keyboard-operable, `aria-expanded`/`aria-haspopup`, focus styles; open on hover **and**
     click/tap; close on Esc/outside-click; mark current page active. No "Events" (removed earlier).
   - **Mobile:** hamburger → full-screen/slide-down menu, five groups as tap-to-expand accordions, large
     tap targets, nothing wraps; conditions strip stays pinned/visible.

2. **Remove the scrolling announcement (realtor) `annbar` entirely** — markup on every page, its CSS in
   `public/assets/css/styles.css`, and `public/assets/js/announcement-bar.js` (delete file + any `<script>`
   references). It's the least mobile-friendly pattern.

3. **"Real Estate at the Lake" featured card** (matches directory featured-card styling), linking to
   `real-estate-partner.html`:
   - Image: `/assets/img/Julie_Coffelt.png`, `object-fit:cover`, rounded, `loading="lazy"` — not squished.
     Keep the image path easy to swap to a lake/cabin photo later.
   - Copy: headline "Real estate at the lake" · line "Thinking about owning up here? Meet Julie Coffelt —
     your local Vallecito broker, 25+ years in the Four Corners." · button "Browse listings →".
   - Placement: (a) the home **"Dive deeper"** grid as an extra card; (b) pinned at the top of the **Real
     Estate** category on the directory so it reads as the lead (she's already the featured partner).
   - Mobile: stacks full-width, big tap target, no animation anywhere.

4. **Footer:** keep the Round 11 Real Estate link; footer "Explore" list may stay flat.

**After applying:** verify the grouped nav works on desktop (keyboard + hover/click) and mobile
(hamburger accordions); the scrolling bar is fully gone (no leftover CSS/JS); the Real Estate card shows
on home + directory with Julie's photo sized cleanly; Real Estate appears in nav + footer. Spot-check
~375px. Then **stop and report** — I'll deploy + push (`npx wrangler pages deploy public --project-name=govallecito-web`).

---

### Notes for the builder
- Nav is shared but duplicated per `*.html` — change every page; grep for the current `<nav>`/`annbar`
  blocks to find them all.
- Watch the `--bg` gotcha: `.pagehero` needs a solid `background-color:var(--pine)` base or text goes
  white-on-cream.
- Cloudflare edge-caches CSS/JS — when verifying after deploy, hard-refresh or add `?cb=`.
