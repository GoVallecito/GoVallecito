# Persona panel review #1 — June 6, 2026 (post Rounds 13–17)

Six agents reviewed https://govallecito-web.pages.dev in character (panel defined in
`PERSONA-REVIEW-PROMPT.md`): Hank & Carol (68/66, TX retiree RVers) · Marisol (34, Farmington NM mom,
phone-only) · Tyler (26, Durango angler) · Diane (55, Phoenix property shopper) · Walt (72, year-round
local) · Zoe (19, Denver student, budget group camping).

**Overall:** every persona trusted the site more than expected — the source-per-tile lines, How-We-Verify
page, verified-pins-only map, and honest caveats landed across all six. Every persona also said they'd
return. The findings below are what stands between "I'd bookmark it" and "I'd rely on it."

## 🐛 Credibility bugs (independently caught by multiple personas — fix before anything else)
1. **conditions.html cites the dead USGS gauge 09353000 as the lake-level source** (Tyler, Diane, Walt —
   all three caught it). The sources page correctly says USACE/USBR and that 09353000 is stale/unused.
   The page copy contradicts the site's own verification story. Fix the paragraph.
2. **real-estate-partner.html ships visible scaffolding** (Diane): the contact form prints "Thanks —
   this is a demo form. Wire it to email/CRM before launch," and the listings section describes its own
   IDX/RESO container ("ready for a live feed"). Remove/hide both until real; put Julie's direct
   phone/email on the page (already in directory.json).
3. **15 vs 25 years discrepancy** (Diane): the real-estate page meta says "15+ years living at the
   lake"; page + home say "25+ years in the Four Corners." Reconcile (verify with David/Julie which is
   which — likely both true but must be stated precisely).
4. **Roads tile corridor filter too loose** (Walt): tonight it headlines a Molas Pass chip-seal
   (US-550 N of Coal Bank) and a US-160 Pagosa→South Fork segment — wrong side of the region for
   "Durango access." Tighten getRoads(): US-550 only south of ~Hermosa/Purgatory, US-160 only
   Durango↔Bayfield↔Pagosa-west; never headline segments beyond.
5. **Lake reading can be ~6 days old without a stale flag** (Walt): LAKE_STALE_MS is 7d; during runoff
   the pool moves daily. Lower the stale threshold (~48–72h) and ensure the tile shows the as-of date.
6. **Directory page may have missed a nav migration** (Hank & Carol saw a flat nav without First Visit /
   Lake Map on directory.html). VERIFY — if true, re-run the header migration on that page.
7. **Durango drive time appears as 30–45 min, ~35 min, and ~45 min on three pages** (Hank & Carol).
   Pick one ("45 min from downtown Durango; ~35 from east side" or similar) and use it site-wide.

## 📋 Content gaps — buildable now with verified sources (= Round 18 candidates)
1. **PRID permit explainer** (Marisol, Zoe, Hank & Carol — most-demanded fix on the panel). VERIFIED
   June 2026 from pineriverirrigationdistrict.com/2026-vallecito-reservoir-recreation-fees: **$6/day per
   vehicle recreation permit; $50 annual; $12/day boat+rec combo for motorized/trailered; kayaks/canoes/
   SUPs need NO boat permit but DO need the rec permit; buy online (PRID site), at Vallecito Marina, or
   Vallecito Resort; PRID ramp at the marina open May 1–Nov 1, ramp use free with permit.** Put a 2–3
   sentence version everywhere "PRID permit" is mentioned (things-to-do, first-visit, fishing #access,
   home at-a-glance boat card).
