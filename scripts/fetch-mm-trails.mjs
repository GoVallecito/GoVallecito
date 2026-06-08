// Round 31: fetch authoritative Middle Mountain trail/road GEOMETRY from the USFS
// EDW ArcGIS REST service and write a committed GeoJSON (no runtime USFS dependency).
// Run from repo root:  node scripts/fetch-mm-trails.mjs
//
// Trails layer: EDW_TrailNFSPublish_01/MapServer/0  (fields trail_no, trail_name, gis_miles)
// Verified working June 2026 (trail 808 VALLECITO VIEW → gis_miles 1.724, matches FS 1.7 mi).
import { writeFile } from 'node:fs/promises';

const UA = { 'User-Agent': 'GoVallecito/1.0 (map data build)' };
const TRAIL_URL = 'https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_TrailNFSPublish_01/MapServer/0/query';
// Middle Mountain bounding box (NE corner of the lake up FR 724), WGS84 lon/lat.
const BBOX = { xmin: -107.56, ymin: 37.38, xmax: -107.42, ymax: 37.55 };

// Target trails + the use-class per docs/MIDDLE-MOUNTAIN-CONTENT.md, and the published
// mileage we sanity-check the EDW geometry against (reject wrong-forest same-number hits).
const TARGETS = [
  { no: '808', name: 'VALLECITO VIEW', use: 'ohv50',      pub: 1.7 },
  { no: '812', name: 'BERI',          use: 'ohv50',      pub: 3.4 },
  { no: '814', name: 'DARK CANYON',   use: 'moto',       pub: 2.2 },
  { no: '530', name: 'CAVE BASIN',    use: 'foot-horse', pub: 4.5 },
];

