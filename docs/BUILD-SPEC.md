# GoVallecito.com — Build Specification (for Claude Code)

> Hand this file to Claude Code in the repo root. It is the authoritative spec.
> Companion files: `docs/DATA-SOURCES.md` (exact endpoints), `docs/CONTENT-INVENTORY.md`
> (all page content), `prototype/index.html` (approved visual direction for the new home page).

## 0. Context & goal

GoVallecito.com is a community hub for Vallecito Lake, Colorado (7,665 ft, La Plata County).
Audience: locals, plus visitors/tourists from **Farmington NM, Texas, Arizona, and Colorado**
planning a lake/mountain trip. The site already exists (built as Claude chat artifacts, deployed on
**Cloudflare**) but (a) all live data shows placeholders because it's fetched per-visitor in the
browser, and (b) the home page buries the conditions data the audience actually wants.

**This rebuild does three things:**
1. **Redesign the home page** to lead with a big, visual, instantly-loading conditions dashboard.
2. **Fix the data architecture** so conditions load in the background every 15 minutes and paint instantly.
3. **Add** prominent emergency contacts, fire-restriction/red-flag status, and a dismissible realtor
   announcement bar linking to a realtor listings page.

Recreate all existing pages faithfully (content in `CONTENT-INVENTORY.md`); only the **home page** is a redesign.

## 1. Tech stack & hosting

- **Static site** (HTML/CSS/vanilla JS, or Astro if you prefer a component model — keep it simple and dependency-light).
- **Host:** Cloudflare Pages, auto-deploying from this GitHub repo.
- **Data pipeline:** a **Cloudflare Worker** with a **Cron Trigger every 15 min** (`*/15 * * * *`)
  that fetches all sources (see `DATA-SOURCES.md`), normalizes them, and writes a single
  `conditions.json` served to the site. Store the JSON in **Workers KV** (or R2) and expose it at
  a stable path the site fetches (e.g. `/data/conditions.json` via a Pages Function or Worker route).
- **Secrets** (WU API key, AccuWeather key, CDOT key, AirNow key) live as Worker secrets — never in the repo.
- No heavy frameworks, no client-side data fetching of third-party APIs. The browser only ever fetches our own `conditions.json`.

## 2. Repo structure (target)

```
/
├─ src/                     # site pages
│  ├─ index.html            # REDESIGNED home (build from prototype/index.html)
│  ├─ conditions.html       # full conditions dashboard
│  ├─ things-to-do.html  fishing.html  directory.html
│  ├─ plan-your-visit.html  events.html  about.html  contact.html
│  ├─ real-estate-partner.html   # realtor listings landing page
│  └─ blog/ ...
├─ assets/
│  ├─ css/styles.css        # shared design system (extract from prototype)
│  └─ js/
│     ├─ conditions.js      # fetch /data/conditions.json → paint dashboard + header strip
│     └─ announcement-bar.js# dismissible realtor bar (localStorage, 7-day memory)
├─ data/
│  └─ conditions.sample.json
├─ worker/
│  ├─ conditions-worker.js  # cron fetch + normalize + KV write
│  └─ wrangler.toml
└─ docs/  (this folder)
```

## 3. The data pipeline (priority #1)