2. **Camping section** (Zoe's top item; Hank & Carol's RV version). Things-to-do (or its own section on
   first-visit): the 5 USFS campgrounds + Old Timers already verified in map-pois.json, rendered as
   text with fees/reservability from recreation.gov + fs.usda.gov (verify per-campground), plus the
   private RV parks, plus a researched line on dispersed camping rules (San Juan NF MVUM). Add an RV
   details line per RV park in the directory (hookups/amps/length/season — needs David or owner info;
   flag what's unverifiable). Add 5 Branches' phone number (research).
3. **"Where to eat" visibility** (Marisol): a small food section on things-to-do listing the three
   Dining & Markets businesses with closed-days, two-hop links to directory.
4. **Medical contacts** (Hank & Carol): add Mercy Hospital Durango + the Bayfield clinic (verify names/
   phones) to the conditions contacts list + first-visit.
5. **Map pins, next batch** (Marisol, Tyler, Zoe): north-end swim area, PRID public ramp (at marina,
   per PRID), Grimes Creek inlet/closure-boundary pin (described in CPW reg), Country Market +
   Weminuche Grill (from verified addresses). Same verify-or-exclude rule.
6. **Fishing follow-ups** (Tyler): yellow perch section (winter fishery; it's in the regs table but not
   the species list); water temp if/when the marina PWS (WU_API_KEY) lands; weekly report needs a real
   feed (ask marina/Fisher Guide for 2 sentences weekly) or retitle to "Season outlook."
7. **Missionary Ridge context line** (Walt): one sentence connecting the Tour of Carvings to the 2002
   fire (things-to-do + maybe living-here Firewise). Verified history, easy add.
8. **"One road in" phrasing** (Walt): soften to "effectively one paved route (CR 501; Florida Rd/CR 240
   is the backcountry alternate)" wherever it appears — matters for evacuation honesty.
9. **"~7,665 ft" static figure on home** (Walt): rephrase "By the numbers" to "full pool ≈7,665 ft" so a
   low-year live reading (7,659) doesn't contradict it.

## 🤝 Needs David (not buildable by Claude Code)
- **Living-in-Vallecito is six empty shells** (Diane + Walt; Diane: "highest-value page for a buyer, and
  it's a table of contents with no book"). Ship Winter & Access + Internet/Cell + Buying Property first —
  this is exactly what `DAVID-QA-INSIDER.md` (Q16, 15, etc.) feeds. Until written, mark cards "coming
  soon" instead of live "Read on →" links (that bit IS buildable now).
- **Julie prominence is a judgment call** (Walt: "three pitches before I've read about plowing"; Zoe:
  "Talk to Julie?? I'm 19"; Hank & Carol: "tells you who's paying" — vs Diane: disclosure done right,
  felt "introduced, not steered"). Recommendation: KEEP the featured card + nav + directory lead; DROP
  the "🏡 Talk to Julie" quick-action from the home at-a-glance row (wrong audience there) and the extra
  pitch on Living-Here. David decides — she's the partner.
- **About page is anonymous** (Diane: "put a name on it"). The placeholder from Round 15 awaits David.
- **Bathrooms/family facilities** (Marisol): which day-use areas have vault toilets — David knows in 10
  seconds; unverifiable remotely with confidence. Added as Q21 candidate for the insider Q&A.
- **Weekly fishing report feed** — needs a human source (marina/guide text).

## Considered and rejected (per synthesis rules)
- Zoe's implied "less real-estate, more camping" reweighting of the WHOLE home page — camping content
  yes, but Real Estate stays featured (monetization + Diane persona validates the disclosure approach).
- No pricing on boat rentals etc. beyond permits: list prices go stale and aren't ours to publish;
  instead add "call/book for current rates" affordances. (Permit prices ARE ours to publish — official
  public fees with a source.)

## Suggested order
**Round 18 (bugs + quick wins):** all 7 credibility bugs + PRID explainer + where-to-eat + medical
contacts + Missionary Ridge line + one-road phrasing + full-pool phrasing + "coming soon" treatment on
living-here cards + Julie quick-action decision (pending David).
**Round 19 (camping + map batch):** camping section + RV details + next map pins + perch section.
**Parallel (David):** insider Q&A answers → living-here guides; report feed; About name; photos.
