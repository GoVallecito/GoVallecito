// Generate public/sitemap.xml from public/**/*.html (excludes 404.html).
// Canonical clean URLs on https://govallecito.com (correct pre-cutover too).
// lastmod from git commit date per file. Run from repo root: node scripts/gen-sitemap.mjs
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';

const BASE = 'https://govallecito.com';
const ROOT = new URL('../public/', import.meta.url);

async function* walk(dir, rel = '') {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const r = rel + e.name;
    if (e.isDirectory()) yield* walk(new URL(e.name + '/', dir), r + '/');
    else if (e.name.endsWith('.html') && e.name !== '404.html') yield r;
  }
}

function cleanUrl(rel) {
  if (rel === 'index.html') return '/';
  return '/' + rel.replace(/\.html$/, '');
}
function lastmod(rel) {
  try {
    const d = execSync(`git log -1 --format=%cs -- "public/${rel}"`, { encoding: 'utf8' }).trim();
    return d || null;
  } catch { return null; }
}

const files = [];
for await (const r of walk(ROOT)) files.push(r);
files.sort();

// home first, then the rest
files.sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b)));

const urls = files.map(r => {
  const loc = BASE + cleanUrl(r);
  const lm = lastmod(r);
  const pri = r === 'index.html' ? '1.0' : '0.7';
  return `  <url>\n    <loc>${loc}</loc>\n${lm ? `    <lastmod>${lm}</lastmod>\n` : ''}    <priority>${pri}</priority>\n  </url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
await writeFile(new URL('sitemap.xml', ROOT), xml);
console.log(`sitemap.xml: ${files.length} urls`);
