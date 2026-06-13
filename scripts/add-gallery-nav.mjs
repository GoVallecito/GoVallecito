// Add "Gallery" to the Explore nav group on every page (after Lake Map), byte-safe,
// per-file EOL preserved. gallery.html already ships it (active) and is skipped, as is
// analytics.html (no nav). Idempotent: skips any page that already has the Gallery item.
import fs from "node:fs";
import path from "node:path";
const NUL = String.fromCharCode(0);
const DIR = "public";
const files = fs.readdirSync(DIR).filter(f => f.endsWith(".html") && f !== "gallery.html");

const report = [];
for (const f of files) {
  const fp = path.join(DIR, f);
  let s = fs.readFileSync(fp, "utf8");
  if (!/<nav class="main"/.test(s)) { continue; }            // analytics.html etc.
  if (/href="gallery\.html" role="menuitem"/.test(s)) { report.push(f.padEnd(34) + " already-has"); continue; }
  const eol = s.includes("\r\n") ? "\r\n" : "\n";
  // Match the Lake Map menuitem line (active or not) and append a Gallery item after it.
  const re = /(\n[ \t]*<a href="map\.html" role="menuitem"[^>]*>Lake Map<\/a>)/;
  const m = s.match(re);
  if (!m) { report.push(f.padEnd(34) + " MAP-ANCHOR-MISS!"); continue; }
  const galleryLine = eol + "          <a href=\"gallery.html\" role=\"menuitem\">Gallery</a>";
  s = s.replace(m[1], m[1].replace(/\r?\n/, eol) + galleryLine);
  if (s.indexOf(NUL) !== -1) { console.error("ABORT NUL", f); process.exit(1); }
  if (!/<\/html>\s*$/.test(s)) { console.error("ABORT no </html>", f); process.exit(1); }
  fs.writeFileSync(fp, s, "utf8");
  report.push(f.padEnd(34) + " +Gallery");
}
console.log(report.join("\n"));
console.log("Added: " + report.filter(r=>r.endsWith("+Gallery")).length);
