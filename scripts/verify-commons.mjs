// Authoritatively verify candidate Wikimedia Commons files before fetching:
// resolves the REAL direct media URL + license + author + date via the Commons API
// (do not trust hand-built hash-prefix URLs). Prints a table; flags non-reusable
// licenses. Reuse-OK = public domain / CC0 / CC BY* / CC BY-SA* (NOT NC/ND).
const TITLES = [
  // Round B — wildflowers (San Juans), heroes (winter + forest road)
  "File:Aquilegia coerulea - José Garrido 01.jpg",
  "File:East of Conejos Peak - Flickr - aspidoscelis.jpg",
  "File:Pedicularis groenlandica - Zac Peterson 01.jpg",
  "File:Mertensia bakeri - Flickr - aspidoscelis.jpg",
  "File:Wildflowers in American Basin.jpg",
  "File:Snowing - Winter long Wolf Creek Pass in Colorado.jpg",
  "File:Subaru on the road to Clear Lake. San Juan National Forest, Colorado (27868503841).jpg",
];

const OK = /(^|\b)(public domain|cc0|cc by(?!-nc)(-sa)?( \d|\b))/i;
const BAD = /(nc|nd|non-commercial|noderiv)/i;

function strip(h){ return (h||"").replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/\s+/g," ").trim(); }

const api = "https://commons.wikimedia.org/w/api.php";
const results = [];
for (let i = 0; i < TITLES.length; i += 10) {
  const batch = TITLES.slice(i, i + 10);
  const url = api + "?action=query&format=json&prop=imageinfo&iiprop=url%7Cextmetadata&titles="
    + encodeURIComponent(batch.join("|"));
  const r = await fetch(url, { headers: { "User-Agent": "GoVallecito-image-verify/1.0 (dkontje@gmail.com)" } });
  const j = await r.json();
  const pages = j.query?.pages || {};
  for (const p of Object.values(pages)) {
    if (p.missing !== undefined || !p.imageinfo) { results.push({ title: p.title, missing: true }); continue; }
    const ii = p.imageinfo[0];
    const m = ii.extmetadata || {};
    const lic = strip(m.LicenseShortName?.value);
    const licUrl = m.LicenseUrl?.value || "";
    const artist = strip(m.Artist?.value);
    const date = strip(m.DateTimeOriginal?.value || m.DateTime?.value);
    const reuse = OK.test(lic) && !BAD.test(lic);
    results.push({ title: p.title, url: ii.url, mime: ii.mime, w: ii.width, h: ii.height, lic, licUrl, artist, date, reuse });
  }
}
for (const x of results) {
  if (x.missing) { console.log("MISSING  " + x.title); continue; }
  console.log((x.reuse ? "OK   " : "STOP ") + x.title);
  console.log("       lic=" + x.lic + " | by=" + x.artist + " | date=" + x.date + " | " + x.w + "x" + x.h + " " + x.mime);
  console.log("       url=" + x.url);
}
console.log("\nReuse-OK: " + results.filter(r=>r.reuse).length + " / " + results.length);
