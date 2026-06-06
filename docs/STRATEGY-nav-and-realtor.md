# Plan: Nav revamp, realtor placement, competitor patterns

A planning doc (decisions first, build after David picks a direction). Also flags the camera blocker
and folds the big SEO/destination vision into the existing roadmap.

## 0. Camera embed — one thing still needed
The 8 links you sent are COtrip **map deep-links** (`maps.cotrip.org/...#camera/1062/…`) — they open the
interactive map, not a snapshot image, so they can't be embedded directly. To embed I need the actual
**snapshot image URL** per view: on each camera's popup, **right-click the image → "Copy image address"**
(it'll be a `.jpg`/CDN URL). Send those 8 and the travel-page embed (REVIEW-UPDATES-12) is ready. (Chrome
can't grab them for me — its page/network read tools are blocked by the permission gate you couldn't find.)

## 1. How comparable SW Colorado / Four Corners sites do it (patterns)
Observed on Durango (durango.org/.com), Pagosa (visitpagosasprings / explorepagosa), Colorado.com:
- **Imagery-first**, then a **short grouped top nav** — typically 5–7 items with dropdowns (Plan ·
  Places · Things To Do · Lodging · Eat · Events), not 8–9 flat links.
- **Featured listings:** image-forward cards with a "Featured/Partner" tag, pinned at the top of a
  filterable directory; sometimes a small rotating "featured" strip. Paid placement is standard.
- **Real estate:** shown as a **dedicated nav item, a sponsored card, or an inline "find your place"
  block** — essentially never a scrolling marquee. Agents appear as featured directory cards or a single
  sponsor unit.
- **Scrolling / popups:** the well-run sites **avoid moving marquees** (dated, hard to read, poor on
  mobile). At most they use **one slim dismissible announcement bar** for time-sensitive notices, or a
  single delayed/exit-intent modal. Persistent promos are **static cards**, not animated text.

**Takeaway:** the scrolling bar is the weakest, least mobile-friendly way to feature Julie. A clean
featured card + a nav/footer link is the stronger, more "authoritative" pattern.

## 2. Top nav / toolbar revamp
Today: 8 flat links + a "Live Conditions" CTA + the conditions strip — crowded, wraps awkwardly on phones.

**Option A — Trimmed flat:** Conditions · Things To Do · Fishing · Local Guide · Plan Your Visit ·
**More ▾** (About, Contact, Living Here, Sources). Five primary + a "More" menu. Simplest change.

**Option B — Grouped dropdowns (recommended):** five top items, each a short menu:
- **Conditions** (direct) · **Explore ▾** (Things To Do, Fishing, Events) · **Local Guide ▾** (Directory,
  Real Estate) · **Plan Your Visit ▾** (Getting Here, Living Here) · **About ▾** (About, How We Verify, Contact)
- Scales cleanly as content grows (fishing reports, seasonal guides, living-in-Vallecito). Keeps the bar
  short. The slim live **conditions strip** stays as a secondary row. Sticky + condensed on scroll.
- **Mobile:** hamburger → full-screen menu with the five groups as tap-to-expand accordions; conditions
  strip stays pinned. Big tap targets, no wrapping.

## 3. Julie's spot — cleaner & mobile-first (the redesign)
**Retire the scrolling top bar.** Replace with:
1. **A "Real Estate at the Lake" featured card** — clean image (a lake/cabin shot or her photo) + one
   line ("Thinking about owning up here? Meet Julie Coffelt, your local Vallecito broker") + a button
   ("Browse listings →"). Place it: in the home **"Dive deeper"** grid, and pinned atop the directory's
   **Real Estate** category (where she's already featured).
2. **Real Estate link** in the nav (under Local Guide ▾) and footer (footer link already added).
3. **Optional:** if you still want a persistent touch, a **slim, static, dismissible ribbon** — ONE short
   line, whole-bar tappable to her page, ✕ to close, **no animation**. (Only if you want it; the card
   alone is cleaner.)
- **Mobile:** cards stack full-width with large tap targets; lazy images; absolutely no marquee. If the
  ribbon is used, it's a single truncating line, not scrolling.

**Recommendation:** do #1 + #2 (featured card + nav/footer links) and **drop the top bar**. Non-intrusive,
mobile-friendly, repeated exposure, and it matches how real tourism sites present a sponsor.

## 4. The bigger vision (captured — sequence after nav + photos)
Your SEO/destination review maps onto the Phase-2 roadmap already in `PROJECT-STATUS.md`: weekly **fishing
report**, **species pages**, **seasonal guides**, the **Living-in-Vallecito** cluster (internet/cell/
winter/firewise/buying — realtor lead-gen), **photo gallery**, **schema** (FAQ / LocalBusiness / Article /
Breadcrumb), **image alt-text**, **internal linking**, and **AI-search Q&A** pages ("Can you swim in
Vallecito?", "How far from Durango?"). Positioning: **"the most complete independent guide to Vallecito
Lake."** The competitive field is weak/fragmented, so this is winnable — but it rides on the visual +
nav foundation first, then steady content.

## Decisions needed from David
- **Nav:** Option A (trimmed flat) or Option B (grouped dropdowns)?
- **Julie:** featured card + links only (drop the bar), or also keep a slim static dismissible ribbon?
Once chosen, I'll write the exact Claude Code build prompt.
