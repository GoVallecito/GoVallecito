# Review Updates — Round 20: camping & RV, map-pin batch, perch (for Claude Code)

Three pieces. Verified facts below (June 2026); anything marked VERIFY gets checked at build time against
the named source — soften or exclude if it doesn't check out. Redeploy + push.

## 1. Camping & RV section
New section on things-to-do (🏕️ Camping, after The Lake) + a tightened "Camping on a budget" line in
first-visit's where-to-stay, both cross-linking the Lake Map's campground layer.

**USFS campgrounds (verified via fs.usda.gov + recreation.gov June 2026; VERIFY per-campground nightly
fees + season dates on recreation.gov at build and cite it):**
- **Vallecito CG** — 80 sites in 4 loops; 33 reservable (3 w/ electric), 47 first-come; May–Sep.
- **Graham Creek** — 25 sites (15 reservable, 10 FCFS), on the reservoir.
- **Pine Point** — 28 sites (13 FCFS), on the reservoir.
- **Middle Mountain** — 24 sites, southern exposure, water access.
- **North Canyon** — 21 sites (9 FCFS).
- **Old Timers** — DAY USE/picnic (11 sites), not overnight — don't list as camping; mention as the
  day-use area.
Reservations: recreation.gov (link each CG's page — same URLs as map-pois.json srcs). One honest line:
"reservable sites go fast for summer weekends; FCFS sites fill Friday morning." Note typical amenities
(vault toilets, no hookups at USFS sites) — VERIFY per campground page. Reuse the existing
`campground-creek.jpg` figure here (already credited).

**Private RV parks (two-hop directory links; add these VERIFIED details to directory.json blurbs/fields):**
- **Blue Spruce** — full hookups, water/sewer/electric **30 & 50 amp** (per bluesprucervpark.com); RV
  sites ≈May 1–Nov 1; cabins/apartments/glamping year-round-ish; booking link already in directory.
- **5 Branches** — **30-amp electric, water + sewer hookups, rigs to 40 ft** (per 5branches.com/aggregator
  listings — VERIFY against 5branches.com directly); 4677 CR 501A; **add their phone from 5branches.com
  to directory.json** (currently missing — the retiree persona's specific complaint).
- **JW Vallecito Resort** — VERIFY RV details on jwvallecito.com; add what's confirmable, else leave as-is.
- Directory render: show an "RV" detail line on these entries (hookups/amps/max length/season) — add a
  `rv` field to directory.json render logic.

**Dispersed camping:** one paragraph ONLY if verifiable from the San Juan NF website (MVUM/dispersed
rules for the Columbine district). If not cleanly verifiable, write: "Dispersed camping rules vary —
check with the Columbine Ranger District" + phone. No invented rules. Mind current Stage-1 fire language.

## 2. Map-pin batch (same verify-or-exclude rule; every pin gets `src`)
- **PRID public boat ramp** — PRID states the ramp + courtesy dock are at Vallecito Marina (src:
  pineriverirrigationdistrict.com); pin adjacent to the marina pin, popup: permits ($6/day veh, $12/day
  boat combo), season May 1–Nov 1, link to PRID fees page.
- **Grimes Creek inlet** — use the USGS GNIS coordinate for Grimes Creek's mouth at the reservoir (GNIS
  is authoritative; src the GNIS feature URL). Popup: the Sep 1–Nov 14 closure / Nov 15–Dec 31 snagging
  rule with "boundary per CPW Ch. W-1" caveat + link to fishing.html#regs.
- **Country Market & Weminuche Grill** — geocode from their street addresses via their own/Google
  listings (src: the listing URL); popups two-hop to directory anchors.
- **Vallecito Creek Trailhead** — retry the FS page (was 403/404 last round); fallback: GNIS "Vallecito
  Trailhead"/trail feature. If neither verifies, keep excluded.
- **North-end swim area** — EXCLUDE for now (no authoritative coordinate); add "swim area pin" to the
  David-asks list (he can drop a pin in 10 seconds).
- Update chip counts/categories as needed; keep Businesses layer default-off.

## 3. Fishing: yellow perch section
Add `#perch` species section (the panel's angler asked): winter/ice fishery, schools over flats —
jig small tackle through the ice; unlimited bag (already in regs table); kids-friendly summer dock
fishing. Add perch to the at-a-glance species table + ensure the calendar's January "trout & perch"
line links to the section. Keep it modest (3–5 sentences, no invented hotspots — the insider Q&A will
add spots later).

## After applying
Deploy Pages (+ worker untouched), push. Verify: camping section renders w/ correct counts + rec.gov
links; directory shows RV lines + 5 Branches phone; new pins land correctly (spot-check against sources)
w/ working popups; perch anchors resolve; first-visit budget line links the map. Report: per-CG fees
found, anything excluded/softened, 5 Branches phone found or not.
