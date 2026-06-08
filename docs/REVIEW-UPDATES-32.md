# Review Updates — Round 32: directory removals + Fisher Guide as fishing partner (for Claude Code)

David's directives (June 2026). **TWO PHASES, handled differently:**
- **PHASE A (Section A) — PUBLISH NOW:** the two business removals. Build on `main`, deploy Pages, push
  immediately. A closed/declined business must not linger.
- **PHASE B (Sections B + C) — BUILD BUT DO NOT PUBLISH:** the Fisher Guide paid-partner package. Build
  it on a **separate git branch `fisher-partner`** (branched from `main` AFTER Phase A is committed),
  commit there, **do NOT merge to main and do NOT deploy.** It waits, fully built, so David can publish
  at a moment's notice the instant Phil accepts. (Go-live = `git checkout main && git merge
  fisher-partner`, re-run gen-schema/gen-sitemap if needed, deploy Pages, push.)

**Workflow:**
1. Do Section A on `main` → deploy → push. (Live immediately.)
2. `git checkout -b fisher-partner` → do Sections B + C → commit on the branch → push the BRANCH only
   (`git push -u origin fisher-partner`) so it's backed up, but it is NOT on main and NOT deployed.
3. Report the branch name + the exact one-paste command David will use to go live later.

## A. REMOVE two businesses everywhere
1. **Charter Vallecito** (`charter-vallecito`) — **CLOSED.** Remove entirely.
2. **Rocky Mountain General Store & Custom Meats** (`rocky-mountain-store`) — declined participation;
   remove entirely. (No editorializing anywhere — just gone.)

Edit each spot:
- `data/directory.json` — delete both objects.
- `fishing.html#guides` — delete the **Charter Vallecito** guide card (img + h3 + link block).
- `things-to-do.html` (~line 171, 🍔 where-to-eat) — delete the **Rocky Mountain General Store** `<li>`.
- `plan-your-visit.html` (~line 129) — remove the "and Rocky Mountain General Store" reference; keep
  Country Market.
- `directory.html` (~line 86 intro prose) — change "the general store" → "the market" (generic; no
  longer name a removed store).
- `sources.html` (~line 215 photo-credits) — drop "Charter Vallecito" from the guide-logos credit row.
- Delete the guide logo file `public/assets/img/guides/charter-vallecito.jpg`.
- Grep the whole repo for `charter-vallecito` / `rocky-mountain-store` and clear any stragglers.
- **Re-run `scripts/gen-schema.mjs`** so the directory LocalBusiness JSON-LD drops both. Re-run
  gen-sitemap (new partner page below).

## B. Promote Fisher Guide Service to FEATURED fishing partner
Phil Fisher / **Fisher Guide Service** is the marina's recommended go-to guide — make him the lead of
the fishing program. Verified facts (from fisherguideservicevallecito.com, June 2026):
- Phone **(970) 769-0669** · site fisherguideservicevallecito.com · FB
  facebook.com/fisherguideservicevallecito · IG instagram.com/fisherguideservice · email
  fisherguideservices@gmail.com · 17252 CR 501, Bayfield · open-water + ice charters, Vallecito & Navajo,
  boat fishes up to 4, gear provided, "uniquely tailored trips."

1. **directory.json** — change `fisher-guide` to `tier: "featured"`, add `badge: "GoVallecito Partner"`,
   `profile: "partner-fisher-guide.html"`, the IG + email fields, a richer blurb ("Phil Fisher —
   open-water and ice-fishing charters on Vallecito and Navajo; the marina's go-to guide. Gear provided,
   trips tailored to your group."), and a `cta` → "Book with Phil →" (his Rates/Contact page). It now
   pins to the top of Outfitters & Guides.
2. **New `partner-fisher-guide.html`** via the standing partner process (docs/PARTNER-PROFILE-PROCESS.md):
   pagehero "★ Featured partner · Fishing guide", his positioning, 3 best-features cards (tailored trips
   / both reservoirs + ice season / gear provided, up to 4 anglers), the species he targets (matches our
   six), good-to-know (season, what's provided, booking), contact/booking block with his links, two-hop
   back to `directory.html#biz-fisher-guide`. Pull a hero/og image from his own site (Squarespace
   profile image or a gallery catch photo — courtesy basis; record in FREE-IMAGES). Canonical/OG/
   breadcrumb + LocalBusiness JSON-LD + sitemap.
3. **fishing.html — Phil leads the page** ("assume he runs the page"):
   - Add a prominent **"Your guide" band near the top** (after the weekly report): Phil's photo + name +
     one-liner + "Book with Phil → (970) 769-0669" + links to his site/FB/profile page. Honest framing:
     "Recommended by the Vallecito Marina; GoVallecito fishing partner."
   - `#guides`: Fisher Guide becomes the **first, enlarged featured card** (badge), with Vallecito Lake
     Outfitters and Go Fish Durango remaining as the two standard cards below (Charter removed).
   - Keep all the existing verified regs/calendar/species content (do NOT let a sponsor change facts —
     editorial line per sources.html#editorial-policy: partners get richer placement, never altered
     conditions/regs). A small line is fine: "Local insight on this page is informed by Fisher Guide
     Service."
4. **Map — sponsor logo on the marina/camera context:** add a small "Fishing partner: Fisher Guide
   Service" logo chip linking his profile, on the map's marina popup and/or the camera/marina area
   (NOT overlapping live data). Keep it tasteful and clearly a partner credit. (This is the
   "scrolling logo on marina camera" item — implement as a static partner logo/credit; a gentle CSS
   marquee is acceptable if it stays subtle and pauses on hover/reduced-motion.)

## C. Honesty guardrails (binding)
- Everything about Phil must be verifiable from his own site or David's direct marina recommendation.
  "Marina's recommended guide" is David-sourced — publish as an editorial recommendation, not an
  invented review/rating. No star ratings.
- Removing Charter/Rocky Mountain is silent — never publish why a business is gone.
- The paid-package elements (dedicated page, prominent fishing-page lead, map logo) are being built per
  David's go-ahead; if Phil ultimately declines the $500 sponsorship, these revert to a normal verified
  listing — keep the changes self-contained enough to roll back (the profile page + the featured flag +
  the fishing "Your guide" band are the removable pieces).

## After applying
**Phase A (live now):** deploy + push on main. Verify Charter + Rocky Mountain are gone from directory
render, fishing guides, where-to-eat, plan-your-visit, sources credits, and JSON-LD (gen-schema re-run);
no broken anchors/images; mobile OK.

**Phase B (held on branch):** verify on the local preview only (do NOT deploy) — Fisher featured +
profile page + fishing "Your guide" lead + map partner chip all render correctly; gen-schema/gen-sitemap
have been run on the branch so a later merge needs no extra steps. Commit on `fisher-partner`, push the
branch. Report: the branch name, the Fisher image used, any unverified link, and the exact go-live
one-paste for David. Do NOT merge or deploy Phase B.
