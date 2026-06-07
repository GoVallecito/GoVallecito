# Review Updates — Round 15: Trust pass (for Claude Code)

Theme: make the site's identity and credibility explicit. Five items, all buildable now — no new David
content required except where flagged. Apply after Rounds 13+14 (assumes grouped nav + two-hop linking
exist). Redeploy + push; spot-check ~375px.

## 1. Positioning statement
Adopt one line everywhere the site introduces itself:
> **"The independent guide to Vallecito Lake — local conditions, recreation, businesses, and community
> information in one place."**
- Home hero: use it (or a tightened variant) as the subhead under the main heading.
- `<meta name="description">` + OG description on home (and a per-page variant pattern for other pages).
- Footer tagline if one exists. Don't over-repeat on inner pages — once per page max.

## 2. Per-tile source + timestamp on live data
The worker JSON already carries `source`, `asOf`/`updated`, and `stale` per feed — surface them.
On every conditions tile (dashboard + /conditions), add a small muted footer line:
> `Source: USACE · Updated 10:15 AM MDT`
- Times in **America/Denver**, friendly format (match `updatedFriendly` style). Use the feed's own
  `asOf` where present, else the global `updated`.
- Source names short + honest: NWS, USACE/USBR, USGS, NIFC, CDOT/COtrip, "Editor-verified" (restrictions).
- If `stale: true`, append a subtle `(stale)` badge — muted amber, not alarming; tooltip "showing last
  good reading."
- Each source name links to the matching anchor on the How We Verify / sources page (see #3). Keep the
  line visually quiet (small, `--ink-soft`) so tiles don't get noisy — this is a trust cue, not content.

## 3. Editorial + corrections policy (extend the existing sources page)
Extend the existing How We Verify / sources page (don't make 3 tiny pages) with three short sections,
each with a stable `id` anchor:
- **`#how-we-verify`** — existing content: every number comes from the named official feed, refreshed
  every 15 minutes; manual items (fire restrictions) are editor-verified against the issuing agency.
- **`#editorial-policy`** — we are independent; not affiliated with any agency; businesses don't pay for
  factual coverage; featured partners are labeled as such; we link to primary sources.
- **`#corrections`** — "Spot something wrong? Email contact@govallecito.com — we correct errors promptly
  and note material corrections on the affected page."
Link all three from the footer ("How we verify · Corrections").

## 4. About the Team (on the About page)
Add a short "Who's behind this" section to About: maintained by locals/people who know the lake,
independent, why it exists (the info was scattered across agency sites and Facebook). **Placeholder
constraint:** don't invent bios. Write it generically ("GoVallecito is independently maintained...") and
leave a clearly marked `<!-- DAVID: add name/photo/one-liner if desired -->` spot. David decides how
identified he wants to be.

## 5. First-Time Visitor guide (new page)
New page `first-visit.html` ("First time at Vallecito?"), added to the **Plan Your Visit ▾** nav group
and linked from home's "Plan the rest of your trip" section. Sections:
- **Where to stay** — link styles of lodging to the directory anchors (cabins/RV/camping — two-hop
  pattern from Round 14; Blue Spruce, etc.).
- **What to bring** — elevation ~7,700 ft: layers (cold mornings even in July), sun protection, rain
  shell for July–Aug afternoon monsoon storms.
- **Best first-day activities** — link to Things To Do / Fishing / marina.
- **Typical weather by season** — one short table, link to live conditions.
- **Common mistakes** — arriving without checking fire restrictions; assuming full cell coverage
  (spotty around the lake); limited fuel/groceries at the lake (closest full services: Bayfield/Durango);
  afternoon storms on the water; boats need ANS inspection before launch.
- ⚠️ **Verify-before-publish:** the ANS-inspection detail, current store/fuel availability, and cell
  coverage claims must be checked against `docs/DATA-SOURCES.md` / known facts; anything unverifiable
  gets softened ("check locally") or flagged in the build report for David. No invented specifics.
- Internal links throughout (conditions, directory, plan-your-visit, fishing) — this page is also an
  internal-linking hub. Meta description per #1 pattern.

## After applying
Redeploy + push. Verify: positioning line on home + meta; every live tile shows source + local-time
updated line (and stale badge logic); sources page has the three anchored sections + footer links;
About has the team section with the David placeholder; first-visit page in nav, linked from home, all
internal links resolve; flag any unverified facts in the build report.
