# Review Updates — Round 23: Red-flag visibility + directory images (for Claude Code)

Build with/after Round 22. Item A is life-safety UX — prioritize it. Deploy Pages (+ no worker changes
needed unless noted), push.

## A. Red Flag Warning — site-wide visibility (life-safety)
**Verified state (June 7 2026, do not re-litigate):** the pipeline is correct — `getAlerts()` queries
NWS by Vallecito's exact point (37.3361,-107.5617) every 15 min via cron; an active RFW sets
`alert.level: "danger"`, `redFlag: true` and the conditions tile goes red (confirmed live today with the
real RFW in effect through June 9). The gap is that OTHER pages only show temp/lake in the condbar strip.

1. **FULL-WIDTH RED BANNER across the top of EVERY page (David's explicit requirement):** when
   `alert.level === "danger"` (covers RFW and Stage 2), the condbar strip becomes a prominent
   **solid-red, full-width banner** — white bold text, larger than the normal strip, impossible to
   miss on desktop AND mobile:
   `🔴 RED FLAG WARNING — extreme fire danger · no open fires · details →` (links
   conditions.html#alerts; use `{alert.title}` so Stage-2 reads correctly). Normal slim strip returns
   when the alert clears. The strip already loads conditions.js on every page, so this is a
   front-end-only change in the strip-paint function + CSS. `aria-live="polite"` so screen readers
   announce it. This must read as a WARNING BANNER, not a restyled status line — visibility is the
   whole point (danger to life and property).
2. **Front-end refresh:** confirm conditions.js re-fetches on an interval (~15 min) on long-open pages
   AND on `visibilitychange` (user returns to a stale tab → refetch). Add the visibility handler if
   missing — that's the realistic "left the tab open overnight" case.
3. **Home alert tile:** when danger, the tile's pill should name the hazard explicitly ("🔴 Red Flag
   Warning") — verify it already does; fix if generic.
4. **Document the protocol** on sources.html (#how-we-verify table already lists alerts): add one line —
   "Alerts are checked for Vallecito's exact coordinates (not a nearby city's zone) every 15 minutes;
   Red Flag Warnings take priority over everything else on the site."
5. Verify with the CURRENT live RFW (active through ~June 9): strip red on home + 3 other pages,
   correct text, link works, mobile legible.

## B. Marina image — photo instead of logo
directory.json `vallecito-marina`: set `image` to one of the existing dock/boats photos
(`/assets/img/featured/marina-1.jpg` — boats at the dock) with `imageAlt` ("Boats docked at Vallecito
Marina") and `imageFit: "cover"` (same pattern as Blue Spruce). Keep the logo available in the `photos`
array. If marina-1.jpg isn't actually in the repo yet (it's listed in docs/FEATURED-ASSETS.md with its
source URL on the marina's own site), download + optimize it per the image pipeline first
(inline ≤150 KB). Re-run gen-schema if the directory image feeds it.

## C. Vallecito Church images
- Their site (vallecitochurch.org) is JS-rendered — fetch it with the rendered preview browser and look
  for a usable photo of the building (their own promo imagery on their own listing = OK, same courtesy
  basis as the other featured partners; note it for the partner-courtesy confirm list).
- If a clean image URL is found: download → optimize → `image` + `imageAlt` + `imageFit:"cover"` on the
  church's directory entry (and `photos` if there are 2–3 good ones).
- If nothing extractable: leave the entry as-is and FLAG in the build report — David asks the church
  directly (they're a featured partner; an easy welcome ask). Do NOT pull from Facebook.

## After applying
Deploy + push. Verify per-item (A5 especially, against the live warning). Report: church image found or
flagged; marina image source used.
