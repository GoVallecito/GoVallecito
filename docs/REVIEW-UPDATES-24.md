# Review Updates — Round 24: partner profile pages + church image (for Claude Code)

Two things: (1) the standing **preferred-partner profile process** (`docs/PARTNER-PROFILE-PROCESS.md`),
and (2) build the first batch of profile pages from researched facts (`docs/PARTNER-PROFILES-RESEARCH.md`).
Deploy Pages + push.

## A. Vallecito Church image (David-specified)
Use the main identity image from **vallecito-church.constantcontactsites.com/about-vallecito-church-**
(the prominent header image — their logo/banner; URL pattern is a Constant Contact `/s/cdn/.../i/m?url=...`
proxy wrapping a `storage.googleapis.com/...` asset — fetch the underlying GCS URL). Download → optimize
(≤150 KB inline / ≤350 KB if used as a hero) → `public/assets/img/featured/vallecito-church.jpg`. Set it
as the church's `image` in directory.json (`imageAlt`, `imageFit:"cover"`) AND as the profile-page lead.
Keep flagging for David: still ask the church for an actual building-exterior photo.

## B. Build 5 partner profile pages
For each featured partner (NOT Julie — she has real-estate-partner.html; NOT Excel — unpublished), build
`partner-<slug>.html` from the shared template in PARTNER-PROFILE-PROCESS.md, using ONLY the verified
facts in PARTNER-PROFILES-RESEARCH.md. Respect every "could NOT verify → omit" note. No invented facts,
no review scores.

Pages to create:
1. `partner-vallecito-marina.html` — recreation/marina: fleet + rates tables, slips/buoys/fuel, season,
   community-operated angle. (Do NOT imply a membership yacht club.)
2. `partner-country-market.html` — dining/market: one-stop (grocery + La Comida Ranchera + liquor + gas/
   propane), menu breadth, hours. **DROP the "non-ethanol" gas claim** (unverified) — say "gas & propane."
3. `partner-blue-spruce.html` — lodging/RV: accommodations (sites/hookups, pre-setup RVs, cabins, the two
   named apartments, glamping "offered"), amenities, rate ranges, policies.
4. `partner-coronado.html` — services: services list, credentials/$2M insured/free assessment, the
   founders' two-discipline story, why-it-matters-locally (beetle/drought/Forest Lakes; Missionary Ridge
   from independent history, not their site). Say "certified sawyers," NOT "ISA arborist."
5. `partner-vallecito-church.html` — community (NO sales framing): who they are, the rich 1951→today
   history, service times, how to connect. Warm, not promotional.

Each page:
- Pagehero with kicker "★ Featured partner" (church kicker: "Community partner"), business name +
  one-line positioning in their own words; lead image (partner-owned, credited in #photo-credits +
  FREE-IMAGES doc).
- "Best features" = the 3 highlights listed per business in the research doc.
- Category detail section(s) with prices/specifics where published.
- "Good to know" (hours/season/policies/what to bring).
- Contact/booking block: tel:/mailto:/website/booking/social/address+map; two-hop link back to the
  directory anchor.
- Standard nav header + condbar (so the red RFW banner shows here too) + footer.
- Canonical/OG/breadcrumb (Round-21 pattern) + a LocalBusiness (church → Church/Organization) JSON-LD
  block. Add all 5 to sitemap.xml (re-run gen-sitemap).

## C. Wire directory → profiles
In directory.json, set each of the 5 featured entries' `profile` field to its `partner-<slug>.html`, and
make the featured card's CTA read "Full profile →" (keep existing external links too). If the directory
render already uses `profile`, just confirm it points to the new pages. Re-run gen-schema if directory
image/profile feeds the JSON-LD.

## D. Optimize oversized featured images while here
`coronado-ops.jpg` (~2.8 MB) and any other featured image >350 KB → run through optimize_images.py to
web sizes (these were flagged back in Round 19).

## After applying
Deploy + push. Verify: church image renders on its card + profile; all 5 profile pages live, in nav-less
but linked from directory, in sitemap, with correct facts and NO omitted-unverified claims (spot-check:
no "non-ethanol", no "ISA arborist", no "yacht club membership"); breadcrumb/OG present; RFW banner
appears on profile pages; two-hop links resolve. Report any image that couldn't be fetched + the
standing David flags (church exterior photo; Country Market storefront photo; confirm CCFM arborist cert;
Excel Excavation still needs data).
