# Review Updates — Round 5: Lake weather panel (for Claude Code)

## Station

- **KCOBAYFI57 — "Vallecito Reservoir"**, elev 7,733 ft, 37.39°N / -107.57°W. Right at the lake.
- **Status when checked (June 6, 2026): OFFLINE** (no current readings). Handle gracefully (below).
- Owner unconfirmed (maybe marina/PRID/resident). David to confirm + obtain the free WU API key from the owner.

## Wiring (worker)

- Set `WU_STATION_ID = "KCOBAYFI57"` (non-secret, in `[vars]` of wrangler.toml — ready now).
- **Still need `WU_API_KEY`** (free WU member/PWS key) as a secret. Until it's set, weather stays on NWS.
- The existing `getWeather` WU path activates when BOTH key + station are present. Add these safeguards:
  - **Freshness check on the PWS obs:** only use the WU reading if `obsTimeUtc`/`obsTimeLocal` is recent
    (e.g., within ~60–90 min). If the station is offline/stale, **fall back to NWS** and don't show old
    PWS numbers as "now."
  - **Source label** in the data + UI: show "Vallecito Reservoir station (KCOBAYFI57)" when using WU,
    "National Weather Service" when on fallback — so users know which they're seeing.
  - Keep `obsTime` and show "as of HH:MM."

## Pertinent info to display — visitors + boaters + anglers

KCOBAYFI57 reports all of these; show them all when live (omit any that read null):

**Headline (everyone)**
- Temperature + **Feels like** (heat index / wind chill)
- Sky/precip state · observation time

**Boaters — wind is the priority**
- **Wind speed + gust + direction** (compass, e.g. "WSW 12 gusting 20 mph")
- Plain-language lake state from wind (general guidance, not a guarantee):
  - < 5 mph: glassy/calm · 5–10: light chop · 10–15: choppy · 15–20: whitecaps forming ·
    20+ mph: small-craft caution — consider getting off the water
- Pair with the existing local note: "Wind usually builds after ~2 PM — plan glassy mornings."

**Anglers — pressure trend is the priority**
- **Barometric pressure + trend** (rising / steady / falling — compute by comparing to the prior cached
  reading). Rule-of-thumb to show as a tip: a *falling* barometer ahead of a front often turns fish on;
  *steady high* is variable; sharp *rising* after a front tends to slow the bite.
- Dew point + humidity (fog potential on cold mornings)
- Precipitation rate + today's total

**Altitude/sun (everyone, esp. on open water)**
- **UV index** + a short "burns fast on the water at 7,700 ft — wear sunscreen" note when UV is high.

**Layout suggestion:** a "Lake Weather" panel (home dashboard links to it; full panel on /conditions)
with Temp/Feels-like up top, a **Wind block** (big, for boaters) and a **Pressure-trend block** (for
anglers) side by side, then humidity/dew point, precip, and UV. Clearly badge the source + obs time.

## How David gets the free WU API key
1. The **station owner** (whoever runs KCOBAYFI57) can generate a free key: log in at wunderground.com →
   **Member Settings → API Keys**. A WU PWS contributor key is free and works for any public station.
2. If the owner is unreachable, David can register any PWS of his own to obtain a key, or we keep NWS
   until the marina/owner provides one.
> Update to docs/marina-weather-request.md: we now have the **station ID (KCOBAYFI57)** — the only thing
> still needed from the owner is the **free API key**.

## After applying
- Set the station var now; leave WU_API_KEY unset until provided (NWS fallback meanwhile).
- Build the expanded Lake Weather panel so it lights up fully the moment the key + a live station feed
  are in. Redeploy + push.
