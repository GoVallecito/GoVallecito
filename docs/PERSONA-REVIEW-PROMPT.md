# Persona review panel — reusable prompt (run after major rounds)

Run 6 parallel review agents against the latest preview deployment. Each agent is a distinct visitor
persona; each browses real pages and returns structured findings. Synthesize results into
`docs/REVIEW-PERSONAS-NN.md` (themes → prioritized recommendations), then turn accepted items into the
next `REVIEW-UPDATES-NN.md`.

## The panel (edit/rotate as needed)
1. **Hank & Carol, 68 & 66, retired RVers from Lubbock TX** — planning a month at the lake; book by
   phone; modest tech comfort; care about legibility, simple paths, RV specifics, medical access.
2. **Marisol, 34, Farmington NM** — mom of kids 6 & 9 planning a 2-day weekend; phone-only, planning in
   stolen minutes; needs fast answers (swim? boats? food? bathrooms?), hates hunting for info.
3. **Tyler, 26, Durango CO** — serious angler; skeptical of tourist sites; compares against forums,
   Fishbrain, CPW; judges fishing content for real substance vs. filler; checks regs precision.
4. **Diane, 55, Phoenix AZ** — shopping for a second home/cabin; high trust bar; evaluates the real
   estate path, Living-here info, and whether the site feels credible enough to act on.
5. **Walt, 72, year-round Vallecito local** — checks conditions daily; wants accuracy, speed, no fluff;
   notices anything a local would call out as wrong; protective of the community's portrayal.
6. **Zoe, 19, college student from Denver** — organizing a budget group camping trip; found the site
   from a search; decides in 90 seconds; cares about camping, swimming, aesthetics, dark-sky photos.

## Per-agent prompt template
> You are **[PERSONA]**. Review https://govallecito-web.pages.dev as this person actually browsing —
> stay in character for judgments, be concrete in critique.
>
> Visit the pages this persona would: always the home page, then 3–6 of: /conditions, /fishing,
> /things-to-do, /directory, /map, /first-visit, /plan-your-visit, /living-in-vallecito,
> /real-estate-partner, /about, /sources. (Fetch with the URL paths; pages are server-rendered HTML.)
>
> KNOWN LIMITATION: live-data tiles are populated by JavaScript, which your fetches don't execute —
> placeholders like "--°" or "Checking…" are NOT bugs; judge the structure, labels, and copy around
> them, not the missing numbers. You also can't see images — judge alt text/copy, don't report
> "missing" images.
>
> Return exactly:
> 1. **First impression** (2–3 sentences, in character)
> 2. **What worked for me** (2–4 items)
> 3. **Friction** (2–5 items — page + what stopped/annoyed/confused me)
> 4. **Suggestions** (3–5, concrete + prioritized; say which page and what change)
> 5. **Trust check** — did I believe the site? what raised/lowered confidence?
> 6. **Would I come back / act?** (one sentence)

## Synthesis rules
- Weight issues raised by 3+ personas as themes; single-persona items listed separately with attribution.
- Separate **content gaps** (need David/research) from **buildable fixes** (next round spec).
- Discount persona suggestions that contradict established decisions (no scrolling bars, no invented
  facts, calm-not-alarmist conditions) — note them as considered-and-rejected with the reason.
