// Round 37 deterministic sweep: header nav (B1–B3), footer Explore column (B6),
// title-suffix standardization + A4/A6 title rewrites, and the two A6 og:titles.
// Byte-safe: per-file EOL preserved, exact-string title swaps, NUL/</html> checked.
// Idempotent-ish (re-running on already-swept files is a no-op for nav/footer; titles
// only swap when the exact OLD string is present).
import fs from "node:fs";
import path from "node:path";

const DIR = "public";
const files = fs.readdirSync(DIR).filter(f => f.endsWith(".html")).sort();
const NUL = String.fromCharCode(0);

// --- canonical header nav (B1: Launch→Plan; Explore=5; B2: Living→Local Guide;
//     B3: "Business Directory"). Active markers applied per page. ---
const NAV_OPEN = `<nav class="main" id="primaryNav" aria-label="Primary">`;
const ACT = ` class="active" aria-current="page"`;
// group membership of each active href (for the navgroup is-active flag)
const GROUP = {
  explore: ["things-to-do.html","fishing.html","trails.html","middle-mountain.html","map.html"],
  local:   ["directory.html","real-estate-partner.html","living-in-vallecito.html"],
  plan:    ["first-visit.html","launch-your-boat.html","respect-vallecito.html","wildlife.html","plan-your-visit.html"],
  about:   ["about.html","sources.html","contact.html"],
};
function buildNav(activeHref) {
  const a = href => (href === activeHref ? ACT : "");
  const g = key => (GROUP[key].includes(activeHref) ? " is-active" : "");
  const item = (href, label) => `          <a href="${href}" role="menuitem"${a(href)}>${label}</a>`;
  return [
    NAV_OPEN,
    `      <a href="conditions.html"${activeHref==="conditions.html"?ACT:""}>Conditions</a>`,
    `      <div class="navgroup${g("explore")}">`,
    `        <button type="button" class="navgroup-btn" aria-expanded="false" aria-haspopup="true">Explore<span class="caret" aria-hidden="true">▾</span></button>`,
    `        <div class="navmenu" role="menu">`,
    item("things-to-do.html","Things To Do"),
    item("fishing.html","Fishing"),
    item("trails.html","Trails"),
    item("middle-mountain.html","Middle Mountain"),
    item("map.html","Lake Map"),
    `        </div>`,
    `      </div>`,
    `      <div class="navgroup${g("local")}">`,
    `        <button type="button" class="navgroup-btn" aria-expanded="false" aria-haspopup="true">Local Guide<span class="caret" aria-hidden="true">▾</span></button>`,
    `        <div class="navmenu" role="menu">`,
    item("directory.html","Business Directory"),
    item("real-estate-partner.html","Real Estate"),
    item("living-in-vallecito.html","Living Here"),
    `        </div>`,
    `      </div>`,
    `      <div class="navgroup${g("plan")}">`,
    `        <button type="button" class="navgroup-btn" aria-expanded="false" aria-haspopup="true">Plan Your Visit<span class="caret" aria-hidden="true">▾</span></button>`,
    `        <div class="navmenu" role="menu">`,
    item("first-visit.html","First Visit"),
    item("launch-your-boat.html","Launch Your Boat"),
    item("respect-vallecito.html","Respect Vallecito"),
    item("wildlife.html","Wildlife"),
    item("plan-your-visit.html","Getting Here"),
    `        </div>`,
    `      </div>`,
    `      <div class="navgroup${g("about")}">`,
    `        <button type="button" class="navgroup-btn" aria-expanded="false" aria-haspopup="true">About<span class="caret" aria-hidden="true">▾</span></button>`,
    `        <div class="navmenu" role="menu">`,
    item("about.html","About"),
    item("sources.html","How We Verify"),
    item("contact.html","Contact"),
    `        </div>`,
    `      </div>`,
    `    </nav>`,
  ];
}

// --- canonical footer Explore column (B6: + Trails + Wildlife; Lake Map kept so
//     the 3 outlier footers don't lose a link; everything else from the 31-page
//     majority variant). Match runs <h3>Explore</h3> … </p>. ---
const FOOTER = [
  `<h3>Explore</h3>`,
  `      <p class="linklist">`,
  `        <a href="conditions.html#contacts">🚨 Emergency &amp; lake contacts</a><a href="conditions.html">Conditions</a><a href="things-to-do.html">Things To Do</a>`,
  `        <a href="fishing.html">Fishing</a><a href="trails.html">Trails</a><a href="map.html">Lake Map</a><a href="directory.html">Local Guide</a><a href="real-estate-partner.html">Real Estate</a>`,
  `        <a href="plan-your-visit.html">Plan Your Visit</a><a href="wildlife.html">Wildlife</a><a href="living-in-vallecito.html">Living Here</a>`,
  `        <a href="about.html">About</a><a href="contact.html">Contact</a>`,
  `        <a href="sources.html">How we verify</a><a href="sources.html#corrections">Corrections</a><a href="sources.html#photo-credits">Photo credits</a>`,
  `      </p>`,
];

