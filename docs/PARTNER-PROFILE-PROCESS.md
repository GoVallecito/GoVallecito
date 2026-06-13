# Preferred-Partner Profile Process (repeatable)

When a business is added to `directory.json` with **`tier: "featured"`** (a preferred/paid partner), it
gets its own dedicated profile page. This is the standing process — follow it for every new featured
partner, not just the first batch.

## Trigger
A directory entry has `tier: "featured"` AND `unpublished` is not true. (Julie Coffelt is the ONE
exception — she already has the bespoke `real-estate-partner.html`; don't regenerate hers.)

## Steps
1. **Deep-dive research** the business from ITS OWN web presence first (official site = source of truth;
   aggregators only to cross-check). Capture: story/history, owners, full offerings + published prices,
   hours/season, booking/contact channels, distinctive positioning (their own words), practical visitor
   know-how, and 2–3 images from their own site (courtesy basis — they're a paid partner).
   **Rules:** NO invented facts, NO review scores/ratings, NO scraping personal Facebook profiles. Mark
   every fact with a source; list what you could NOT verify so the page omits it. (Use a subagent per
   1–2 businesses for breadth.)
2. **Write the facts** into `docs/PARTNER-PROFILES-RESEARCH.md` (one section per business + source URLs +
   "could not verify" list). This is the rights/accuracy record.
3. **Build the page** `partner-<slug>.html` from a shared template (below), tailored by category:
   - Lodging/RV → rooms/sites, hookups, amenities, rates, booking.
   - Marina/recreation → fleet/rentals + prices, slips/season, what's included.
   - Dining/market → what they sell/serve, hours, the "one-stop" or specialty angle.
   - Services (e.g. fire mitigation) → services list, credentials/insurance, free-assessment CTA, why
     it matters locally.
   - Community (church/nonprofit) → who they are, history, service times, how to connect (NO sales framing).
4. **Image:** download 1–3 partner-owned images → optimize (hero ≤350 KB, inline ≤150 KB) →
   `public/assets/img/featured/`. Record in FREE-IMAGES doc's rights table with the courtesy basis.
5. **Link it up:** the directory featured card's `profile` field → `partner-<slug>.html`; CTA "Full
   profile →". Add the page to sitemap (re-run `gen-sitemap`), canonical/OG/breadcrumb per Round-21
   patterns, and a LocalBusiness JSON-LD block (re-run `gen-schema` if it's wired to directory.json).
6. **Honesty guardrails on the page:** featured-partner pages are clearly the partner's own promo — but
   every FACT must be verifiable. Mark the page as a partner profile (kicker "Featured partner"), keep
   the site's editorial line (we don't invent facts; partners pay for a richer listing, never for
   altered conditions data — consistent with sources.html#editorial-policy).
7. **Flag for David** anything the partner should supply/confirm (better photos, unverified claims).

## Shared page template (sections, adapt per category)
- Pagehero: business name + one-line positioning (their words) + a category kicker "Featured partner."
- Hero/lead image (partner-owned).
- "The short version" — 2–3 sentence intro.
- "Best features" — 3 highlight cards (the strongest, verifiable selling points).
- Category-specific detail section(s) — fleet/rooms/menu/services with prices where published.
- "Good to know" — hours/season, policies, what to bring, practical caveats.
- Contact/booking block — phone (tel:), email (mailto:), website, booking link, social, address +
  map link; two-hop back to the directory entry.
- Footer credit: image courtesy of the business; link to How We Verify.
- **SEO:** `<title>` ≤62 chars, `meta description` ≤160 chars — verify before shipping.

## Notes
- Keep it template-driven so the Nth partner page is fast and consistent.
- This process doc + `PARTNER-PROFILES-RESEARCH.md` are the memory; a new session re-reads them.
