# Review Updates — Round 22: David's batch (hero, permits hub, trails page, polish, weekly cron)

Six items from David + corrections surfaced by the permits research. Items B and F carry live-accuracy
fixes — do those first. Deploy Pages + Worker (F touches the worker), push.

## A. Home hero — remove the overlay
Remove the dark gradient/scrim overlaid on the home hero image entirely (David: "it looks odd").
Keep the headline readable WITHOUT a scrim: allowed = a modest `text-shadow` on the text itself and/or
positioning the text block over the darker water/tree area (`background-position` tune); NOT allowed =
any translucent box/gradient layer over the photo. Screenshot-verify contrast at desktop + 375px; if
truly unreadable, fall back to white text + stronger text-shadow, never the scrim.

## B. Licenses & permits hub (robust, organized, BUY links) — includes LIVE FIXES
**Live fixes first (current site copy is wrong):**
1. **PRID annual vehicle permit is $60 for 2026, not $50** — fix everywhere ($6/day + $12/day combo are
   confirmed correct): home at-a-glance, plan-your-visit, things-to-do, fishing, first-visit.
2. **"Vallecito Resort" is NOT a PRID outlet** — PRID lists: PRID office (13029 CR 501, (970) 884-2558),
   **Pine River Lodge**, and **Vallecito Marina**. Fix everywhere it appears.

**Then build the hub:** upgrade fishing's `#permits` into a full **"Licenses & Permits"** section (one
authoritative block; everywhere else on the site references/links it rather than restating prices).
Organized in three groups, each row = who needs it · price · **direct BUY link** · in-person option:

