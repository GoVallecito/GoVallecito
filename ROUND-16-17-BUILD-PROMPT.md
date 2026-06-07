# Build prompt — Rounds 16 + 17 (for Claude Code)

Build both in one pass, **16 first** (fishing hub), then **17** (interactive map). Full specs:
- `docs/REVIEW-UPDATES-16.md` — fishing hub v1 (fact corrections, species sections, calendar, weekly
  report via `data/fishing-report.json`, shore/boat access).
- `docs/REVIEW-UPDATES-17.md` — `map.html` with Leaflet/OSM + `data/map-pois.json`.

## Order + overlaps
1. Round 16 in full. The regs **fact corrections** (Grimes Creek closure Sep 1–Nov 14; snagging
   Nov 15–Dec 31 in that stretch only) are the highest-priority items — they fix an inaccuracy currently
   live on the site.
2. Round 17 in full. The map's fishing-access layer and the fishing page's `#access` section should
   cross-link both ways. Nav gains "Lake Map" under Explore ▾ on every page (now 20 pages).

## Hard rules
- **No invented facts.** Round 16's species/calendar content comes from the cited sources in the spec;
  Round 17's coordinates must be verified per-POI (each gets a `"src"`) — exclude anything unverifiable
  and report it, never approximate a pin.
- Self-host Leaflet (`public/assets/vendor/leaflet/`), OSM attribution required.
- Seed `fishing-report.json` with a neutral season-outlook entry; no invented catch reports.
- Keep the existing patterns: two-hop directory links, per-tile honesty/stale conventions, `safe()`
  untouched (no worker changes needed for either round).
- Leave `docs/REVIEW-UPDATES-12.md` and other unstaged docs alone, as before.

## After
Deploy Pages, commit + push. Verify per each spec's checklist (incl. the >14-day report fallback and
mobile map toggles at ~375px). Report: any excluded POIs, and anything in the fishing content you
couldn't verify and therefore softened.
