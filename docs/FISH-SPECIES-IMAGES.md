# Fish species images — sources & licensing (June 2026)

For the fishing-page species buttons (Round 28). **All USFWS fish illustrations are PUBLIC DOMAIN**
(PD-USGov / PD-USFWS) — commercial use fine, no attribution required (courtesy credit "Illustration:
USFWS" is nice). The matched set = Duane Raver's USFWS series (uniform style). Download → optimize to
small square-ish thumbnails (~400–600px, ≤60 KB each) → `public/assets/img/fish/`. Verify each file in a
browser before relying on it (Commons hashes can move; the `Special:FilePath` URLs are hash-independent).

| Species | Best source (PD) | URL |
|---|---|---|
| Rainbow trout | Commons (Raver) | https://commons.wikimedia.org/wiki/Special:FilePath/Rainbow_trout_FWS_1.jpg |
| Brown trout | Commons | https://commons.wikimedia.org/wiki/Special:FilePath/Brown_trout_Salmo_trutta.jpg (confirm it's the illustration, not a photo) |
| Kokanee salmon | Commons | https://commons.wikimedia.org/wiki/Special:FilePath/Oncorhynchus_nerka_2.jpg (prefer the silvery kokanee/illustration form) |
| Northern pike | Commons (Raver) | https://commons.wikimedia.org/wiki/Special:FilePath/Esox_lucius1.jpg |
| Walleye | Commons (Raver) — Category:Sander vitreus | https://commons.wikimedia.org/wiki/Special:FilePath/Sander_vitreus.jpg · PD fallback: https://www.fws.gov/sites/default/files/documents/walleye.pdf |
| Smallmouth bass | **Pixnio (verified Raver, CC0)** | https://pixnio.com/free-images/fauna-animals/fishes/bass-fishes-pictures/micropterus-dolomieu-smallmouth-bass-fish.jpg |
| Yellow perch | **Pixnio (verified Raver, CC0)** | https://pixnio.com/free-images/fauna-animals/fishes/yellow-perch-fish-perca-flavescens.jpg |

⚠️ **Do NOT use** Pixnio's "walleye" plate — it's actually a **sauger** (Stizostedion canadense), wrong
fish. Use the Commons Sander vitreus / FWS walleye.pdf plate.

Notes: smallmouth + yellow perch are verified-working from Pixnio (I loaded those pages). The Commons
ones are title-confirmed but were not live-loaded (sandbox blocks Commons) — Claude Code should confirm
each renders + is the illustration (not a photo) before optimizing. If any one species' Raver plate
can't be confirmed, a USFWS photo of that species (also PD) is an acceptable fallback — keep the set
visually consistent where possible. Record all placed fish images in FREE-IMAGES-VALLECITO.md.

## Person-fishing hero (replaces the creek photo on the fishing pagehero)
NO confirmed free photo of a person fishing AT Vallecito exists. Two acceptable routes:
1. **Best authentic:** scan Alan Levine / "cogdog" CC BY 2.0 Vallecito set
   (flickr.com/search/?text=vallecito%20reservoir&license=4%2C5%2C9%2C10) for a shore/bobber angler
   frame ≥1600px → credit "Photo: Alan Levine · CC BY 2.0" in #photo-credits. (He's already a credited
   source on the site — Three Relics.)
2. **Generic fallback (no attribution):** an Unsplash/Pexels "person fishing mountain lake" wide shot
   (≥1600px) — caption honestly, never implying it's Vallecito.
Pick #1 if a usable frame exists; else #2. Optimize as a hero (≤350 KB). Update the fishing pagehero
`--bg` from hero-los-pinos.jpg → the new hero; keep los-pinos available for an inline figure.
