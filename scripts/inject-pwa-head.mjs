// scripts/inject-pwa-head.mjs — run: node scripts/inject-pwa-head.mjs
// Adds the PWA <head> block + pwa.js to every public page, and sets viewport-fit=cover.
// Byte-safe: per-file EOL preserved (no lone-LF in CRLF files), NUL/</html> guarded.
// Idempotent: re-running refreshes the managed PWA:START..PWA:END block in place.
// No 'glob' dependency (this repo has none) — walks public/*.html with fs.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const BLOCK_LINES = [
  '  <!-- PWA:START (managed by inject-pwa-head.mjs) -->',
  '  <meta name="theme-color" content="#1d3b2f">',
  '  <meta name="mobile-web-app-capable" content="yes">',
  '  <meta name="apple-mobile-web-app-capable" content="yes">',
  '  <meta name="apple-mobile-web-app-status-bar-style" content="default">',
  '  <meta name="apple-mobile-web-app-title" content="GoVallecito">',
  '  <link rel="manifest" href="/manifest.webmanifest">',
  '  <link rel="apple-touch-icon" sizes="180x180" href="/assets/img/apple-touch-icon.png">',
  '  <!-- PWA:END -->',
];
const SCRIPT = '<script defer src="/assets/js/pwa.js"></script>';
const NUL = String.fromCharCode(0);

const dir = 'public';
// Skip offline.html — it's the self-contained SW fallback (no manifest/SW of its own).
const files = readdirSync(dir).filter((f) => f.endsWith('.html') && f !== 'offline.html');

let n = 0;
for (const f of files) {
  const fp = path.join(dir, f);
  let s = readFileSync(fp, 'utf8');
  const before = s;
  const eol = s.includes('\r\n') ? '\r\n' : '\n';
  const BLOCK = BLOCK_LINES.join(eol);

  // 1) viewport-fit=cover so env(safe-area-inset-*) works under notch / Dynamic Island
  s = s.replace(/<meta name="viewport"[^>]*>/,
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">');

  // 2) inject the head block once, after the first apple-touch-icon (or canonical)
  if (!s.includes('PWA:START')) {
    const anchor = s.match(/<link rel="apple-touch-icon"[^>]*>/) || s.match(/<link rel="canonical"[^>]*>/);
    if (anchor) s = s.replace(anchor[0], anchor[0] + eol + BLOCK);
  } else {
    s = s.replace(/ {2}<!-- PWA:START[\s\S]*?<!-- PWA:END -->/, BLOCK);
  }

  // 3) pwa.js before </body>, once
  if (!s.includes('/assets/js/pwa.js')) s = s.replace('</body>', '  ' + SCRIPT + eol + '</body>');

  if (s === before) continue;
  if (s.indexOf(NUL) !== -1) { console.error('ABORT NUL byte in', f); process.exit(1); }
  if (!/<\/html>\s*$/.test(s)) { console.error('ABORT missing </html> in', f); process.exit(1); }
  writeFileSync(fp, s);
  n++;
}
console.log(`PWA head/script injected into ${n} files`);
