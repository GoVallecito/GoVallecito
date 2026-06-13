// Round 38 Tier 1.3: add anchor ids to section h2s + a sticky .jumpnav on
// wildlife / respect-vallecito / launch-your-boat. Byte-safe, per-file EOL, idempotent.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
const NUL = String.fromCharCode(0);

const PAGES = {
  'wildlife.html': {
    h2: [
      ['Three things worth knowing', 'why'],
      ['Who you might see', 'species'],
      ['One habit per neighbor', 'habits'],
      ['Hosts: set your guests up to be bear smart', 'hosts'],
    ],
    chips: [['why','Why it matters'],['species',"Who you'll see"],['habits','One habit each'],['hosts','For hosts']],
  },
  'respect-vallecito.html': {
    h2: [
      ['A pretty extraordinary corner of Colorado', 'why'],
      ['A handful of shared standards', 'standards'],
      ['This valley has come back before', 'resilience'],
    ],
    chips: [['why',"Why it's special"],['standards','Shared standards'],['resilience','Resilience']],
  },
  'launch-your-boat.html': {
    h2: [
      ['The 60-second version', 'tldr'],
      ['The paperwork', 'paperwork'],
      ['The inspection — what to expect', 'inspection'],
      ['Step by step at the ramp', 'ramp'],
      ["What's different up here", 'altitude'],
      ['Rules &amp; courtesy', 'rules'],
      ['From people who launch here', 'locals'],
    ],
    chips: [['tldr','Quick version'],['paperwork','Paperwork'],['inspection','Inspection'],['ramp','At the ramp'],['altitude',"What's different"],['rules','Rules'],['locals','Local tips']],
  },
};

let report = [];
for (const [f, cfg] of Object.entries(PAGES)) {
  const fp = path.join('public', f);
  let s = readFileSync(fp, 'utf8');
  const before = s;
  const eol = s.includes('\r\n') ? '\r\n' : '\n';
  // 1) add anchor-offset + id to each named h2 (skip if already done)
  for (const [text, id] of cfg.h2) {
    const oldTag = `<h2 class="sec-title">${text}`;
    const newTag = `<h2 class="sec-title anchor-offset" id="${id}">${text}`;
    if (s.includes(oldTag)) s = s.replace(oldTag, newTag);
    else if (!s.includes(`id="${id}"`)) report.push(`${f}: H2-MISS "${text}"`);
  }
  // 2) insert the jumpnav after the pagehero (first </section>) once
  if (!/class="jumpnav"/.test(s)) {
    const chips = cfg.chips.map(([id, label]) => `    <a href="#${id}">${label}</a>`).join(eol);
    const nav = ['', '<nav class="jumpnav" aria-label="On this page">', '  <div class="wrap">', chips, '  </div>', '</nav>', ''].join(eol);
    s = s.replace('</section>', '</section>' + eol + nav);
  }
  if (s === before) { report.push(`${f}: no change`); continue; }
  if (s.indexOf(NUL) !== -1) { console.error('ABORT NUL', f); process.exit(1); }
  if (!/<\/html>\s*$/.test(s)) { console.error('ABORT no </html>', f); process.exit(1); }
  writeFileSync(fp, s);
  report.push(`${f}: ids+jumpnav OK`);
}
console.log(report.join('\n'));
