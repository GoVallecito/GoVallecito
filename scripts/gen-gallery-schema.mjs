// Round 40 §5a: generate an ImageGallery + ImageObject JSON-LD for gallery.html
// from the page's own <figure> markup (visible images only — site convention).
// Credits are NOT invented: each ImageObject's `caption` is the figure's data-cap
// copied verbatim (it already contains the author + license). Writes the block
// between <!-- GALLERY-SCHEMA:START/END --> markers in <head> (mirrors gen-schema.mjs).
// Run from repo root: node scripts/gen-gallery-schema.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = 'public/gallery.html';
const ORIGIN = 'https://govallecito.com';
let s = readFileSync(FILE, 'utf8');
const eol = s.includes('\r\n') ? '\r\n' : '\n';

function dec(x){ return String(x||'')
  .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&'); }

const re = /<img class="zoomable"[^>]*?src="([^"]+)"[^>]*?alt="([^"]*)"[^>]*?data-cap="([^"]*)"/g;
const images = [];
let m;
while ((m = re.exec(s))) {
  const src = m[1];
  images.push({
    '@type': 'ImageObject',
    contentUrl: src.startsWith('http') ? src : ORIGIN + src,
    name: dec(m[2]),
    caption: dec(m[3]),
  });
}
if (!images.length) { console.error('No zoomable figures found — aborting.'); process.exit(1); }

const obj = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: 'Vallecito in Pictures',
  url: ORIGIN + '/gallery',
  image: images,
};
const block =
  '<!-- GALLERY-SCHEMA:START (managed by scripts/gen-gallery-schema.mjs) -->' + eol +
  '<script type="application/ld+json">' + eol +
  JSON.stringify(obj) + eol +
  '</script>' + eol +
  '<!-- GALLERY-SCHEMA:END -->';

if (/<!-- GALLERY-SCHEMA:START[\s\S]*?GALLERY-SCHEMA:END -->/.test(s)) {
  s = s.replace(/<!-- GALLERY-SCHEMA:START[\s\S]*?GALLERY-SCHEMA:END -->/, block);
} else {
  // insert just before </head> (indented like surrounding head content)
  s = s.replace('</head>', block + eol + '</head>');
}
if (s.indexOf(String.fromCharCode(0)) !== -1) { console.error('NUL'); process.exit(1); }
if (!/<\/html>\s*$/.test(s)) { console.error('no </html>'); process.exit(1); }
writeFileSync(FILE, s);
console.log('gallery schema: ' + images.length + ' ImageObject(s) written');
