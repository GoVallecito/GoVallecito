# Review Updates — Round 6: Audit response + destination groundwork (for Claude Code)

Combines the two external audits (factual/credibility + UX/persona). **Phase 1 = do now** (no added
upkeep). **Phase 2 = structure now, content layered in soon** (David wants to grow into a full
destination site). Apply Phase 1 to `public/` + worker; redeploy + push. Keep the local voice.

---

# PHASE 1 — launch polish (do now)

## 1. First-impression + data states (both audits' #1 technical issue)
- **Never hard-code a safety status in static HTML.** The pre-JS fallback must be neutral —
  "Checking current conditions…", NOT "All clear." (A visitor with slow/failed JS must never see
  "All clear" while Stage 1 is actually in effect.)
- Replace bare `—` / "⚠ delayed" with a clear state: **"Data temporarily unavailable — last reading
  8:45 AM MDT."** Use the cached `asOf`/last-good value; only show the unavailable message on real failure.
- **Surface the timestamp** prominently: "Updated 9:17 AM MDT" (the feed already carries `updated`/
  `updatedFriendly` — make sure it renders, not "Updated —").

## 2. Imagery architecture (slots now; David supplies photos — see PHOTO-WISHLIST.md)
- Add a **full-width hero image** behind the headline on the home page, with the headline + a short
  subhead, the **live conditions strip just below or overlaid** (keeps conditions-first for locals while
  giving first-timers an emotional hook). Dark gradient overlay for text legibility.
- Add **section images** (Things To Do, Fishing, Local Guide, Plan Your Visit) and a small **home
  gallery** strip.
- **Convention so David can self-serve:** read images from `public/assets/img/` with documented
  filenames (e.g. `hero.jpg`, `lake.jpg`, `fishing.jpg`, `hiking.jpg`, `winter.jpg`, `nightsky.jpg`,
  `gallery-1..6.jpg`). If a file is missing, fall back gracefully to the current gradient/placeholder so
  nothing breaks. `loading="lazy"`, sensible `alt` text, responsive sizing.

## 3. Wayfinding + "at a glance" (tourist + first-timer gaps)
- Add a prominent **"New to Vallecito? Start here →"** entry (hero or just below) linking to Plan Your Visit.
- Add a scannable **"Vallecito at a glance"** Q&A block answering the instant questions:
  - **Can I swim?** Yes — north end is the spot; no lifeguards; water stays snowmelt-cold into June.
  - **Boats?** Yes — rentals at the marina; PRID permit required.
  - **Family-friendly?** Yes — easy lakeside walks, swimming, the Tour of Carvings.
  - **Best season?** Summer for the water; Sept–Oct for fishing, fewer crowds, and golden aspens.
  - **Why Vallecito over Durango/Purgatory?** Quieter and uncrowded, wilderness on three sides,
    a real lake-town feel at altitude.

## 4. Calls to action (conversion — also feeds featured-partner + real-estate revenue)
- Add clear action buttons where relevant: **Book lodging** (→ directory/lodging), **Reserve a guide**
  (→ fishing/guides), **Rent a boat** (→ marina), **Talk to Julie** (→ real-estate page).

## 5. Trust / sourcing (factual audit)
- **New page: "How We Verify / Our Sources"** (build from docs/DATA-SOURCES.md): list each live feed
  (NWS, USGS, USBR/USACE, NIFC/InciWeb, CDOT, WU station), its refresh cadence (15-min auto), what's
  automated vs. locally curated, and a correction contact (contact form / email). Link it in the footer
  and from the conditions page.
- Reword the overclaim: "updated every 15 minutes by people who live here" → e.g. **"Live conditions
  pulled automatically from public agencies every 15 minutes; local contributors keep the guide and
  resources current."**
- Soften "Everything you need" → **"Key information most visitors need before heading to the lake."**
- By-the-numbers stats: add small **source labels** (Elevation/Storage — USBR/USGS; Surface area & depth
  — CPW) and label elevation **"reservoir surface, ~7,665 ft"**. Link the **"largest wilderness in
  Colorado"** claim to the San Juan NF / Weminuche page.
- Drive times → **ranges**: Durango "30–45 min," etc.
- Make the **business count dynamic** (from directory length) or drop the exact number.

## 6. Emergency block — add missing contacts + disclaimer (safety audit)
Reword "Who to call — all in one place" → **"Important local contacts in one place."** Keep 911 dominant.
Add (verified June 2026):
- **Poison Control: 1-800-222-1222**
- **Colorado Parks & Wildlife (Durango, SW Region): (970) 247-0855** (151 E. 16th St., Durango)
- **Colorado State Patrol (road emergencies): dial `*277` (`*CSP`) from a cell, or 911**
- **Search & Rescue: call 911 / Sheriff dispatch (970) 385-2900** (SAR is activated by the Sheriff)
- **Disclaimer:** "Contacts provided for convenience and may change — verify with the agency. In any
  emergency, call 911 first."

---

# PHASE 2 — destination groundwork (build structure now, write content soon)

Create the scaffolding + nav now (even as stubs) so the site is ready to grow; fill content over time.

## A. "Living in Vallecito" cluster (real-estate + local-authority SEO; funnels to Julie)
Stub these pages + a nav/landing section, each with an outline to flesh out:
- **Living Here Year-Round** · **Winter & Access** (snow, plowing, getting in/out) ·
  **Internet & Cell Coverage** (providers, dead zones) · **Firewise Living** (mitigation, defensible
  space; ties to fire-restriction content) · **Buying Property Near the Lake** (process, what to know;
  CTA → Julie) · **Local Utilities & Services** (water/septic, trash, healthcare access).
> These answer the real-estate-buyer audit gaps and are content nobody else has. Each ends with a soft
  CTA to Julie / the directory.

## B. Richer fishing (easy data wins now; community features later)
- **Now (hands-off):** lake-level **trend** arrow (rising/steady/falling from the USACE series), a
  **boat-ramp/marina status** line (seasonal/manual flag), and a **CPW stocking** link for Vallecito.
- **Later (optional, adds upkeep):** angler **bite reports** and a **catch-photo "brag wall"** —
  community-contributed; only if David wants to maintain them (conflicts with hands-off).

## C. Visual depth
As photos arrive (PHOTO-WISHLIST.md), populate galleries on Things To Do, Fishing, and a home gallery
strip. This is the single biggest emotional upgrade per both audits.

---

## After applying Phase 1
Redeploy pages + worker; push. Confirm: neutral pre-JS fallback (no hard-coded "All clear"), timestamp
renders, image slots fall back gracefully with no files yet, new "Sources" page live, emergency block
updated. Flag anything needing David (photos, final CTA targets).
