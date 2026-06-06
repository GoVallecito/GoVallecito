# GoVallecito — Content Inventory (captured from live site, June 2026)

Captured by reading the live site at govallecito.com. Use this to rebuild pages faithfully.
Pages marked **JS-rendered** returned no static HTML to the fetcher and must be re-captured in a
browser (or rebuilt from notes) — their content below is partial.

## Global

- **Brand:** GoVallecito.com — tagline **"Elevation Changes Everything"** · 7,665 ft · "Made with care in the San Juans."
- **Voice:** written by locals, plain-spoken, practical, a little dry humor. Keep it.
- **⚠️ Navigation is inconsistent across pages — UNIFY IT.** Two variants exist in the wild:
  - Short: Things To Do · Plan Your Visit · Local Guide · Conditions · About
  - Long: Home · Conditions · Directory · Things To Do · Fishing · Events · Plan Your Visit · About · Blog · Contact
  - **Recommended unified nav:** Conditions · Things To Do · Fishing · Local Guide · Events · Plan Your Visit · About · Contact (+ a persistent "Live Conditions" CTA).
- **Footer:** Explore links, Trusted sources (NWS, InciWeb, USGS, CDOT, PRID), newsletter signup, © 2026.
- **Mini conditions strip** appears in the header on sub-pages ("--° · -- View full conditions") — currently shows placeholders; should read from `conditions.json`.

## Home (`/`)
Hero "Vallecito Lake, Colorado" + conditions strip (Temperature / Lake level / Alert status — all placeholder). Sections: What's happening this week · Active wildfires · Lake level · Road conditions · By the numbers (Elevation 7,665 ft, Shoreline 12 mi, Surface area 2,720 ac, Max depth 120 ft, From Durango ~35 min) · "A small lake town with big country" blurb · Latest from the community (blog + next event) · Newsletter. **→ This is the page being redesigned (see prototype + BUILD-SPEC).**

