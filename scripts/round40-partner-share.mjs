// Round 40 §4b: add a "🔗 Share" button to each partner-*.html pagehero.
// Uses each page's own canonical URL + og:title (minus the " | GoVallecito" suffix).
// Byte-safe, per-file EOL, idempotent (skips if a share button already present).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
const NUL = String.fromCharCode(0);

const files = readdirSync('public').filter(f => /^partner-.*\.html$/.test(f));
const report = [];
for (const f of files) {
  const fp = path.join('public', f);
  let s = readFileSync(fp, 'utf8');
  if (s.includes('data-share-url')) { report.push(`${f}: already has share`); continue; }
  const eol = s.includes('\r\n') ? '\r\n' : '\n';
  const canon = (s.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  let title = (s.match(/<meta property="og:title" content="([^"]+)"/) || [])[1] || document_title(s);
  if (!canon) { report.push(`${f}: NO canonical — skipped`); continue; }
  title = title.replace(/\s*\|\s*GoVallecito.*$/, '');   // drop site suffix for the share title
  const btn = `    <p style="margin-top:14px"><button class="btn btn-share" data-share-url="${canon}" data-share-title="${title}" data-share-text="A Vallecito Lake featured partner:">🔗 Share</button></p>`;
  // insert as the last child of the pagehero .wrap (after the hero paragraph)
  const re = /(<section id="main" class="pagehero"[\s\S]*?)(\r?\n  <\/div>\r?\n<\/section>)/;
  if (!re.test(s)) { report.push(`${f}: pagehero anchor MISS`); continue; }
  s = s.replace(re, (m, a, b) => a + eol + btn + b);
  if (s.indexOf(NUL) !== -1) { console.error('ABORT NUL', f); process.exit(1); }
  if (!/<\/html>\s*$/.test(s)) { console.error('ABORT no </html>', f); process.exit(1); }
  writeFileSync(fp, s);
  report.push(`${f}: +share (${title})`);
}
function document_title(s){ return (s.match(/<title>([^<]*)<\/title>/) || [])[1] || 'GoVallecito'; }
console.log(report.join('\n'));