*Fishing (CPW — license year Mar 1 2026–Mar 31 2027; cpwshop.com is CPW's official portal):*
- CO fishing license, 16+: Res annual $44.87 (senior 64+ $12.96, youth 16–17 $12.96, 1-day $18.07);
  Nonres annual $124.01, 5-day $41.04, 1-day $21.90. Second-rod stamp $14.24.
  BUY: https://www.cpwshop.com/purchaseprivilege.page?_PageParam.displayCategoryID=251532604
- Habitat Stamp, ages 18–64: **$12.76** (auto-added to first license purchase; use the fee-table price —
  CPW's stamp page shows a stale $12.47).
*Boating:*
- ANS stamp — per BOAT (motor/sail): Res $25 (with registration), Nonres **$50** —
  BUY: https://www.cpwshop.com/purchaseprivilege.page?_PageParam.displayCategoryID=251527462
  (kayaks/SUPs exempt from the stamp; inspections still apply to trailered craft).
- PRID permits (per VEHICLE): day $6 · annual **$60** · boat+rec day combo $12 · **annual boat $60
  (new — add it)**. Each links its own PRID pay page:
  day → pineriverirrigationdistrict.com/recreation-day-use-permit-per-vehicle
  annual → /2026-recreation-annual-permit-per-vehicle
  combo → /recreation-and-boat-day-use-permit-per-vehicle
  annual boat → /annual-boat-permit
  Mechanics: receipt on dash (day) / mailed hang-tag (annual). Ramp May 1–Nov 1.
*Trail & OHV:*
- OHV registration/permit $26.25/yr (Apr 1–Mar 31), incl. street-legal rigs on designated OHV trails —
  BUY: https://www.cpwshop.com/vehicleregistration.page
- Hunting: portal link only → https://www.cpwshop.com/licensing.page
- Hiking/Wilderness: free, no permit — say so (it's a selling point).

Cross-link the hub from every page that mentions a permit (things-to-do kayak/OHV lines, first-visit,
plan-your-visit, home boat card, map PRID-ramp popup). Don't restate prices outside the hub (one place
to keep current). In-person fishing-license agents near the lake: NOT confirmable officially — write
"cpwshop.com, the CPW Durango office (151 E 16th St), or any authorized agent."

## C. New trails page (trails.html) — from docs/TRAILS-VALLECITO.md
Build a dedicated trails page from the research doc (it is the content source — difficulties, distances,
trail numbers, descriptions, cautions, source links are all verified there):
- Organized by difficulty: Easy / Moderate / Hard / Strenuous-overnight, jump nav under the hero.
- **Standing cautions box at top:** Oct 2025 flood (Middle Bridge on #529 GONE; ford required; check
  with Columbine RD (970) 884-2512) · Granite Peaks Ranch etiquette on Pine River #523 · Wilderness
  regs (no bikes/drones, groups ≤15, 100-ft water setback) · Emerald Lake camping closure.
- Per trail: name + FS number, TH/access (road reality — FR 597 = high-clearance etc.), distance + gain
  (use FS figure or the doc's range), 2–4 sentence description, season, crowd note, official FS link.
- Honest crowd framing: Vallecito Creek + Lake Eileen + Emerald = the popular ones; Cave Basin /
  East-shore trio / Flint Creek / Tuckerville = the quiet insider picks.
- Nav: add "Trails" under **Explore ▾** (all pages). things-to-do 🥾 Trails section becomes a 5-line
  teaser + "Full trail guide →". Map cross-links (trailhead pins ↔ page anchors `#t-<slug>`); the
  Vallecito Creek TH pin popup gets the bridge-washout caveat. Sitemap + canonical/OG + breadcrumb per
  Round-21 patterns (re-run gen-sitemap).
- Do NOT publish anything from the doc's "couldn't verify" list.

## D. Dive-deeper grid — drop Julie's photo from the card
On the home "Plan the rest of your trip" grid, the Real Estate card currently shows Julie's photo while
the other cards are text+emoji. Remove the image so it matches the rest (emoji 🏡 + same copy + link).
Julie's photo remains on real-estate-partner.html. (David: consistency.)

## E. Lake map text list — names are the links
In the below-map POI text list: make the **bold name** the hyperlink (to its `link` target) and remove
the separate trailing link/"info" text at the end of each row. Same in marker popups: name = link,
drop any trailing "Info →" line. External links keep `target="_blank" rel="noopener"`; directory/anchor
links stay same-tab.

## F. Weekly "This week on the water" — automated Sunday publish (cron)
Yes — the Worker already runs cron; add a second schedule:
- `wrangler.toml`: `crons = ["*/15 * * * *", "0 13 * * SUN"]` (13:00 UTC = **6:00 AM MST**; note in a
  comment that this lands 7:00 AM during daylight time — Cloudflare crons are UTC-fixed. If David
  prefers 6 AM summer clock, use 12:00 UTC instead.)
- In `scheduled()`, branch on `event.cron`: the weekly trigger calls `generateWeeklyWater(env)`:
  reads the current conditions KV + month-keyed fishing-calendar notes (hardcode a 12-month table in
  the worker mirroring fishing.html's calendar) → composes
  `{ updated, weekOf, summary, bullets: [lake level + trend, inflows, water/weather outlook, what's
  biting this month, regs reminder (e.g. Grimes closure in season)], auto: true }`
  → writes KV key `weekly-water`. Serve it at `/data/weekly-water.json` (same CORS headers).
- **No invented data:** every bullet derives from live feeds or the static month table; phrasing
  template-based ("Lake 87% · 7,659 ft, down 0.4 ft this week" — compute trend from the previous
  weekly snapshot stored alongside).
- fishing.html report block: if the editor file `fishing-report.json` is fresh (<14 d) show it first
  (human beats robot), then/else show "🌊 This week on the water — auto-generated from live data,
  updated Sundays" with the bullets. Label honesty is mandatory.
- Seed: generate once at deploy via `/__refresh`-style manual trigger or on first weekly run; verify
  the JSON renders before relying on the cron.

## After applying
Deploy Worker + Pages, push, re-run gen-sitemap + gen-schema if directory/nav changed. Verify: hero has
NO scrim and stays readable (screenshots both widths); $60/Pine River Lodge corrections everywhere;
permits hub renders with all BUY links working (click each); trails.html live in nav/sitemap with the
flood caution; Julie card text-only; map list names are links with no trailing info; weekly-water JSON
exists and the fishing page renders it with the auto label. Report anything skipped.