## Conditions (`/conditions/`)
The most data-rich page. Sections: live weather (temp, wind, humidity, today's high/low, 5-day, source NOAA/NWS) · Weather alerts (NWS, La Plata County) · Active wildfires (NIFC/InciWeb, within 50 mi) · Road conditions (US 160, Durango access) · Lake level (USBR, storage + % full) · Streamflow into Vallecito (USGS 09352900 Vallecito Creek, USGS 09352800 Pine River) · **Trusted sources** grouped into **Fire & Safety** (Watch Duty, InciWeb, LPC Emergency Mgmt / LPC Alerts, Upper Pine River Fire, Vallecito Flood Recovery, Firewise USA), **Lake & Recreation** (PRID permits, Vallecito Marina, USFS Columbine RD, CPW rec-lands brochure, Tour of Carvings, Vallecito Nordic), **Community** (Vallecito Lake Chamber FB, COtrip, La Plata County). All live values currently show placeholders.

## Things To Do (`/things-to-do/`)
Anchored sections: Trails · Lake · Horseback · ATV & OHV · Tour of Carvings · Winter · Stargazing.
- **Trails:** Lake Trail System (Easy) · Vallecito Creek Trail (Moderate, 11.7 mi OAB, 1,456 ft) · Pine River Trail (Hard, 20.1 mi, 3,005 ft) · Rock Lake Trail (Strenuous, ~20 mi) · Johnson Creek Trail (Moderate, ~8 mi). Pro tip: Vallecito Creek lot fills by 9 a.m.
- **Lake:** boating (marina rentals), fishing (→ fishing page), swimming (north end, no lifeguards, snowmelt-cold), kayak/SUP (PRID permit), ice fishing (VCSA Feb tournament).
- **Horseback:** Vallecito Lake Outfitters; Elk Point Lodge Stables (Thu–Mon, late May–early Oct).
- **ATV/OHV:** Altitude ATV & Side-by-Side Rentals, 32 Middle Mountain Rd, (970) 403-2260, durangoatv.com; USFS Columbine RD motor-vehicle-use maps.
- **Tour of Carvings:** 14 Chad Haspels chainsaw sculptures memorializing the 2002 Missionary Ridge Fire, self-guided, free, year-round, carvingsatvallecito.org.
- **Winter:** XC skiing (~15 km groomed, Vallecito Nordic Club, FR 603 below Old Timers Campground, PRID land-use fee) · snowshoeing · ice fishing (Fisher Guide Service) · snowmobiling (USFS roads).
- **Stargazing:** 7,665 ft, low light pollution; best Sept–Nov; seeing forecast ClearOutside.com/forecast/37.38/-107.58.

## Fishing (`/fishing/`)
Sections: Species · Seasons · Permits · Regs · Guides · Local notes.
- **Species:** Rainbow Trout (Apr–Jun, Sep–Oct) · Brown Trout (late Sep–Nov) · Kokanee Salmon — "the headliner" (Jun–Aug troll, Sep–Dec spawn) · Northern Pike — "the trophy", 20+ lb (Apr–Jun, Sep–Oct) · Walleye (May–Jun, Sep–Oct) · Smallmouth Bass (Jun–Aug). Plus brook trout in upper creek.
- **Seasons:** Ice-out (Apr–May) · Summer (Jun–Aug, wind up by 2 PM) · Fall (Sep–Oct, best) · Ice (Nov–Mar, late-Feb tournament).
- **Permits:** CO fishing license (16+), Habitat Stamp ($12.76, ages 18–64), PRID recreation permit (970) 884-2558.
- **Regs (2026):** trout bag 4 · walleye 5 · kokanee 10 · pike/smallmouth/perch no limit · snagging Nov 15–Dec 31 (Vallecito & Grimes Creek only) · kokanee spawn closure Sep 1–Nov 30 · license season Mar 1 2026–Mar 31 2027 · free fishing first full weekend of June.
- **Guides:** Fisher Guide Service (970) 769-0669 · Vallecito Lake Outfitters (970) 759-9135 · Charter Vallecito (970) 769-3300 · Go Fish Durango.

## Local Guide / Directory (`/directory/`)
Searchable, filter by: All · Lodging · Restaurants · Marina & Water · Outfitters & Guides · Retail · Real Estate. **24 listings.** Includes references to `/real-estate-partner` and `/lodging-partner` "featured partner" slots.
Key listings (name · category · phone · site):
- Pine River Lodge (Lodging, featured) · (970) 884-2563 · pineriverlodge.com
- 5 Branches Camper Park & Cabins · 5branches.com
- Altitude ATV · (970) 403-2260 · durangoatv.com
- Bayfield Realty (Real Estate) · 823 CR 501 · (970) 884-9517 · bayfieldrealty.com
- Bear Paw Lodge · (970) 884-2508 · Blue Spruce RV Park · (970) 884-2641
- Cabins on Vallecito Lake · Charter Vallecito · (970) 769-3300
- Coldwell Banker Mountain Properties (Real Estate) · cbmp.com
- Croll Cabins · Elk Point Lodge · (970) 884-2482 · Elk Point Lodge Stables
- Fisher Guide Service · (970) 769-0669 · Go Fish Durango
- **★ Julie Coffelt — Coldwell Banker Mountain Properties (Real Estate)** · "Local Vallecito Lake realtor, 15+ years living at the lake" · cbmp.com/Real-Estate-Agent/julie-coffelt/83564  ← **the realtor for the announcement bar / real-estate-partner page**
- JW Vallecito Resort · (888) 258-9458 · Lone Wolf Cabins · (970) 884-0414
- Pine River Irrigation District (Marina & Water) · (970) 884-2558
- Rocky Mountain General Store & Custom Meats · 17454 CR 501 · (970) 884-0999
- Vallecito Lake Country Market & La Comida Ranchera · 18071 CR 501 · (970) 884-0844
- Vallecito Lake Outfitters · (970) 759-9135
- Vallecito Marina & Yacht Club · 14772 CR 501 · (970) 884-7000 · vallecitolakemarina.net
- Wells Group / RE/MAX / NextHome · durangohomesforsale.com
- Weminuche Woodfire Grill · 18044 CR 501 · (970) 884-7153 · weminuchegrill.com

## Contact (`/contact/`)
Form: name, email, topic (Correction/update · Business listing · Event submission · General question · Other), message; honeypot anti-spam field. "We read everything."

## About (`/about/`) — **JS-rendered, recapture needed**
## Plan Your Visit (`/plan-your-visit/`) — **JS-rendered, recapture needed**
## Events (`/events/`) — **JS-rendered, recapture needed.** Known: Pondering Pines Maker's Market (Sat May 16, 10 AM, Weminuche Woodfire Grill, 18044 CR 501, Bayfield).
## Blog (`/blog/`) — **JS-rendered.** Known post: "12 Things to Do at Vallecito Lake This Summer" (May 10, 2026).
## Real Estate Partner (`/real-estate-partner/`) — **JS-rendered, recapture needed.** This is the realtor landing page the announcement bar should link to.

> **Reservoir capacity confirmed:** 129,700 acre-feet at full pool (elev. 7,665 ft). Use as the `% full` denominator.

## Verified emergency / lake contacts (re-verify before launch)
- **911** — fire / medical / rescue
- La Plata County Sheriff **non-emergency dispatch (970) 385-2900**; admin (970) 247-1157
- Upper Pine River Fire Protection District **(970) 884-9508** (515 Sower Dr, Bayfield)
- Vallecito Marina (970) 884-7000 · PRID (970) 884-2558
- USFS Columbine Ranger District (970) 884-2512 ✓ verified June 2026 (367 Pearl St, Bayfield)
- CDOT road conditions **511**
- LPC Alerts (emergency notifications signup) · Watch Duty (wildfire alerts)
