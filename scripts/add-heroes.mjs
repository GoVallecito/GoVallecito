// Images Round B, Task 2: give each plain/broken/generic pagehero a fitting Vallecito
// --bg. Sets style="--bg:url('...')" on the <section class="pagehero"> tag (the
// .pagehero CSS already keeps a solid var(--pine) base, so text stays readable).
// Byte-safe single-line tag edit; NUL/</html> guarded.
import fs from "node:fs";
import path from "node:path";
const NUL = String.fromCharCode(0);

const MAP = {
  // plain pageheros (no --bg) → reuse existing art
  "about.html": "/assets/img/hero-lake-panorama.jpg",
  "buying-property.html": "/assets/img/lake-aerial.jpg",
  "contact.html": "/assets/img/hero-shoreline.jpg",
  "firewise-living.html": "/assets/img/gallery/wild-weminuche-hills.jpg",
  "internet-cell.html": "/assets/img/hero-lake-panorama.jpg",
  "launch-your-boat.html": "/assets/img/hero-shoreline.jpg",
  "living-here-year-round.html": "/assets/img/hero-community.jpg",
  "map.html": "/assets/img/lake-aerial.jpg",
  "real-estate-partner.html": "/assets/img/hero-community.jpg",
  "sources.html": "/assets/img/hero-dam.jpg",
  "utilities-services.html": "/assets/img/hero-shoreline.jpg",
  "winter-access.html": "/assets/img/hero-winter.jpg",            // fetched (real winter gap)
  // broken --bg (town.jpg / lake.jpg don't exist) → fix
  "directory.html": "/assets/img/hero-community.jpg",
  "plan-your-visit.html": "/assets/img/hero-lake-panorama.jpg",
  // generic hero-shoreline re-uses → upgrade to fitting images
  "wildlife.html": "/assets/img/gallery/wild-elk.jpg",
  "middle-mountain.html": "/assets/img/hero-forest-road.jpg",     // fetched
};

const report = [];
for (const [f, bg] of Object.entries(MAP)) {
  const fp = path.join("public", f);
  let s = fs.readFileSync(fp, "utf8");
  const before = s;
  // match the pagehero opening tag; rebuild with the new --bg (drops any old style)
  const re = /(<section\b[^>]*\bclass="pagehero")[^>]*>/;
  const m = s.match(re);
  if (!m) { report.push(f.padEnd(30) + " PAGEHERO-MISS!"); continue; }
  const rebuilt = `${m[1]} style="--bg:url('${bg}')">`;
  s = s.replace(m[0], rebuilt);
  if (s === before) { report.push(f.padEnd(30) + " no-change (already set)"); continue; }
  if (s.indexOf(NUL) !== -1) { console.error("ABORT NUL", f); process.exit(1); }
  if (!/<\/html>\s*$/.test(s)) { console.error("ABORT no </html>", f); process.exit(1); }
  fs.writeFileSync(fp, s, "utf8");
  report.push(f.padEnd(30) + " --bg=" + bg);
}
console.log(report.join("\n"));
