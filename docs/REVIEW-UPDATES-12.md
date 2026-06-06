# Review Updates — Round 12 (revised): Road cameras on the travel page (for Claude Code)

COtrip's new map is fully JavaScript-rendered, so snapshot image URLs can't be scraped from the deep-links
below, and Chrome's read tools are permission-blocked. Two paths — ship Path A now, upgrade to Path B later.

## The 8 cameras (David-provided COtrip deep-links)
**US 160 @ CR 501 — the Vallecito turnoff** (location 1062):
- https://maps.cotrip.org/@-107.75906,37.29312,12?show=normalCameras#camera/1062/2087932998
- https://maps.cotrip.org/@-107.75906,37.29312,12?show=normalCameras#camera/1062/178590730
- https://maps.cotrip.org/@-107.75906,37.29312,12?show=normalCameras#camera/1062/178589776
- https://maps.cotrip.org/@-107.75906,37.29312,12?show=normalCameras#camera/1062/2087933136

**US 550 @ Wilson Gulch — Durango approach** (location 1052):
- https://maps.cotrip.org/@-107.83986,37.23396,15?show=normalCameras#camera/1052/178590730
- https://maps.cotrip.org/@-107.83986,37.23396,15?show=normalCameras#camera/1052/3698486184
- https://maps.cotrip.org/@-107.83986,37.23396,15?show=normalCameras#camera/1052/178589776
- https://maps.cotrip.org/@-107.83986,37.23396,15?show=normalCameras#camera/1052/2087933136

(Camera→direction mapping unverified; label generically or confirm which view is which on COtrip.)

## PATH A — Camera link tiles (do now, reliable)
On `plan-your-visit.html`, add a **"Live road cameras"** section with two location groups (US 160 @ CR 501,
US 550 @ Wilson Gulch). Each camera = a clean **tile/button** that opens its COtrip link in a new tab
(`target="_blank" rel="noopener"`), grouped + labeled, responsive grid (2×2 desktop, 1-col mobile),
big tap targets. Caption: "Live CDOT cameras on COtrip — opens the official map. Statewide info: dial 511."
- Config-driven (a small `cameras` array of {location, label, url}) so cameras are easy to add/edit.

## PATH B — True live embedded stills (upgrade; needs a free COtrip key)
CDOT's free Traveler-Information data feed returns each camera's snapshot image URL.
- David registers (free) at the COtrip API/management portal (manage-api.cotrip.org →
  maps.cotrip.org/help/117/Traveler-Information-Data-Feed-Access).
- Worker: fetch `cameras.xml` on a short cron, match these 8 camera IDs, extract their snapshot image
  URLs, and expose them (or proxy them) so the page shows **live auto-refreshing stills** (cache-bust the
  `<img>` every ~60s; `onerror` → "camera temporarily unavailable" placeholder). Store the key as a
  Worker secret (`COTRIP_KEY`), never in the repo.
- Same tile layout as Path A, but each tile becomes a live image linking to the COtrip page.

## After applying (Path A now)
Redeploy + push. Confirm the camera tiles render grouped/labeled and open the correct COtrip cameras on
desktop + mobile.
