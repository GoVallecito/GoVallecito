// Round 37 A4 (+A7 fishing): trim over-length meta descriptions to one tight
// ≤160-char sentence, and unify og:description / twitter:description to match.
// Byte-safe single-line meta swaps; NUL/</html> guarded. partner-jeree-mead.html
// intentionally excluded (held off-main; left as-is).
import fs from "node:fs";
import path from "node:path";
const NUL = String.fromCharCode(0);

const DESC = {
  "about.html": "An independently owned community hub for Vallecito Lake, Colorado — live conditions, local businesses, and what to do high in the San Juans.",
  "conditions.html": "Live Vallecito Lake conditions: marina weather, 5-day forecast, NWS alerts, nearby wildfires, lake level, streamflow, and road status.",
  "contact.html": "Contact GoVallecito.com — corrections, business listings, and questions about Vallecito Lake, Colorado. We read everything.",
  "directory.html": "Local business directory for Vallecito Lake: lodging, dining, the marina, guides, retail, and real estate — featured partners and verified locals.",
  "index.html": "The independent guide to Vallecito Lake — live conditions, recreation, businesses, and community info in one place, updated every 15 minutes.",
  "launch-your-boat.html": "A first-timer's guide to launching at Vallecito Lake: registration, ANS stamp, mandatory inspection, PRID ramp permits and hours, and a launch-day checklist.",
  "living-in-vallecito.html": "What it's like to live at Vallecito Lake year-round: winter access, internet &amp; cell, Firewise living, buying property, and local utilities &amp; services.",
  "partner-coronado.html": "Wildfire mitigation, defensible space, hazard-tree care near Vallecito and Bayfield. Women- and minority-owned, insured, certified sawyers; free assessments.",
  "partner-junk-genies.html": "Family-run junk removal, demolition and property cleanup serving Bayfield, Vallecito, Durango &amp; SW Colorado. The jobs most won't touch. Free estimates.",
  "partner-rubber-duck-cleaning.html": "Licensed &amp; insured cleaning for Vallecito, Bayfield, Durango &amp; Ignacio: deep cleans, move-in/out, RVs, rentals, new-construction &amp; commercial. Free estimates.",
  "partner-vallecito-marina.html": "The only marina on Vallecito Lake — pontoon and fishing-boat rentals, kayaks and SUPs, slips, buoy service, fuel, and a store. Community-operated.",
  "partner-vr-solutions.html": "Owner-run construction &amp; remodeling near Vallecito &amp; Bayfield: whole-home &amp; flood remodels, baths, decks, steel buildings, excavation, welding. Free estimates.",
  "fishing.html": "The complete Vallecito Lake (Vallecito Reservoir) fishing guide: weekly report, seven species, a month-by-month calendar, access, permits, CPW regs, and guides.",
};

function rlen(s){return s.replace(/&amp;/g,"&").replace(/&#39;/g,"'").replace(/&quot;/g,'"').length;}
const report=[];
for (const [f,txt] of Object.entries(DESC)) {
  const fp = path.join("public", f);
  let s = fs.readFileSync(fp, "utf8");
  const before = s;
  const tags = ["description","og:description","twitter:description"];
  const hit=[];
  for (const t of tags) {
    const attr = t.startsWith("og:") ? "property" : "name";
    const re = new RegExp(`(<meta ${attr}="${t}" content=")[^"]*(">)`);
    if (re.test(s)) { s = s.replace(re, `$1${txt}$2`); hit.push(t); }
  }
  if (s !== before) {
    if (s.indexOf(NUL) !== -1) { console.error("ABORT NUL in", f); process.exit(1); }
    if (!/<\/html>\s*$/.test(s)) { console.error("ABORT no </html> in", f); process.exit(1); }
    fs.writeFileSync(fp, s, "utf8");
    report.push(f.padEnd(34)+" len="+rlen(txt)+"  ["+hit.join(", ")+"]");
  } else report.push(f.padEnd(34)+" NO-MATCH!");
}
console.log(report.join("\n"));