Implement `worker/conditions-worker.js`:
- On the 15-min cron, fetch in parallel (with per-source try/catch so one failure can't blank the page):
  - **Weather:** Weather Underground PWS current obs (primary), NWS forecast for 5-day, NWS for fallback current. (`DATA-SOURCES.md` §1)
  - **Alerts + Red Flag:** NWS active alerts; flag `Red Flag Warning`, `Fire Weather Watch`, flood, winter. (§2)
  - **Fire restrictions:** read editor-controlled `restrictions.json` (Stage none/1/2). (§3)
  - **Wildfires:** NIFC WFIGS within 50 mi → count + nearest. (§4)
  - **Lake level:** USGS `09353000` storage + elevation → % of capacity. (§5)
  - **Streamflow:** USGS `09352900` + `09352800` discharge → combined cfs. (§6)
  - **Roads:** CDOT/COtrip US-160 + CR 501 → clear/caution/closed. (§7)
- Normalize to the **`conditions.json` schema** below, add `updated` (ISO + friendly), write to KV.
- **Each source carries its own `status` and `stale` flag** so the UI can show "data delayed" per-tile instead of blanking everything. Keep last-good values in KV; if a fetch fails, retain the previous value and mark `stale:true`.
- Expose `GET /data/conditions.json` (Pages Function or Worker route) reading from KV, `Cache-Control: max-age=300`.

### `conditions.json` schema
```json
{
  "updated": "2026-06-05T17:45:00Z",
  "updatedFriendly": "today 11:45 AM MT",
  "weather": { "tempF": 74, "desc": "Sunny", "windMph": 8, "windDir": "WSW",
               "humidity": 28, "highF": 79, "lowF": 46, "source": "WU PWS KCOBAYFI12",
               "forecast5": [ { "day":"Fri","hi":79,"lo":46,"icon":"sunny" } ],
               "status": "ok", "stale": false },
  "lake":    { "pct": 78, "storageAf": 101200, "capacityAf": 129700,
               "elevationFt": 7642, "status": "ok", "stale": false },
  "stream":  { "combinedCfs": 142,
               "gauges": [ { "id":"09352900","name":"Vallecito Creek","cfs":96 },
                           { "id":"09352800","name":"Pine River","cfs":46 } ],
               "status": "ok", "stale": false },
  "alert":   { "level": "ok", "title": "All clear",
               "msg": "No red-flag warnings or fire restrictions in effect.",
               "redFlag": false, "fireRestrictionStage": "none",
               "items": [], "status": "ok" },
  "fires":   { "count": 1, "nearestName": "Example Fire", "nearestMiles": 31,
               "msg": "1 active incident within 50 mi", "status": "ok", "stale": false },
  "road":    { "level": "ok", "title": "Clear",
               "msg": "No active CDOT alerts on the Durango access route.", "status": "ok" }
}
```
`level`/`status` vocab: `ok | warn | danger` (drives the colored pills). Alert tile precedence:
Red Flag or Stage 2 → `danger`; Fire Weather Watch or Stage 1 → `warn`; else `ok`.

## 4. Home page (redesign — use `prototype/index.html`)

The prototype in this repo is the approved direction. Productionize it:
- Top-to-bottom order: **dismissible realtor bar → header/nav → hero with 6-tile conditions dashboard
  → emergency contacts → drive times (Durango/Farmington/Albuquerque/Phoenix) → by-the-numbers →
  explore cards → newsletter → footer.**
- Dashboard tiles: Weather (marina), Lake level (% + gauge fill), Alert status (red flag / fire
  restrictions), Wildfires within 50 mi, Streamflow in, Roads. Each links to the relevant `/conditions` anchor.
- Wire `assets/js/conditions.js` to `fetch('/data/conditions.json')` and paint on load (the prototype
  paints from an inline `SAMPLE` object and shows exactly where the fetch goes). Keep last-good values if fetch fails.
- Header conditions strip ("--° · --") reads from the same JSON.
- Accessibility: real `<button>` for the bar close, `aria-live="polite"` on the dashboard, color + icon
  (not color alone) for alert levels, respects `prefers-reduced-motion` (already in prototype).
- Performance: inline critical CSS, lazy-load images, target instant first paint (no layout shift waiting on data).

## 5. Emergency contacts block (new)

Prominent, screenshot-friendly (cell service is poor at the lake). Content from `CONTENT-INVENTORY.md`
("Verified emergency / lake contacts"). 911 visually dominant. **Re-verify every number before launch**
(especially Columbine RD). Make phone numbers `tel:` links. Include LPC Alerts + Watch Duty signup links.

## 6. Fire restrictions & red flag (new)

- Red Flag = NWS alert (automatic, via pipeline §2).
- Fire restriction **Stage none/1/2** = editor-controlled `restrictions.json` (start with the manual
  toggle from `DATA-SOURCES.md` §3). Build a tiny, documented way for David to flip it (a committed JSON
  file is fine). Surface in the Alert tile + a banner on `/conditions`.

## 7. Dismissible realtor announcement bar (new)

- Scrolling marquee message with a close **✕**; remembers dismissal via `localStorage` for 7 days
  (implemented in the prototype — extract to `assets/js/announcement-bar.js`).
- Content: **Julie Coffelt, Coldwell Banker Mountain Properties** ("Vallecito local, 15+ years"),
  links to `real-estate-partner.html`.
- Make the message **config-driven** (one JS/JSON object: text, link, enabled on/off) so David can edit
  it without touching markup, and can reuse the bar for other announcements (fire restrictions, events).

## 8. Realtor listings page (`real-estate-partner.html`)

- Build the page to accept listings two ways, switchable:
  1. **IDX/RESO embed** — if Julie's brokerage provides an IDX widget/feed (Coldwell Banker / RESO Web API),
     drop it into a clearly marked container. **Do not scrape MLS** — only display via an authorized IDX/feed.
  2. **Manual fallback** — a simple `listings.json` (address, price, beds/baths, photo, link) rendered as cards,
     for use until the IDX feed is available.
- Include Julie's bio, photo, contact, and a contact form. (Confirm with David which path before finalizing.)

## 9. Site-wide cleanups

- **Unify the navigation** across all pages (see `CONTENT-INVENTORY.md` — currently two inconsistent variants).
- Consistent header conditions strip on every page, fed by `conditions.json`.
- Keep the existing local voice and all `/conditions` "Trusted sources" groupings (Fire & Safety / Lake & Rec / Community).
- SEO: preserve titles/meta/OG tags already in use; keep `og-default.jpg`.

## 10. Acceptance criteria

- [ ] Home page paints conditions instantly (no "--" wait) from `conditions.json`; degrades gracefully per-tile.
- [ ] Worker cron runs every 15 min, writes KV, survives any single source failing.
- [ ] Red Flag Warning and Stage 1/2 restrictions visibly change the Alert tile.
- [ ] Emergency contacts block present, `tel:` links work, numbers re-verified.
- [ ] Realtor bar scrolls, closes, and stays closed for 7 days; links to the listings page.
- [ ] Listings page works in manual mode; IDX container ready to drop in.
- [ ] Navigation identical on every page; all existing pages rebuilt with content from `CONTENT-INVENTORY.md`.
- [ ] No third-party API keys in the repo; all live API calls happen in the Worker.
- [ ] Lighthouse: performance ≥ 90, accessibility ≥ 95 on the home page.

## 11. Suggested build order

1. Repo scaffold + shared `styles.css` extracted from the prototype.
2. `conditions.json` schema + sample + `conditions.js` painter (works against sample first).
3. Home page productionized from prototype.
4. Cloudflare Worker pipeline, one source at a time (start with USGS lake + NWS — both keyless).
5. Wire site to live `/data/conditions.json`.
6. Emergency contacts + fire-restriction toggle.
7. Announcement bar + realtor listings page.
8. Rebuild remaining pages; unify nav; QA against acceptance criteria.
