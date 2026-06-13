// Authoritatively verify candidate Wikimedia Commons files before fetching:
// resolves the REAL direct media URL + license + author + date via the Commons API
// (do not trust hand-built hash-prefix URLs). Prints a table; flags non-reusable
// licenses. Reuse-OK = public domain / CC0 / CC BY* / CC BY-SA* (NOT NC/ND).
const TITLES = [
  // Category 1 — Ute heritage
  "File:Ute delegation.jpg",
  "File:Wah-be-git - Ute man, half-length portrait, facing right, wearing earring in right ear, with two braids LCCN94509881.jpg",
  "File:Chief Sevara and family, ca. 1885 - DPLA - c2cf2de92e89e01f976288b59de4aac0.jpg",
  "File:Ute braves, of the Kah-poh-teh band - DPLA - 2e5f06d0a53f6bb71eab8550af4b9266 (page 1).jpg",
  "File:Utes. Group of children LOC ds.10831.jpg",
  // Category 4 — recreation / hiking / reservoirs
  "File:Hiking to the Ice Lakes. San Juan National Forest, Colorado.jpg",
  "File:Continental divide trail in Weminuche Wilderness.jpg",
  "File:Emerald Lake (San Juan National Forest), CO.jpg",
  "File:Looking across Williams Creek Reservoir.JPG",
  "File:The mouth of Weminuche Creek.JPG",
  "File:Haviland Lake - panoramio (1).jpg",
  "File:Columbine Lake San Juan National Park - panoramio.jpg",
  // Category 5 — wild & scenic, wildlife, night sky
  "File:Weminuche Wilderness hills.JPG",
  "File:Ice Lake basin, San Juan Mountains, Colorado.jpg",
  "File:Aspen Gold.jpg",
  "File:USFWS bald eagle (23770875811).jpg",
  "File:Rocky Mountain Bull Elk.jpg",
  "File:Moose superior.jpg",
  "File:American black bear (26905320846).jpg",
  "File:Rocky Mountain Bighorn Sheep (Ovis canadensis canadensis), Rocky Mountain National Park.jpg",
  "File:Milky Way over Rocky Mountain National Park (26367276674).jpg",
  "File:Sangre de Cristos-after dark (3863509911).jpg",
  "File:Osprey with fish (49694356538).jpg",
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
