# Review Updates — Round 4 (for Claude Code)

Apply to `public/`; redeploy pages and push.

## 1. Julie's bio — remove any flood reference; use her authentic bio

David: no flooding references (a major flood hit the area <1 yr ago; too soon). Focus on insider local
knowledge. Her own Coldwell Banker bio is better than the earlier draft and has **no flood mention** —
use this trimmed version (David/Julie may tweak):

> Julie has called the Four Corners home for more than 25 years — raising a family here, building lasting
> relationships, and developing a deep appreciation for the communities and lifestyle that make this
> region special. Her earlier careers in aviation and as a closed-captioning transcriptionist, plus her
> work as an amateur radio operator, sharpened the things that matter most in a real estate deal: clear
> communication, quick problem-solving, patience under pressure, and staying calm when the stakes are
> high. Whether you're buying your first home, upgrading, downsizing, investing, or getting ready to
> sell, Julie treats it as the major life milestone it is — guiding clients with honesty, responsiveness,
> and an advocate's eye, and negotiating fiercely to protect your interests from start to finish. As an
> Associate Broker with Coldwell Banker Mountain Properties, she pairs genuine local knowledge with the
> reach of one of the most trusted names in real estate.

**Contact (publicly listed on Coldwell Banker's national site — safe to publish):**
- Phone (business): **(970) 769-5373**
- Email: **julie.coffelt@cbmp.com**
- Agent site: http://www.julie-coffelt.cbmp.com/
- Title: Associate Broker · License # FA.100086311
(So the earlier "withhold her phone" hold can be lifted — these are her public professional contacts.
Still courteous to give her a heads-up before launch.)

## 2. Listings — real photos + links (replace the link-only cards)

Use Julie's **current active** listings (authoritative, from coldwellbanker.com, "deemed reliable but not
guaranteed"). Each card = main photo + address + price + beds/baths/size + "View listing →".

**Photo URL pattern** (main photo): split the MLS# into 2-digit pairs:
`https://images-listings.coldwellbanker.com/CO_CREN/<dd>/<dd>/<dd>/_P/<MLS>_P00.jpg`
e.g. MLS 835099 → `.../CO_CREN/83/50/99/_P/835099_P00.jpg`. (Hotlink is fine; add an `onerror` fallback
to a tasteful placeholder in case a photo changes when a listing sells.)

```json
[
  { "address": "1896 County Road 500, Bayfield, CO 81122", "price": "$972,000",
    "beds": 3, "baths": 3, "size": "2,251 sqft", "type": "Single Family", "mls": "835099",
    "url": "https://www.coldwellbanker.com/co/bayfield/1896-county-road-500/lid-P00800000HBPQyE2r7NI2B5RoHUAzYOgkGkdKtRc",
    "photo": "https://images-listings.coldwellbanker.com/CO_CREN/83/50/99/_P/835099_P00.jpg" },
  { "address": "787 Mushroom Lane, Bayfield, CO 81122", "price": "$1,250,000",
    "beds": 3, "baths": 4, "size": "2,696 sqft", "type": "Single Family", "mls": "835056",
    "url": "https://www.coldwellbanker.com/co/bayfield/787-mushroom-ln/lid-P00800000HBMMdXdf7bSmsOjZS5hnoRM4mcL3f8X",
    "photo": "https://images-listings.coldwellbanker.com/CO_CREN/83/50/56/_P/835056_P00.jpg" },
  { "address": "1429 County Road 500, Bayfield, CO 81122", "price": "$675,000",
    "beds": 2, "baths": 3, "size": "2,412 sqft", "type": "Single Family", "mls": "834474",
    "url": "https://www.coldwellbanker.com/co/bayfield/1429-county-road-500/lid-P00800000HAcfJnGxpMqjyfGvdrp2F2sShEjWG1c",
    "photo": "https://images-listings.coldwellbanker.com/CO_CREN/83/44/74/_P/834474_P00.jpg" },
  { "address": "210 Ponderosa Homes Drive, Bayfield, CO 81122", "price": "$595,000",
    "beds": 3, "baths": 2, "size": "3,136 sqft", "type": "Single Family", "mls": "833569",
    "url": "https://www.coldwellbanker.com/co/bayfield/210-ponderosa-homes-rd/lid-P00800000H9NxDxD8byW03kJ13XDByDfhDS2yaBq",
    "photo": "https://images-listings.coldwellbanker.com/CO_CREN/83/35/69/_P/833569_P00.jpg" },
  { "address": "126 Sierra Verde Lane, Durango, CO 81301", "price": "$115,000",
    "beds": null, "baths": null, "size": "0.75 acre", "type": "Land", "mls": "827685",
    "url": "https://www.coldwellbanker.com/co/durango/126-sierra-verde-ln/lid-P00800000Gwsufg0awYjW9aVEHOhEAqNMcVyfIQf",
    "photo": "https://images-listings.coldwellbanker.com/CO_CREN/82/76/85/_P/827685_P00.jpg" }
]
```

> ⚠️ For David, not to auto-apply: 3 URLs you sent (18 / 48 W / 18-20-22-48 W Vallecito Creek) are NOT in
> Julie's current active CB listings — likely sold/pending or land listed elsewhere. Left out pending
> your confirmation. If you want them featured anyway, send the photo or confirm status and I'll add them.
- Add a small "Listings deemed reliable but not guaranteed · via Coldwell Banker" disclaimer + a
  "See all of Julie's listings →" link to her agent page.

## 3. Scrolling announcement message — new copy (less "lake", mountain-town tone)

Current message repeats "lake/Vallecito." Replace the `ANNOUNCEMENT` text with:

> **Primary:** "Dreaming of a place in the mountains? Julie Coffelt — local broker with Coldwell Banker
> Mountain Properties — knows every road and ridge up here. See what's for sale →"
>
> **Alt (shorter):** "Thinking about putting down roots in the San Juans? Meet Julie Coffelt, your local
> Coldwell Banker broker — browse current listings →"

Keep it a single smooth line; link to the real-estate-partner page.

## 4. After applying
Redeploy pages + push. Flag for David: confirm the 3 Vallecito Creek listings' status, and that Julie's
okay with her bio/photo/contact going public.
