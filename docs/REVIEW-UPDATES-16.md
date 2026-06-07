# Review Updates — Round 16: Fishing hub v1 (for Claude Code)

Goal: turn `fishing.html` from a one-page summary into the best fishing resource for Vallecito on the
web. Keep it ONE page for v1 (deep sections + anchors, not separate species pages yet — those are Phase
2 once traffic justifies). Facts below are researched/verified June 2026; sources cited. Redeploy + push.

## 0. Fact corrections to the existing page (do these regardless)
- **Spawn closure is wrong.** Current table says "Kokanee spawn closure Sep 1 – Nov 30." Per CPW Ch. W-1:
  fishing is prohibited **Sep 1 – Nov 14** in the **Grimes Creek inlet area** (BOR property boundary
  downstream to the reservoir's standing-water line) — not the whole lake, and snagging then opens
  **Nov 15 – Dec 31** in that same stretch. Rewrite both rows to be precise about the area + dates.
- Add to regs table: walleye limit is 5 (statewide default), pike/smallmouth **unlimited — CPW
  encourages harvest** (protects natives downstream). Keep "always confirm with CPW" caveat + link to
  CPW's current regs.

## 1. Species sections (expand the table into rich anchored sections)
Keep the at-a-glance table, then one `id`-anchored section per species (`#kokanee`, `#pike`, `#rainbow`,
`#brown`, `#walleye`, `#smallmouth`). Each: how to fish it at Vallecito (tactics, depth, season, where),
honest status. Verified material to use:
- **Kokanee** — stocked annually; the headliner. Troll Jun–Aug (early, before the 2 p.m. wind);
  snagging Nov 15–Dec 31 in the Grimes Creek stretch only; limit 10. Honest note: population has had
  down years (fish escaped during 2015 spillway releases per local guides) — frame as "ask at the
  marina or a guide for this year's outlook" and let the weekly report (#3) carry current status.
- **Northern Pike** — self-sustaining, the trophy (20+ lb fish); north end, late spring + early fall;
  unlimited bag, CPW encourages harvest.
- **Rainbow** — stocked annually, reliable; ice-out + fall best.
- **Brown** — self-sustaining; best late Sep–Nov.
- **Walleye** — self-sustaining; 10–40 ft, bottom bouncers + vertical jigging, low-light bite; tough
  from shore; limit 5.
- **Smallmouth** — self-sustaining; rocky structure + docks, Jun–Jul shallows; unlimited.
- Plus the existing "brook trout up the creeks" line.

## 2. Month-by-month calendar
A 12-row table (`#calendar`): month → what's fishable → tactic of the month → notes (ice, runoff,
wind, crowds). Build from the verified season pattern: ice (Nov/Dec–Mar, tournament late Feb), ice-out
Apr–May (pike/trout shallow), runoff May–Jun (streams high), summer Jun–Aug (kokanee trolling, smallmouth,
early starts), fall Sep–Oct (best all-around; browns; Grimes Creek closure starts Sep 1), late fall
Nov 15+ (snagging window). Where a month is genuinely uncertain, say what locals check rather than
inventing specifics.

## 3. Weekly fishing report — editor-file pattern (like restrictions.json)
- New `public/data/fishing-report.json`: `{ "updated": "2026-06-06", "author": "GoVallecito", "summary":
  "...", "species": [ { "name": "Kokanee", "status": "fair", "note": "..." } ] }`.
- Render at the TOP of fishing.html (`#report`): "🎣 This week on the water — updated June 6" with the
  summary + per-species lines. If `updated` > 14 days old, show a quiet "report from <date>" instead of
  pretending freshness (same honesty pattern as the stale badges).
- Seed it with a neutral first entry ("Season outlook" style, no invented catch claims). David/editor
  updates the JSON; document the workflow in a comment at the top of the file.

## 4. Shore vs. boat guide (`#access`)
Two short subsections: **From shore** (where shore access is realistic — public areas/PRID ramp area,
the walleye-from-shore honesty note, lake-level caveat with link to the live lake tile) and **From a
boat** (marina rentals two-hop link, ramp + ANS inspection line consistent with first-visit.html, the
afternoon-wind warning). Don't invent specific shore spots beyond what existing pages already claim —
the insider Q&A (docs/DAVID-QA-INSIDER.md) will supply real local spots in a later round; leave an HTML
comment placeholder for them.

## 5. Page plumbing
- Hero subline mentions the weekly report. In-page jump nav under the hero (Report · Species · Calendar ·
  Access · Permits · Regs · Guides).
- Internal links: conditions (lake level, weather), first-visit (ANS), directory anchors for guides +
  marina (existing two-hop pattern). Meta description updated to mention the weekly report + calendar.
- Sources for the regs claims (CPW Ch. W-1 + eRegulations special-waters) listed at the bottom of the
  regs section, consistent with the trust pass.

## After applying
Redeploy + push. Verify: corrected closure/snagging rows; six species anchors; calendar renders; report
JSON loads (and the >14-day fallback works by testing with an old date); access section links resolve;
jump nav works on mobile.

Sources used (June 2026): CPW Chapter W-1 final regs (Grimes Creek closure + snagging dates, kokanee
limit 10); fisherguideservicevallecito.com/blog/fishing-information (stocking, walleye depth/tactics,
pike/smallmouth patterns, 2015 spillway note); fishexplorer.com Vallecito page (species management).
