# Review Updates — Round 7: Featured profiles + directory expansion (for Claude Code)

David wants several businesses set as **Featured Partners** (the rich expanded-profile tier), and the
directory broadened beyond tourism into **community + local services**. Apply to `data/directory.json`
+ the directory rendering; redeploy + push.

## Tier changes
- **Set FEATURED:** Vallecito Marina & Yacht Club · Vallecito Lake Country Market · Blue Spruce RV Park
  & Cabins · Vallecito Church · Coronado Consulting & Fire Mitigation · Excel Excavation (pending data).
- **Remove FEATURED:** Pine River Lodge → demote to a standard/Verified listing (keep it in the directory).

## New categories (directory is now a community hub, not just tourism)
Add two categories so non-tourism listings fit:
- **Local Services** (arborist/fire mitigation, excavation, trades)
- **Community** (church / worship / community orgs)

## Featured profiles (verified data — June 2026)

### Vallecito Marina & Yacht Club — *Marina & Water*
- Boat rentals (fishing boats, pontoons, kayaks, SUPs), slips, buoy service, **fuel**, and a store.
- 14772 CR 501 (SE shore) · **(970) 884-7000** · vallecitolakemarina.net · FB "Vallecito Marina and Yacht Club"
- Hours: 7 a.m.–7 p.m., 7 days, **May–Sep** (they post current hours on Facebook).

### Vallecito Lake Country Market & La Comida Ranchera (+ Vallecito Liquors) — *Restaurants / Retail*
- Groceries, Mexican restaurant, liquor, **gas + propane** — the lake-area fuel stop, with **non-ethanol
  gas (great for boats, ATVs & small engines)**.
- 18071 CR 501 · **(970) 884-0844** · FB facebook.com/VallecitoLakeCountryMarket
- Hours: Mon 7–7, Tue & Wed closed, Thu–Sat 7–7, Sun 7–3.

### Blue Spruce RV Park & Cabins — *Lodging*
- RV park + cabins (RV sites ~May–Nov, cabins year-round).
- **(970) 884-2641** · bluesprucervpark.com · (Facebook/hours TBD — confirm or I'll enrich next pass.)

### Vallecito Church — *Community*  ⚠️ name check
- Southern Baptist church. **Sunday School 9:00 AM · Worship 10:30 AM.**
- 17576 CR 501, Bayfield · **(970) 884-2901** · vallecitochurch.org · FB facebook.com/vallecito.church
- ⚠️ David said "Vallecito **Community** Church"; the verified name is **"Vallecito Church"** (a.k.a.
  Vallecito Baptist Church). Confirm which name to display.

### Coronado Consulting & Fire Mitigation LLC — *Local Services (Arborist / Fire Mitigation)*
- Arborist & tree care, **wildfire mitigation, defensible space**; serves Bayfield, La Plata County,
  Durango. Established 2019; certified owners.
- 485 Forest Lakes Dr, Bayfield · **Robert (970) 903-7907** · **Danielle (575) 202-1642** ·
  coronadocfm@gmail.com · **ccfmllc.com** · FB "Coronado Consulting & Fire Mitigation LLC"
- Nice cross-link: feature this near the Phase 2 "Firewise Living" content and the fire-restriction section.

### Excel Excavation — *Local Services (Excavation)* — ⚠️ DATA NEEDED
- Not found in any public source (no website/listing surfaced). Almost certainly Facebook-only or
  word-of-mouth. **Need from David:** the Facebook page URL (or owner name + phone) so I can pull
  accurate info. Until then, build the featured slot but leave it unpublished/placeholder — do NOT
  attach another excavator's info.

## Images / logos
Most of these are Facebook-first with no logo we can pull cleanly (FB blocks scraping; logos sit behind
tokens). Plan:
- Featured card supports an optional `logo`/`photo` (file in `public/assets/img/` or, where a real
  website exists, an `og:image` hotlink with `onerror` fallback). Coronado (ccfmllc.com) and the Marina
  (vallecitolakemarina.net) likely have usable site images; the FB-only ones need David to drop a logo,
  or we grab them when the Chrome tool is connected.
- Until a logo/photo exists, show a clean branded placeholder with the business name — never a broken image.

## Featured card contents (all tiers)
Name · category badge · short description · hours (if known) · full contact row (phone(s) · website ·
email · Facebook) · CTA button (Call / Visit site / Message on Facebook). Pin featured to the top of
their category + the directory "Featured" strip.

## After applying
Redeploy + push. Flag: Excel data, church name, and which logos still need David.
