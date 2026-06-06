# Review Updates — Round 8: First-time-visitor UX polish (for Claude Code)

From a fresh first-timer pass on the live home page. Apply to `public/` (+ `conditions.js` for #1);
redeploy pages (+ worker if touched) and push. Keep the local voice.

## 1. Calm first-paint state (top priority)
On first paint, the Weather / Lake level / Wildfires / Streamflow tiles still render **"⚠ delayed —"**
and the header shows **"Updated Updating…"**, which reads as *broken* on arrival. (Alert & Road were
already fixed to a neutral "Checking…".)
- Make **all** conditions tiles use the same calm initial state — **"Checking…"** / "Updating…" — with
  no "⚠ delayed" and no bare "—" warning styling on first paint.
- Show **"delayed / Data temporarily unavailable — last reading HH:MM"** ONLY after a confirmed stale or
  failed fetch (and prefer the localStorage last-good value if present, painted instantly).
- Header: replace "Updated Updating…" with just "Updating…" until the first value lands, then "Updated
  H:MM AM MDT".

## 2. Reorder the home page for first-timers + slim the safety block
Current order: hero → conditions → (very large) contacts block → at-a-glance → explore. For a first-time
tourist the 2nd screen is dashes + a wall of emergency numbers. Rebalance to:
**hero → Vallecito at a glance → Right now (conditions) → Dive deeper (explore) → contacts (compact).**
- **Move the full detail to the Conditions page:** the **fire-station table + embedded Google map** belong
  on `/conditions` (next to alerts), not the home page.
- On the **home page**, replace the long block with a **compact contacts strip**: "🚨 Emergency 911 ·
  Sheriff (non-emergency) (970) 385-2900 · **All emergency & lake contacts →**" linking to the full block
  on `/conditions`. Keep it clearly visible — just not the heaviest thing on the page.
- Keep the **full contacts block + disclaimer + fire stations + map** intact on `/conditions` (don't lose
  any content — it moves, it doesn't disappear).

## 3. Weather tile labeling while on NWS fallback
The tile says **"Weather · at the marina ⚠ delayed"** but it's actually on the NWS fallback (the PWS is
offline). That combo looks broken/misleading.
- While `sourceType === "nws"`: label it plainly (e.g., "Weather · near the lake — NWS") and no "delayed".
- Show **"at the marina (Vallecito Reservoir station)"** only when the live PWS feed is actually in use.

## 4. De-duplicate the hero CTAs
"Plan your visit" and "🧭 New to Vallecito? Start here" both link to `plan-your-visit.html`. Keep
**"New to Vallecito? Start here"** as the primary first-timer button; drop or repoint the redundant
"Plan your visit" (e.g., point the secondary CTA at "See full conditions" + "Start here", or remove one).

## 5. Mobile QA (please verify at ~375px)
Check that these stack cleanly on a phone: the conditions tile row, the (now compact) contacts strip, and
the embedded Google map on `/conditions`. Tables and the map iframe are the usual culprits — make them
full-width and scrollable, not clipped.

## 6. About page credibility pass
A skeptical first-timer will click **About** to test the "people who live here" claim. Make sure it
conveys authentic local credibility (built and maintained by people who live at the lake; how the site is
kept current; correction contact) **without naming individuals** (David's preference). Short, warm, real.

## After applying
Redeploy + push. Confirm: no "⚠ delayed" on first paint anywhere; home order is hero → at-a-glance →
conditions → explore → compact contacts; full contacts/fire-stations/map live on /conditions; weather
labeled correctly on NWS fallback. (Photos remain the separate big unlock — PHOTO-WISHLIST.md.)
