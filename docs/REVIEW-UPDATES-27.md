# Review Updates — Round 27: dam outflow (for Claude Code)

Add reservoir OUTFLOW to the live data, displayed alongside inflow and lake level (David's ask; source =
the same USACE CWMS system the lake feed already uses — water.usace.army.mil/overview/spk/locations/vallecito
is the human view of it). Worker + front-end. Deploy both + push.

## 1. Worker — new outflow reading (verified series, June 2026)
CWMS catalog (office=SPK, like=Vallecito) confirms:
- **`Vallecito.Flow-Res Out.Ave.~1Day.1Day.Raw-USBRSLC`** — daily avg dam outflow, units **cms**,
  data 2013→present (latest currently June 1 — same daily/few-day lag as the lake storage series).
- (Also available, FYI: `Vallecito.Flow-Res In.Ave...` = USBR's computed reservoir inflow — a nice
  cross-check against our USGS gauge sum; and `Vallecito-nr Bayfield.Flow.Ave.~1Day.1Day.Calc-usgs` —
  a below-dam USGS-derived daily that runs a couple days fresher. Primary = Flow-Res Out (it IS the dam
  number); optionally fall back to the nr-Bayfield series if Flow-Res Out is empty.)
Implementation: extend the existing `lakeFromCwms()` pattern (same `ts()` helper, office SPK, same
begin/end window). **Convert cms → cfs (×35.3147)** — note the existing storage path already converts
SI; keep consistent. Add to the conditions JSON under `stream` as:
`stream.outflow = { cfs, asOf, source: "USACE CWMS (USBR SLC)", stale }` — stale per the lake's 72h
rule (it's a daily series; expect it to flag stale sometimes — honest is fine). Wrap in the same
`safe()`/last-good discipline. Sanity band: 0–5,000 cfs (the Oct-2025 flood peaked ~7,000 on the creek;
dam releases won't exceed spillway-scale — reject negatives/absurd values).

## 2. Front-end — show it with inflow and lake level
- **Conditions #streamflow section:** add an "Outflow — Vallecito Dam → Pine River" row under the two
  inflow gauges, same styling + per-row source/asOf line (+stale badge). One muted context line:
  "Outflow is the irrigation release to the Pine River valley — it's why the lake level falls through
  late summer." (Verified framing: the Pine River Project serves ~69,000 acres downstream incl.
  Southern Ute lands — consistent with existing site copy.)
- **Home 🏞️ Streamflow tile:** show both: "In 330 cfs · Out 95 cfs" (compact; keep the emoji style).
- **Conditions lake section:** one line tying level + outflow ("level reflects inflow minus releases").
- **Weekly "This week on the water":** add an outflow bullet (live data, no invented trend until two
  weekly snapshots exist — same pattern as the lake-trend bullet).
- sources.html #how-we-verify table: add the outflow row (USACE CWMS / USBR, daily, auto every 15 min).

## After applying
Deploy Worker + Pages, push. Verify via /__refresh: `stream.outflow.cfs` is a sane number (June =
irrigation season, expect a real release, likely tens–hundreds of cfs), asOf ≈ the series' latest
(June 1 currently → will flag stale under 72h — confirm the badge renders, that's correct behavior);
conditions page shows the outflow row + context line; home tile shows In/Out; sources row added.
Report the first live reading.

## Future note (not this round)
The same catalog exposes `Vallecito.Depth-SWE.Inst...NRCS` — the Vallecito SNOTEL snowpack (snow-water
equivalent). That's a ready-made winter tile ("snowpack feeding next summer's lake") when David wants it.
