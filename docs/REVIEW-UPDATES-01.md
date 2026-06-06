# Review Updates — Round 1 (for Claude Code)

David's feedback after reviewing govallecito-web.pages.dev. Apply to the site in `public/`,
keep the local voice, redeploy when done. Research below is verified against primary sources.

## 1. Slogan: "Elevation Changes Everything" — make it the brand throughout

It's the site's slogan and should feel like one.
- **Home page:** elevate it visually — make it a prominent line in/near the hero (not just the small
  eyebrow it is now). Treat it as the tagline under/with "GoVallecito.com".
- **Site-wide footer homage:** add "Elevation Changes Everything" to the footer on **every page**
  (e.g., under the brand name or as a footer tagline/strip). Consistent, understated, on every page.

## 2. Remove the newsletter — entirely

David is planning a lake webcam instead, so the newsletter is going away.
- Remove the newsletter signup **section on the home page**, the **footer "Get lake updates" block**,
  and any newsletter mention on every page. No "subscribe" anywhere.
- Leave a clean gap / rebalance the layout where it was. (Placeholder thought: a webcam panel may
  live here later — fine to leave a tasteful empty space or pull the next section up.)

## 3. Emergency contacts — triple-checked + add lake fire stations

All numbers re-verified June 2026. **Two corrections + a new sub-section.**

**Keep 911 dominant.** Emergencies = 911. Everything else is non-emergency/reference — do NOT present
station direct lines as emergency numbers (several lake stations are *non-staffed*; calling them in a
fire wastes time).

**Verified core contacts (unchanged unless noted):**
- 911 — fire / medical / rescue
- **Non-emergency dispatch: (970) 385-2900** ← confirmed on UPRFPD's own site (shared county dispatch)
- Upper Pine River FPD — main/admin: (970) 884-9508 (515 Sower Dr, Bayfield)
- La Plata County Sheriff (admin): (970) 247-1157
- Vallecito Marina: (970) 884-7000
- Pine River Irrigation District (PRID): (970) 884-2558
- USFS Columbine Ranger District: (970) 884-2512
- CDOT road conditions: 511

**NEW sub-section — "Fire stations around the lake"** (reference / non-emergency).
Source: official upperpinefpd.org/contact. The district has 8 stations; the three nearest the lake/route:

| Station | Location | Phone | Staffing |
|---|---|---|---|
| **Station 4 — North Vallecito** | 80 W. Vallecito Creek, Bayfield | (970) 444-0030 | Staffed (Lake Vallecito is one of 3 stations staffed 24/7) |
| **Station 2 — Vallecito Dam** | 13100 CR 501, Bayfield | (970) 884-8882 | Non-staffed response location |
| **Station 5 — Forest Lakes** | 6891 CR 501, Bayfield | (970) 884-9707 | Staffed (on CR 501 toward the lake) |

> ⚠️ Correction to earlier data: **(970) 884-9804 is Station 4's FAX, not a phone — do not list it.**
Label this block clearly as non-emergency ("For emergencies, always call 911").

## 4. Fire-station reference map vs. the lake

David wants a visual of where the stations sit relative to the lake (find existing, or make one).
- Easiest reliable option: embed/link the district's own map page (**upperpinefpd.org/map/**), and/or a
  Google Maps view with the three stations above pinned. Addresses are exact (above) for geocoding.
- Or build a simple labeled schematic: lake outline + 3 pins (N. Vallecito at the north end / creek
  inlet, Vallecito Dam at the south/dam end, Forest Lakes down CR 501 toward Bayfield).
- Put it next to the "Fire stations around the lake" block (home conditions area and/or /conditions).

## 5. Julie Coffelt — real-estate partner page bio + photo

Her cbmp profile is JavaScript-rendered (couldn't auto-scrape). Verified facts from public listings:
- **23 years in the Four Corners; 15 of them living at Vallecito Lake.**
- Married to her husband **Jeff (30 years)**; **mother of three.**
- **Coldwell Banker Mountain Properties** (cbmp.com), Vallecito Lake.
- Phone seen publicly: **(970) 769-5373** — **VERIFY with Julie before publishing.**

**Draft bio (David/Julie to approve & edit — it's her name on it):**

> Julie Coffelt has called the Four Corners home for more than two decades — and Vallecito Lake
> itself for the last 15 years. She and her husband Jeff raised three kids up here, so when Julie
> talks about life at 7,665 feet, she isn't reciting listing copy — she's describing her own
> backyard. She knows which roads hold snow, how cabin water systems winterize, which coves fish
> best, and what it really takes to own property at elevation. As a REALTOR® with Coldwell Banker
> Mountain Properties, she pairs that hard-won local knowledge with the full-service marketing and
> negotiating strength of one of the most trusted names in real estate. Whether you're buying your
> first mountain getaway, selling a lakeside cabin, or just starting to dream about it, Julie offers
> honest, year-round guidance from a neighbor who's here to stay.

**Photo:** save her headshot to `public/assets/img/julie-coffelt.jpg` and wire it into the
real-estate-partner page (and the announcement bar if a small version fits). Best source is **Julie
herself** (ask for a high-res headshot she's happy with — partners usually want approval), or save it
from her cbmp.com profile. Until the file exists, use a tasteful placeholder so layout doesn't break.

## 6. After applying
- Redeploy: `npx wrangler pages deploy public --project-name=govallecito-web`
- Commit + push.
- Flag anything that needs David's sign-off (Julie's phone, her photo, final bio wording).
