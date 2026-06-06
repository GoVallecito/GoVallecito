# Fire Restrictions & Red Flag — Authoritative Sources + Current Status

Fire restrictions depend on **whose land you're on**. Around Vallecito the land is a patchwork
(San Juan NF, La Plata County/private, BLM, state, tribal), and each authority can set its own stage.
For a visitor at the lake, the **San Juan National Forest** order is the one that almost always governs
the surrounding public land, campgrounds, and trailheads.

## ✅ Current status (confirmed June 2026)

**STAGE 1 — in effect at Vallecito.**
- **Issued by:** San Juan National Forest. **Effective:** 12:01 a.m. Friday, May 22, 2026. **Indefinite.**
- **Where:** all NF lands **below 8,000 ft** (Vallecito Lake = 7,665 ft → included). Designated Wilderness
  (e.g., Weminuche) is **excluded** from Stage 1 but has its own rules.
- **Prohibits:** campfires/charcoal/stove fires (wood/coal), outdoor smoking (except in a vehicle/building),
  explosives, fireworks. **Allowed:** petroleum/propane stoves & lanterns with on/off valves; fires in
  permanent FS-built campfire rings in designated sites.
- **Penalty:** minimum $530 fine.
- **La Plata County:** also enacted Stage I on May 22; county status can change independently of the
  forest — **verify current county status** (it may be lifted/active separately). The NF order alone is
  enough to display Stage 1 for the lake.

> Action: set `restrictions.json` to **stage 1**, issuedBy "San Juan National Forest",
> with the SJNF order URL and the "below 8,000 ft; Wilderness excluded" note.

## Exhaustive source checklist (check these to set/confirm the stage)

**Federal — the primary for land around the lake**
1. **San Juan National Forest — Alerts/Current Conditions:** fs.usda.gov/r02/sanjuan/conditions
2. **San Juan NF — Forest Orders (the legal order PDFs):** fs.usda.gov/r02/sanjuan/newsroom/forest-orders
3. **San Juan NF — Newsroom/Releases:** fs.usda.gov/r02/sanjuan/newsroom · info line (970) 247-4874
4. **BLM Tres Rios Field Office** (BLM-managed parcels): blm.gov/office/tres-rios-field-office

**County / local**
5. **La Plata County Office of Emergency Management — Fire Restrictions:**
   lpcgov.org/departments/emergency_management/fire_restrictions.php
6. **La Plata County alerts / LPC Alerts** + **Non-emergency dispatch (970) 385-2900** (will confirm current stage)
7. **Pine River Irrigation District (PRID)** — reservoir recreation rules: pineriverirrigationdistrict.com
8. **Town of Bayfield** (if relevant to in-town visitors)

**State / aggregators**
9. **Colorado Division of Fire Prevention & Control (DFPC) restrictions map:** dfpc.colorado.gov/firerestriction
10. **Colorado Emergency Management fire bans list:** coemergency.com/p/fire-bans-danger.html

**Tribal (adjacent lands, for completeness)**
11. **Southern Ute Indian Tribe** (lands south of the area)

**Red Flag Warnings & Fire Weather Watches (already automated)**
12. **NWS (api.weather.gov active alerts)** — wired into the worker; surfaces Red Flag / Fire Weather Watch
    automatically. NWS office for SW CO: **Grand Junction (GJT)**. Human page:
    forecast.weather.gov / weather.gov/gjt.

## How to keep it correct (hands-off-friendly)

- **Red Flag:** fully automated via NWS — no upkeep.
- **Stage restrictions:** no clean public API exists, so use the **manual toggle** (`restrictions.json`)
  driven by this checklist. Practical routine: when SJNF or La Plata County issue/lift an order (they
  publish a press release and update the pages above), flip the stage. Optional: a Worker check that
  scrapes the SJNF "Forest Orders" page text and emails David on change.

## restrictions.json — set to this now
```json
{
  "stage": "1",
  "issuedBy": "San Juan National Forest",
  "scope": "NF lands below 8,000 ft (incl. Vallecito Lake); designated Wilderness excluded",
  "effective": "2026-05-22",
  "summary": "No campfires, charcoal, or wood/coal stove fires; no outdoor smoking. Propane/gas stoves OK. $530 min fine.",
  "url": "https://www.fs.usda.gov/r02/sanjuan/newsroom/forest-orders",
  "updated": "2026-06-05"
}
```

## Worker fix needed so it actually displays
`RESTRICTIONS_URL` in `wrangler.toml` points at `https://govallecito.com/data/restrictions.json`, which
isn't live yet → the worker can't read it → defaults to "none." Until the domain is live, point it at the
**pages.dev** data path (or have the worker read the committed file directly), so Stage 1 shows in preview.
