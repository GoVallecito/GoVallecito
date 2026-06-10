# Review Updates — Round 35: Junk Genies featured partner (for Claude Code)

New PAID featured partner (David, June 2026). Build per the standing process
(`docs/PARTNER-PROFILE-PROCESS.md`): directory entry (featured) + enhanced card/button + dedicated
`partner-junk-genies.html`. Deploy Pages + push. Goal: a high-quality, professional page that highlights
their hard work, initiative, and willingness to go the extra mile — all from verified facts (their own
FB/info), no invented ratings/reviews.

## Source material (David-supplied — connected "Junk Genies" desktop folder)
Folder: `C:\Users\dkont\Desktop\Junk Genies\` (VM: `/sessions/peaceful-exciting-knuth/mnt/Junk Genies/`).
- `Junk Genie Info.txt` — the business tagline + ~12 recent FB post texts (the content source).
- Images (their own — courtesy basis, they're a paying partner): `junk genie trailer.jpg` (branded
  logo trailer — **the hero/lead**), `before after.jpg` (property-cleanout before/after), `1.jpg`,
  `605116340_…n.jpg`, `605802466_…n.jpg`, `716842563_…n.jpg` (job/demolition/cleanup shots).
  **Claude Code: view each, pick the trailer as hero + 3–4 of the clearest SW-Colorado work shots for a
  gallery.** Optimize → `public/assets/img/featured/junk-genies-*.jpg` (hero ≤350 KB, inline ≤150 KB,
  EXIF stripped); originals stay in the desktop folder (don't copy originals into the repo). Record in
  FREE-IMAGES rights doc as "courtesy of Junk Genies (paid partner)."

## Verified facts (from their info file)
- **Name:** Junk Genies. Family-run. **Phone (call or text): 505-870-7792.** Free estimates.
- **Facebook:** https://www.facebook.com/profile.php?id=61585702680288 (their only web presence so far —
  no website yet; FB is the booking/contact channel).
- **Service area:** Bayfield, Durango, Hesperus, Pagosa Springs, Cortez & surrounding — "Southwest
  Colorado & Northwest New Mexico." Based in the Bayfield/Vallecito area (no street address given).
- **Services (verified from posts):** junk removal & haul-offs; **demolition** (structures, carriage
  houses, collapsing buildings — "demolished, loaded out, cleaned up, and graded in ONE day");
  property & estate clean-outs; construction/remodel debris removal; heavy debris removal; land &
  **wildfire fuel-load cleanup** (reducing fuel load, downed branches, ahead of fire season); light
  landscaping (e.g., soil aeration + planting); move-outs. **Now adding dumpster rentals & delivery**
  (trailer + dumpsters on order — frame as "coming soon / now booking").
- **Distinctive (their own words, quotable):** "Junk Genies specializes in the projects most people
  won't touch." "When the job gets bigger, we bring bigger equipment" (dump truck, trailers, mini
  excavator). Tight access, overhead lines, years of buildup — "the crew showed up ready to WORK."

## Page build — `partner-junk-genies.html`
Shared partner template, kicker **"★ Featured partner · Local services"**:
- **Hero/lead:** the branded trailer image; one-line positioning in their words ("Making messes
  disappear" / "the projects most people won't touch").
- **The short version:** family-run SW-Colorado junk removal, demolition & property cleanup serving the
  Vallecito/Bayfield/Durango area — fast quotes, reliable scheduling, free estimates.
- **Best features (the 3 highlights David asked for — hard work / initiative / extra mile):**
  1. **They take the jobs others won't** — collapsing structures, tight access, overhead lines, heavy
     debris; full demo + haul + grade in a single day.
  2. **A local family building something** — owner-operated, hiring family, "you're supporting a local
     family, not a big corporation."
  3. **Full-service & growing** — junk removal → demolition → land/property cleanup → now dumpster
     rentals; the right equipment for any size job (dump truck, trailers, mini excavator).
- **What they do:** the services list above (mark dumpster rentals "coming soon").
- **Good neighbors (the extra-mile tie-ins — these connect to our own pages):** wildfire fuel-load
  reduction → cross-link `respect-vallecito.html` / firewise; the bear-smart "secure your dumpster,
  extra pickups available" angle → cross-link `wildlife.html`. Keep factual, their own initiative.
- **Before/after:** a small gallery (the before/after + 2–3 work shots) with honest captions ("a SW
  Colorado property cleanup," not specific addresses).
- **Contact block:** big **📞 505-870-7792 (call or text)**, Facebook link, service-area line, "free
  estimate" CTA, two-hop back to `directory.html#biz-junk-genies`.
- Standard nav header + condbar (RFW banner works) + footer; canonical/OG/breadcrumb; LocalBusiness
  JSON-LD; add to sitemap (re-run gen-sitemap).

## Directory wiring (`public/data/directory.json`)
- New entry: `slug: "junk-genies"`, `category: "Local Services"`, `tier: "featured"`,
  `badge: "GoVallecito Partner"`, `profile: "partner-junk-genies.html"`, blurb (family-run junk
  removal, demolition & property cleanup; the jobs most won't touch; SW Colorado), `phone:
  "(505) 870-7792"`, `facebook` URL, `image` (the optimized trailer or a work shot, `imageFit:"cover"`),
  `cta: { label: "Free estimate → call/text", href: "tel:+15058707792" }`. No website field (none yet).
- Pins to top of Local Services alongside Coronado (two featured). Re-run `scripts/gen-schema.mjs`
  (markers in directory.html) — node count goes up by one; verify it parses.

## Honesty guardrails (binding)
- No invented ratings/reviews. A real customer thank-you appears in their posts (Katelyn) — do NOT
  publish a customer's name or a star rating; speak to their work via their own verified words and the
  before/after evidence.
- "Coming soon" for dumpster rentals (on order, not yet delivered) — don't state it as live.
- Images are the partner's own, used on a courtesy/partner basis — credit "courtesy of Junk Genies" in
  #photo-credits; no CC license claim.

## After applying
Deploy + push. Verify: partner-junk-genies.html live + in sitemap + breadcrumb/OG; directory shows Junk
Genies as a featured Local Services card with the call/text CTA and "Full profile →"; images optimized +
credited; cross-links to firewise/wildlife resolve; gen-schema re-run (parses); no broken images/anchors;
mobile OK. Report which photos were used as hero vs gallery.
