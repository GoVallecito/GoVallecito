// Generate inline LocalBusiness JSON-LD for directory.html from data/directory.json.
// Re-run after editing directory.json:  node scripts/gen-schema.mjs
// Includes only PUBLISHED businesses with a name and a phone or address (verifiable).
// Julie Coffelt -> RealEstateAgent; everyone else -> LocalBusiness. No ratings/reviews.
import { readFile, writeFile } from 'node:fs/promises';

const ROOT = new URL('../public/', import.meta.url);
const dir = JSON.parse(await readFile(new URL('data/directory.json', ROOT), 'utf8'));

function phoneOf(b) { return b.phone || (Array.isArray(b.phones) && b.phones[0] && b.phones[0].number) || null; }

const nodes = dir.businesses.filter(b => !b.unpublished && b.name && (phoneOf(b) || b.address)).map(b => {
  const o = { '@type': b.slug === 'julie-coffelt' ? 'RealEstateAgent' : 'LocalBusiness',
    '@id': `https://govallecito.com/directory#${b.slug}`, name: b.name };
  const ph = phoneOf(b); if (ph) o.telephone = ph;
  if (b.website) o.url = b.website;
  if (b.email) o.email = b.email;
  if (b.address) o.address = { '@type': 'PostalAddress', streetAddress: b.address.replace(/, Bayfield.*$/i, ''),
    addressLocality: 'Bayfield', addressRegion: 'CO', postalCode: '81122' };
  o.areaServed = 'Vallecito Lake, Colorado';
  return o;
});

const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }, null, 0);
const block =
`<!-- LD-LOCALBUSINESS:START (generated from data/directory.json by scripts/gen-schema.mjs — re-run after editing directory.json) -->
<script type="application/ld+json">
${json}
</script>
<!-- LD-LOCALBUSINESS:END -->`;

const file = new URL('directory.html', ROOT);
let html = await readFile(file, 'utf8');
html = html.replace(/<!-- LD-LOCALBUSINESS:START[\s\S]*?LD-LOCALBUSINESS:END -->/, block);
await writeFile(file, html);
console.log(`gen-schema: ${nodes.length} LocalBusiness nodes (incl. ${nodes.filter(n=>n['@type']==='RealEstateAgent').length} RealEstateAgent) injected into directory.html`);
