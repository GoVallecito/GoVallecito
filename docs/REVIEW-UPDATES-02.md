# Review Updates — Round 2 (for Claude Code)

David's second review pass. Apply to `public/`, keep the local voice, redeploy + push when done.
Pairs with REVIEW-UPDATES-01.md (do both).

## 1. Ease off the "7,665 ft" references

The exact elevation is repeated too often and reads robotic. Keep **one** precise mention (the
"By the numbers" stat is the right home for it) and vary everywhere else:
- "7,000+ feet", "up at 7K", "at altitude", "high in the San Juans", "the high country", "up here".
- The slogan "Elevation Changes Everything" carries the theme — let it do the work instead of repeating the number.
- Audit every page (titles, meta descriptions, hero, body) and replace repeated "7,665 ft / feet" with varied phrasing. Meta descriptions especially shouldn't all say "7,665 ft."

## 2. Remove the Events area (like the newsletter)

David wants the site as hands-off as possible; events are too much upkeep right now.
- Remove **Events** from the nav, the footer, the home "next event" module, and delete/redirect the events page.
- Mirror how we're removing the newsletter. Leave the layout balanced where it was.

## 3. Julie Coffelt photo — file is in place

Her headshot is committed at **`public/assets/img/Julie_Coffelt.png`** (note: PNG, underscores).
Wire that exact path into the real-estate-partner page (and a small crop in the announcement bar if it fits).

## 4. Fuel — add non-ethanol at Country Market

Real selling point for the rec-vehicle crowd (boats, ATVs, small engines hate ethanol).
- **Vallecito Lake Country Market & La Comida Ranchera** (18071 CR 501): add **"Gas — including non-ethanol
  fuel, ideal for boats, ATVs, and small engines"** to its directory listing.
- Add a short **"Fuel"** note on Plan Your Visit: two options — the **Marina** (on-the-water fill-ups) and
  **Country Market** (non-ethanol for trailered rigs and ATVs). This is genuinely useful trip-planning info.

## 5. Local guides — reach them beyond a phone number (research)

Each business profile should carry **all** the ways to reach them: website, email, Facebook/Instagram,
online booking, hours, address/map — not just a phone number. Verified so far:

| Business | Phone | Website | Email | Social |
|---|---|---|---|---|
| Fisher Guide Service | (970) 769-0669 | fisherguideservicevallecito.com | — | facebook.com/fisherguideservicevallecito |
| Vallecito Lake Outfitters | (970) 759-9135 | vallecitolakeoutfitters.com | packtrips@vallecitolakeoutfitters.com | facebook.com/Vallecitolakeoutfitter |
| Charter Vallecito | (970) 769-3300 | chartervallecito.com | — | (check site) |
| Go Fish Durango | — | gofishdurango.com | (via site) | (check site) |
| Vallecito Marina | (970) 884-7000 | vallecitolakemarina.net | (via site) | (check FB) |

**Action for Claude Code:** for each directory business, visit its website and capture email, social
links, online-booking URL, and hours; add them to the listing's data so every profile shows the full
set of contact options (icon row: 📞 phone · 🌐 site · ✉️ email · 📅 book · f / IG). Where a field is
unknown, omit it rather than guess.

## 6. Local Guide — reorganize to highlight paid / trusted partners (strategy)

David wants the directory to truly showcase businesses that sign up, with expanded profiles. Proposed
**three-tier model** (the old site already hinted at this with `/real-estate-partner` and
`/lodging-partner` slots — build it out properly):

**Tier 1 — Basic (free):** name, category, one-line description, phone, website, season/status. Standard
list row. Keeps the directory comprehensive so it's genuinely useful.

**Tier 2 — Verified (free or low cost):** adds a **"Verified Local"** badge (we confirmed it's current),
full contact row (web/email/social/booking), hours, and a map pin.

**Tier 3 — Featured Partner (paid):** an **expanded profile** that stands out:
- Photo or small gallery, logo, longer description, a booking/website **CTA button**.
- **Pinned to the top of its category** + a "Featured" strip at the top of the directory.
- A **"GoVallecito Partner"** badge and an optional seasonal offer/coupon line.
- Its own profile page (`/business/<slug>`) — better for the business and for SEO.

**Why this attracts businesses:** the site's traffic is high-intent trip-planners (they came for
conditions and are deciding where to stay/eat/fish). A featured profile with photos + a booking button
converts that attention. Sell featured slots seasonally/annually; seed it with the partners already
modeled — Julie (real estate) and Pine River Lodge (lodging) — as the showcase examples.

**Layout reorg:** Featured cards (rich, image-forward) at the top of each category → Verified rows →
Basic rows. Keep the category filter and search. Consider category landing emphasis for the money
categories: **Lodging, Fishing/Outfitters, Real Estate, Dining**.

**Hands-off fit:** all listings stay as static JSON (`data/listings`-style); partners email changes;
expanded profiles are one-time builds. No ongoing feed to babysit.

> Recommendation: have Claude Code implement the **tier structure + expanded-profile card/page now**
> (even with just the two seed partners), so the framework exists and you can add paying businesses by
> editing JSON. Decide pricing later — the site just needs the slots.

## 7. Takeaways from the live govallecito.com worth keeping

Re-checked the live site against our rebuild. Most of its substance we already have or improved (and
notably, our live-data actually works — theirs still shows placeholders). Worth porting:
- **"What's happening this week" blurb** — the live home has a short human note ("Marina and dock open…
  mid-70s and sunny… mosquitoes are out, pack accordingly"). It's charming but **manual = not hands-off**.
  Suggestion: **auto-generate** a one-line "this week" summary from the live conditions (temp band +
  alert state + marina open/closed) so we keep the warmth without the upkeep. Optional.
- **Evocative voice** — lines like "fish for kokanee in the morning, hike a high pass in the afternoon,
  watch the sun drop behind the divide while the loons call from the cove." Fold a touch of that lyric
  quality into the home intro.
- **"12 Things to Do at Vallecito Lake This Summer"** (their blog post) — rather than a blog (upkeep),
  fold its evergreen content into the **Things To Do** page so we keep the SEO value without a blog to maintain.
- Skip porting their blog and events modules (upkeep, and we're removing events).

## 8. After applying
- Redeploy: `npx wrangler pages deploy public --project-name=govallecito-web`; commit + push.
- Flag for David: directory tier visual treatment, and any business contact fields you couldn't verify.
