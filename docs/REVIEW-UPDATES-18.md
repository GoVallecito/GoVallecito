# Review Updates — Round 18: persona-panel fixes (for Claude Code)

Source: `docs/REVIEW-PERSONAS-01.md` (6-persona review of the live preview). Two halves: **A. credibility
bugs** (fix first — three were caught independently by multiple reviewers) and **B. quick content wins**
(all facts verified, sources given). Redeploy Pages + Worker (A4/A5 touch the worker) + push.

## A. Credibility bugs

### A1. conditions.html — lake-level source copy cites the DEAD gauge
The lake section's copy says data comes "from USGS gauge 09353000." That gauge died in 2012; the live
pipeline uses USACE CWMS → USBR RISE (the sources page says this correctly). Fix the paragraph to match
(USACE/USBR), remove the 09353000 reference entirely (or mention it only as "the old USGS gauge is
stale and not used"). 3 of 6 reviewers caught this contradiction.

### A2. real-estate-partner.html — visible scaffolding
- The contact form's success text literally renders "Thanks — this is a demo form. Wire it to email/CRM
  before launch." **Remove the form entirely for now** and replace with direct-contact buttons: phone
  (tel:) + email (mailto:) pulled from directory.json (julie-coffelt entry), plus her external agent
  site link. A non-working form is worse than no form.
- The listings section describes its own plumbing ("IDX/RESO container ready for a live feed"). Remove
  that copy; keep a simple "Browse current listings on Julie's site →" external link until a real feed
  exists.

### A3. real-estate page — 15 vs 25 years discrepancy
Meta description says "15+ years living at the lake"; page + home card say "25+ years in the Four
Corners." Use ONE consistent, precise formulation in all spots. Default (pending David/Julie
confirmation): "25+ years in Four Corners real estate" and drop the lake-residency number from the meta
unless David confirms it. Flag in the build report for David to confirm with Julie.

### A4. Worker getRoads() — corridor filter too loose
Tonight's tile headlined a US-550 chip-seal at Molas Pass (north of Coal Bank, 40+ mi away) and a US-160
segment from Pagosa Springs→South Fork. Tighten the geographic filter:
- US-550: only segments **south of ~37.46 N** (≈ Purgatory/Hermosa) down to Durango.
- US-160: only segments between **~107.95 W (west Durango) and ~107.0 W (≈ Chimney Rock/Yellow Jacket)** —
  i.e. the Durango↔Bayfield↔(west-of-)Pagosa stretch.
- Implement as a bounding check on each feature's geometry (use the first/mid coordinate), not on route
  name alone. If nothing relevant remains, the tile reads "No reported issues on the Durango access
  corridor" — correct and calm. Keep the existing honest scoping line.

### A5. Worker lake staleness — too tolerant for runoff season
LAKE_STALE_MS is 7 days; the panel caught a 5–6-day-old reading presented fresh. Change LAKE_STALE_MS to
**72h** (USBR daily revision can lag 2–3 days; 48h would false-flag). Verify the tile's source line shows
the as-of date (Round 15 added it — confirm it renders the feed's own asOf, not the global updated).

### A6. directory.html — verify nav migration
One reviewer saw a flat/old nav (no First Visit, no Lake Map) on the directory page. Verify directory.html
has the current grouped header; if it was missed by a migration, re-apply it (and grep all 20 pages for
any other stragglers — e.g. business/ subdir).

### A7. Durango drive time — one number site-wide
Home says "30–45 min", plan-your-visit says "~35 min (23 mi)", first-visit says "~45 min." Standardize:
**"about 45 minutes from downtown Durango (23 mi, mountain road)"** everywhere, optionally "+~30 min from
the east side." Grep all pages for drive-time mentions and align.

## B. Quick content wins (verified facts)

### B1. PRID permit explainer — the panel's most-demanded fix
VERIFIED June 2026 (pineriverirrigationdistrict.com — "2026 Vallecito Reservoir Recreation Fees" +
"Recreation User Permits" pages — cite these in How-We-Verify style):
- Recreation permit: **$6/day per vehicle**, or **$50/year**.
- Motorized/trailered boats: **$12/day boat+recreation combo**.
- **Kayaks/canoes/SUPs: no boat permit needed, but the vehicle recreation permit still applies.**
- Buy: online at pineriverirrigationdistrict.com, at Vallecito Marina, or Vallecito Resort.
- PRID public ramp (at the marina): open **May 1–Nov 1**; ramp use free with permit.
Replace every bare "PRID recreation permit required" mention with a 1–3 sentence version of this
(things-to-do lake section, first-visit, fishing #access, home at-a-glance boat answer: "rentals at the
marina; lake permits from $6/day"). Add the fees link.

### B2. "Where to eat" section on things-to-do
New small section (🍔 or 🍕): the three **Dining & Markets** businesses with their closed-days quirks
(Weminuche closed Tue; Country Market closed Tue–Wed; Rocky Mtn GS open Wed/Fri/Sat/Sun only), two-hop
links to directory anchors. One line: "kitchens close early in the off-season — confirm on Facebook."

### B3. Medical contacts
Add to the conditions contacts list + first-visit what-to-know: **Mercy Hospital (Durango), 1010 Three
Springs Blvd — (970) 247-4311** (verify number when building) and Bayfield-area primary care (verify
current clinic name/phone; if not confidently verifiable, list Mercy + 911 only). Note ER is ~45 min —
part of the honest altitude/remoteness story.

### B4. Honesty phrasings (from the local persona)
- "One road in" → **"effectively one paved route in (CR 501); Florida Road/CR 240 over by Lemon is the
  slower backcountry alternate"** wherever the one-road line appears.
- Home "By the numbers": "~7,665 ft Reservoir surface" → **"≈7,665 ft at full pool"** (live level varies;
  avoids contradicting the live tile in low years).
- Things-to-do Tour of Carvings + living-here Firewise: add one line that the carvings memorialize trees
  burned in the **2002 Missionary Ridge Fire** (things-to-do already says this — confirm; ensure the
  Firewise/living-here context mentions the fire once too).

### B5. living-in-vallecito — stop linking to empty shells
The six topic cards currently link to "Read on →" stubs. Until the guides are written (David's insider
Q&A feeds them), render those cards **without links**, with a quiet "Guide coming soon" tag. Keep the
page; kill the dead ends.

### B6. Home at-a-glance — remove the "🏡 Talk to Julie" quick-action (David-approved)
Remove that one button from the quick-action row (wrong audience context; flagged by 3 personas). The
featured card, nav item, footer, and directory lead all STAY. If Living-Here has an extra Julie pitch
beyond a single contextual link, trim to one.

## After applying
Deploy Pages + Worker, commit + push. Verify: lake copy matches sources page; no demo-form/IDX text
renders; roads tile shows only Durango-corridor segments (check /__refresh output); stale logic at 72h;
directory nav current; one drive time everywhere; PRID fees + where-to-buy visible at every permit
mention; eat section links resolve; living-here has no dead links; Julie quick-action gone. Report
anything unverifiable (Bayfield clinic, Julie years) for David.
