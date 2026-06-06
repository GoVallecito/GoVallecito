# Message to the marina — Weather Underground station access

Short version you can paste into an email or text. Goal: get the two free things the
site needs to show the marina's own weather reading. Nothing here costs the marina anything.

---

**Subject: Quick ask — featuring your weather station on GoVallecito.com**

Hi [name],

We're upgrading GoVallecito.com so the home page shows live lake conditions, and we'd love to
feature your weather station so visitors see the *actual* weather right at the marina.

Two quick things we'd need — both free:

1. **Your Weather Underground station ID** (it looks like `KCOBAYFI12`). It's shown on your
   station's page on wunderground.com.

2. **A free Weather Underground API key.** Because you contribute data from a personal weather
   station, WU gives station owners a free key:
   log in at wunderground.com → **Profile / Member Settings → API Keys → generate key**.

We'll use it only to display your station's current conditions on the site (refreshed every
15 minutes), with credit to the marina. Happy to jump on a quick call if that's easier.

Thanks so much — this'll help a lot of folks plan their trips up here.

[David]
GoVallecito.com

---

### When the marina replies, you'll have:
- `WU_STATION_ID` (e.g. `KCOBAYFI12`)
- `WU_API_KEY` (a long string)

These get added during the Cloudflare deploy step — station ID as a plain var, the key as a
secret (`wrangler secret put WU_API_KEY`). Until then, the weather tile uses NWS automatically.