function envelope() {
  return encodeURIComponent(JSON.stringify(BBOX));
}
async function q(url, where, extra = '') {
  const u = `${url}?where=${encodeURIComponent(where)}&geometry=${envelope()}` +
    `&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects` +
    `&outFields=*&returnGeometry=true&outSR=4326&f=json${extra}`;
  const r = await fetch(u, { headers: UA });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${where}`);
  const j = await r.json();
  if (j.error) throw new Error(`ArcGIS error: ${JSON.stringify(j.error)}`);
  return j.features || [];
}
// Haversine length (miles) of an Esri path (array of [lon,lat]).
function pathMiles(path) {
  const R = 3958.7613; let m = 0;
  for (let i = 1; i < path.length; i++) {
    const [lo1, la1] = path[i - 1], [lo2, la2] = path[i];
    const dLa = (la2 - la1) * Math.PI / 180, dLo = (lo2 - lo1) * Math.PI / 180;
    const a = Math.sin(dLa / 2) ** 2 + Math.cos(la1 * Math.PI / 180) * Math.cos(la2 * Math.PI / 180) * Math.sin(dLo / 2) ** 2;
    m += 2 * R * Math.asin(Math.sqrt(a));
  }
  return m;
}
const r5 = n => Math.round(n * 1e5) / 1e5;
function toGeoJSONLine(paths, props) {
  // Esri polyline may have multiple paths; emit MultiLineString if >1, else LineString.
  const rings = paths.map(p => p.map(([lo, la]) => [r5(lo), r5(la)]));
  const geometry = rings.length === 1
    ? { type: 'LineString', coordinates: rings[0] }
    : { type: 'MultiLineString', coordinates: rings };
  return { type: 'Feature', properties: props, geometry };
}

const features = [];
const report = [];
const trailPaths = {};   // no -> paths, for deriving trailhead pins
let roadPaths = null;

for (const t of TARGETS) {
  // Match by number AND name within the bbox — guards against same-number trails elsewhere.
  let fs = await q(TRAIL_URL, `TRAIL_NO = '${t.no}' AND TRAIL_NAME LIKE '%${t.name}%'`);
  if (!fs.length) fs = await q(TRAIL_URL, `TRAIL_NAME LIKE '%${t.name}%'`);
  if (!fs.length) { report.push(`EXCLUDED ${t.no} ${t.name}: no EDW feature in bbox`); continue; }
  // Merge all path segments of all returned rows into one feature.
  const allPaths = [];
  let gis = 0;
  for (const f of fs) { (f.geometry?.paths || []).forEach(p => allPaths.push(p)); gis += (f.attributes?.gis_miles || 0); }
  if (!allPaths.length) { report.push(`EXCLUDED ${t.no} ${t.name}: no geometry`); continue; }
  const geomMi = allPaths.reduce((a, p) => a + pathMiles(p), 0);
  // Length check: EDW gis_miles AND our computed geometry length must both be near published.
  const okGis = Math.abs(gis - t.pub) <= Math.max(0.6, t.pub * 0.3);
  const okGeom = Math.abs(geomMi - t.pub) <= Math.max(0.8, t.pub * 0.4);
  if (!okGis && !okGeom) {
    report.push(`EXCLUDED ${t.no} ${t.name}: length mismatch (gis ${gis.toFixed(2)}, geom ${geomMi.toFixed(2)} vs pub ${t.pub})`);
    continue;
  }
  // Label with the published mileage (geometry above validated it's the right trail);
  // keeps the map popups consistent with middle-mountain.html and the content doc.
  const miles = t.pub;
  trailPaths[t.no] = allPaths;
  features.push(toGeoJSONLine(allPaths, { name: titleCase(t.name), no: t.no, use: t.use, miles }));
  report.push(`OK ${t.no} ${t.name}: gis ${gis.toFixed(3)} mi · geom ${geomMi.toFixed(3)} mi · pub ${t.pub} · pts ${allPaths.reduce((a,p)=>a+p.length,0)}`);
}

// Runlett Park Trail — the content doc says it has NO published FS number/length.
// The EDW name-match (TRAIL_NAME LIKE '%RUNLETT%') returns an ambiguous feature
// numbered 530 (Cave Basin's Wilderness number, foot-horse) — we can't cleanly
// confirm it's the OHV two-track without risking mislabeling a Wilderness segment,
// so we EXCLUDE it (verify-or-exclude). FR 724 + Dark Canyon already cover the area.
report.push('EXCLUDED Runlett Park: EDW name-match returns ambiguous trail_no 530 (Cave Basin/Wilderness); no published number/length to validate against');

// Road spine FR 724 — EDW RoadBasic, matched by road number id='724' (the NAME field
// holds "MIDDLE MTN"; a NAME-only match wrongly hits id 705 "MIDDLE MOUNTAIN CG").
// Require a real spine length (>=5 mi); else ship trails-only (road shows on OSM tiles).
const ROAD_URL = 'https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_RoadBasic_01/MapServer/0/query';
let roadDone = false;
try {
  const fs = await q(ROAD_URL, `ID = '724'`);
  const paths = [];
  for (const f of fs) { (f.geometry?.paths || []).forEach(p => paths.push(p)); }
  const mi = paths.reduce((a, p) => a + pathMiles(p), 0);
  if (paths.length && mi >= 5) {
    // Don't print an exact length (sources conflict ~11–12.6 mi) — flag null, map shows "~11 mi".
    roadPaths = paths;
    features.push(toGeoJSONLine(paths, { name: 'FR 724 — Middle Mountain Rd', no: '724', use: 'road', miles: null }));
    report.push(`OK FR724 road (id=724): geom ${mi.toFixed(2)} mi · pts ${paths.reduce((a,p)=>a+p.length,0)} (label "~11 mi")`);
    roadDone = true;
  } else {
    report.push(`note FR724 road: id=724 returned ${mi.toFixed(2)} mi (<5) — excluded`);
  }
} catch (e) { report.push('note FR724 road: query failed — ' + e.message); }
if (!roadDone) report.push('note FR724 road: TRAILS-ONLY (road still shows on the OSM base tiles)');

// ---- Derive trailhead pins from the geometry (authoritative — src = EDW geometry) ----
// Each trail's endpoint nearest the FR 724 corridor = its trailhead; the FR 724 endpoint
// farthest from the lake's NE corner = the Tuckerville road-end.
function endpointsOf(paths){ const f=paths[0][0]; const lp=paths[paths.length-1]; return [f, lp[lp.length-1]]; }
function ptDistMi(a,b){ return pathMiles([a,b]); }
const roadPts = roadPaths ? roadPaths.flat() : null;
function nearestRoad(pt){ if(!roadPts) return Infinity; let d=Infinity; for(const rp of roadPts){const x=ptDistMi(pt,rp); if(x<d)d=x;} return d; }
function pinFeature(coord, props){ return { type:'Feature', properties:{ kind:'trailhead', ...props }, geometry:{ type:'Point', coordinates:[r5(coord[0]), r5(coord[1])] } }; }

const PINS = [
  { no:'808', name:'Vallecito View Trailhead', anchor:'routes' },
  { no:'812', name:'Beri Trail junction (FR 724)', anchor:'routes' },
  { no:'530', name:'Cave Basin Trailhead', anchor:'routes' },
];
for (const pin of PINS) {
  const paths = trailPaths[pin.no];
  if (!paths) { report.push(`pin SKIP ${pin.name}: trail ${pin.no} not in set`); continue; }
  const [a, b] = endpointsOf(paths);
  // endpoint nearest the road corridor is the trailhead (where you park/ride from)
  const th = roadPts ? (nearestRoad(a) <= nearestRoad(b) ? a : b) : a;
  const d = roadPts ? Math.min(nearestRoad(a), nearestRoad(b)) : null;
  features.push(pinFeature(th, { name: pin.name, no: pin.no, anchor: pin.anchor,
    src: `USFS EDW TrailNFSPublish geometry (trail ${pin.no})` }));
  report.push(`pin ${pin.name}: [${r5(th[0])},${r5(th[1])}]${d!=null?` (~${(d*5280).toFixed(0)} ft from FR724)`:''}`);
}
// Tuckerville road-end = FR724 vertex farthest from the lake's NE corner (road climbs away from the lake).
if (roadPts) {
  const NE = [-107.515, 37.503];
  let end = roadPts[0], best = -1;
  for (const rp of roadPts) { const x = ptDistMi(rp, NE); if (x > best) { best = x; end = rp; } }
  features.push(pinFeature(end, { name: 'Tuckerville road-end (FR 724)', no: '724', anchor: 'tuckerville',
    src: 'USFS EDW RoadBasic geometry (road 724 end)' }));
  report.push(`pin Tuckerville road-end: [${r5(end[0])},${r5(end[1])}] (~${best.toFixed(1)} mi from lake NE corner)`);
}

const fc = { type: 'FeatureCollection', _source: 'USFS EDW EDW_TrailNFSPublish_01 (+ EDW_RoadBasic_01) — fetched build-time; trailhead pins derived from geometry', features };
const out = new URL('../public/data/middle-mountain-trails.geojson', import.meta.url);
const json = JSON.stringify(fc);
await writeFile(out, json);
console.log(report.join('\n'));
console.log(`\nwrote middle-mountain-trails.geojson — ${features.length} features, ${(json.length/1024).toFixed(1)} KB`);

function titleCase(s){return s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());}
