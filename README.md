# GoVallecito.com

Community hub for Vallecito Lake, Colorado — live conditions, local guide, and trip planning at 7,665 ft.

This repo is the rebuild of the site (previously generated as Claude chat artifacts, deployed on
Cloudflare) into a real, versioned codebase. The headline change: **conditions load in the background
every 15 minutes and paint instantly**, instead of the old per-visitor browser fetch that showed "--".

## What's here now

| Path | What it is |
|---|---|
| `prototype/index.html` | **Open this in a browser.** Working, self-contained prototype of the redesigned, conditions-first home page (sample data). Approved visual direction. |
| `docs/BUILD-SPEC.md` | The full build specification — **hand this to Claude Code.** |
| `docs/DATA-SOURCES.md` | Every live data source with exact API endpoints, station IDs, and which need keys. |
| `docs/CONTENT-INVENTORY.md` | All existing page content captured from the live site, for faithful rebuild. |
| `data/conditions.sample.json` | The data contract the site reads. |
| `worker/conditions-worker.js` | Cloudflare Worker (15-min cron) that produces `conditions.json`. Keyless sources (lake, streams, alerts) implemented; weather/fires/roads stubbed with TODOs. |
| `worker/wrangler.toml` | Worker config — cron, KV binding, secrets list. |

## How it fits together

```
GitHub repo ──auto-deploy──► Cloudflare Pages (the website)
     │
     └─ Cloudflare Worker (cron */15) ──► fetches NWS, USGS, NIFC, CDOT, Wunderground
                                          ──► writes conditions.json to KV
website fetches  /data/conditions.json  ──► paints dashboard instantly
```

## Next steps

1. Review `prototype/index.html` and the home-page direction.
2. From the marina: get the **Weather Underground station ID + free API key**.
3. Ask Julie Coffelt's brokerage whether an **IDX/RESO feed** is available for the listings page.
4. Hand `docs/BUILD-SPEC.md` to Claude Code and build in the order at the end of that file.

See `docs/BUILD-SPEC.md` §10 for acceptance criteria.