// --- A4/A5/A6 title rewrites: exact current inner → new inner (byte-exact swap). ---
const TITLES = {
  "404.html": ["Page not found — GoVallecito.com", "Page not found | GoVallecito"],
  "about.html": ["About — GoVallecito.com | Vallecito Lake, Colorado", "About — Vallecito Lake, Colorado | GoVallecito"],
  "buying-property.html": ["Buying Property Near the Lake — Living in Vallecito | GoVallecito.com", "Buying Property at Vallecito Lake | GoVallecito"],
  "contact.html": ["Contact — GoVallecito.com | Vallecito Lake, Colorado", "Contact — Vallecito Lake, Colorado | GoVallecito"],
  "firewise-living.html": ["Firewise Living — Living in Vallecito | GoVallecito.com", "Firewise Living — Living in Vallecito | GoVallecito"],
  "internet-cell.html": ["Internet & Cell Coverage — Living in Vallecito | GoVallecito.com", "Internet & Cell Coverage — Living in Vallecito | GoVallecito"],
  "launch-your-boat.html": ["Launching Your Boat at Vallecito Lake — a first-timer's guide | GoVallecito", "Launching Your Boat at Vallecito Lake | GoVallecito"],
  "living-here-year-round.html": ["Living Here Year-Round — Living in Vallecito | GoVallecito.com", "Year-Round Life at Vallecito — Seasons, Snow &amp; Daily Rhythms | GoVallecito"],
  "living-in-vallecito.html": ["Living in Vallecito — Year-Round at the Lake | GoVallecito.com", "Living in Vallecito, CO — Guides to Life at the Lake | GoVallecito"],
  "partner-junk-genies.html": ["Junk Genies — junk removal, demolition &amp; property cleanup | GoVallecito", "Junk Genies — junk removal &amp; cleanup | GoVallecito"],
  "partner-rubber-duck-cleaning.html": ["Rubber Duck Cleaning — homes, rentals, RVs &amp; offices | GoVallecito", "Rubber Duck Cleaning — Vallecito &amp; Bayfield | GoVallecito"],
  "partner-vr-solutions.html": ["VR Solutions — construction, remodels &amp; decks, Bayfield &amp; Vallecito | GoVallecito", "VR Solutions — construction &amp; remodeling | GoVallecito"],
  "sources.html": ["How We Verify / Our Sources — GoVallecito.com", "How We Verify / Our Sources | GoVallecito"],
  "utilities-services.html": ["Local Utilities & Services — Living in Vallecito | GoVallecito.com", "Local Utilities & Services — Living in Vallecito | GoVallecito"],
  "winter-access.html": ["Winter &amp; Access — Living in Vallecito | GoVallecito.com", "Winter &amp; Access — Living in Vallecito | GoVallecito"],
};
// A6: og:title must match the new <title> on the two Living pages.
const OGTITLE = {
  "living-in-vallecito.html": "Living in Vallecito, CO — Guides to Life at the Lake | GoVallecito",
  "living-here-year-round.html": "Year-Round Life at Vallecito — Seasons, Snow &amp; Daily Rhythms | GoVallecito",
};

const report = [];
for (const f of files) {
  const fp = path.join(DIR, f);
  let s = fs.readFileSync(fp, "utf8");
  const before = s;
  const changes = [];

  // 1) header nav
  const navM = s.match(/<nav class="main"[\s\S]*?<\/nav>/);
  if (navM) {
    const eol = navM[0].includes("\r\n") ? "\r\n" : "\n";
    const am = navM[0].match(/<a href="([^"]+)"[^>]*class="active" aria-current="page"/);
    const activeHref = am ? am[1] : null;
    const newNav = buildNav(activeHref).join(eol);
    if (newNav !== navM[0]) { s = s.replace(navM[0], newNav); changes.push("nav(active="+(activeHref||"none")+")"); }
  }

  // 2) footer Explore column
  const ftM = s.match(/<h3>Explore<\/h3>[\s\S]*?<\/p>/);
  if (ftM) {
    const eol = ftM[0].includes("\r\n") ? "\r\n" : "\n";
    const newFt = FOOTER.join(eol);
    if (newFt !== ftM[0]) { s = s.replace(ftM[0], newFt); changes.push("footer"); }
  }

  // 3) title
  if (TITLES[f]) {
    const [oldT, newT] = TITLES[f];
    const tag = "<title>" + oldT + "</title>";
    if (s.includes(tag)) { s = s.replace(tag, "<title>" + newT + "</title>"); changes.push("title"); }
    else changes.push("TITLE-MISS!");
  }

  // 4) og:title (A6)
  if (OGTITLE[f]) {
    const re = /(<meta property="og:title" content=")[^"]*(">)/;
    if (re.test(s)) { s = s.replace(re, `$1${OGTITLE[f]}$2`); changes.push("og:title"); }
    else changes.push("OGTITLE-MISS!");
  }

  if (s !== before) {
    // byte-safety guards before writing
    if (s.indexOf(NUL) !== -1) { console.error("ABORT NUL byte in", f); process.exit(1); }
    if (!/<\/html>\s*$/.test(s)) { console.error("ABORT missing </html> in", f); process.exit(1); }
    fs.writeFileSync(fp, s, "utf8");
    report.push(f.padEnd(34) + " " + changes.join(", "));
  }
}
console.log("Files changed: " + report.length + "\n" + report.join("\n"));
