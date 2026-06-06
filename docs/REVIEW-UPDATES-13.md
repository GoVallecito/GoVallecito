# Review Updates — Round 13: Grouped nav + retire scrolling bar → realtor featured card (for Claude Code)

Apply to `public/` (shared header/nav across all pages, the announcement bar removal, home + directory).
Redeploy + push.

## 1. Top navigation → grouped dropdowns (replace the 8 flat links)
Five top-level items; brand on the left; sticky and condensing on scroll. Keep the slim live **conditions
strip** as a secondary row (unchanged).
- **Conditions** → conditions.html (direct, no dropdown)
- **Explore ▾** → Things To Do · Fishing
- **Local Guide ▾** → Directory (Businesses) · Real Estate
- **Plan Your Visit ▾** → Getting Here (plan-your-visit) · Living Here (living-in-vallecito)
- **About ▾** → About · How We Verify (sources) · Contact

Requirements:
- Accessible dropdowns: keyboard-operable, `aria-expanded`/`aria-haspopup`, focus styles; open on
  hover **and** click/tap; close on Esc/outside-click. Mark the current page active.
- **Mobile:** hamburger → full-screen (or slide-down) menu with the five groups as tap-to-expand
  accordions; large tap targets; nothing wraps; the conditions strip stays pinned/visible.
- Apply the **same nav markup on every page** (it's shared). Footer "Explore" list can stay flat.
- Events is gone (removed earlier) — don't reintroduce it.

## 2. Retire the scrolling announcement (realtor) bar
- **Remove the `annbar` scrolling bar entirely** from all pages (markup, its CSS, and JS). It's the
  least mobile-friendly pattern; we're replacing it with a featured card + nav/footer links.

## 3. Add a "Real Estate at the Lake" featured card
A clean, image-forward card (matches the directory's featured-card styling) linking to
`real-estate-partner.html`:
- **Image:** Julie's photo (`/assets/img/Julie_Coffelt.png`) sized properly in the card (object-fit
  cover, rounded) — NOT a squished thumbnail. (If preferred later, swap to a lake/cabin image; make the
  image path easy to change.)
- **Copy:** headline "Real estate at the lake" · line "Thinking about owning up here? Meet Julie
  Coffelt — your local Vallecito broker, 25+ years in the Four Corners." · button "Browse listings →".
- **Placement:** (a) the home **"Dive deeper"** grid (as an additional card), and (b) pinned at the top
  of the **Real Estate** category on the directory (she's already the featured partner there — make sure
  it reads as the lead).
- **Mobile:** stacks full-width, big tap target, `loading="lazy"` image. No animation anywhere.

## 4. Real Estate in the nav
Add **Real Estate → real-estate-partner.html** under **Local Guide ▾** (the footer link from Round 11 stays).

## After applying
Redeploy + push. Confirm: grouped nav works on desktop (keyboard + hover/click) and mobile (hamburger
accordions); the scrolling bar is fully gone; the Real Estate featured card shows on home + directory
with Julie's photo sized cleanly; Real Estate appears in nav + footer. Spot-check ~375px.
