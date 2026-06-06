# Review Updates — Round 9: Readability / contrast pass (for Claude Code)

David reports light-grey text on light-tan backgrounds that's hard to read (Julie's real-estate page,
Conditions, and others). This is a site-wide contrast problem. Fix in `assets/css/styles.css` (and any
inline styles), keep the existing palette/theme, redeploy + push.

## Targets (WCAG AA)
- Normal text **≥ 4.5:1**, large/bold text **≥ 3:1** against its actual background.
- Test secondary text specifically against the **tan/cream** backgrounds (`--sand #e9e1d0`,
  `--sand-2 #f4efe4`), not just white — that's where it's failing.

## Specific fixes
1. **Darken the secondary-text token.** `--ink-soft:#4b554d` → **`#3c463e`** (deeper slate-green). It's
   used everywhere (`.muted`, `.sec-lead`, `.tile .small`, `.tile h3`, table text, nav). Darkening it
   lifts contrast on tan without changing the look.
2. **Body/bio/long-form text must use `--ink` (near-black), not a grey,** anywhere it sits on a tan/sand
   or cream card — especially **Julie's bio + listing-card text** and the **Conditions** prose. Reserve
   `--ink-soft` for *small secondary labels only*, and only where it still passes AA.
3. **Fix the light-grey captions:** `.tile .src{color:#aab2a8}` fails badly (~2:1 on white). Change to
   **`#5f6b61`** (or `var(--ink-soft)`).
4. **Placeholder text on tan** (`.pcard .pimg`, `.prop .img`, `.agent-card .ph`, `.bizhero .ph` — all
   `background:var(--sand)` with `--ink-soft`): bump that text to `--ink` or darken so labels read
   clearly. (The gradient `.pimg.ph` pine→lake with white text is fine — leave it.)
5. **Audit every place text sits on `--sand`/`--sand-2`** (e.g. `section.band.alt`, table headers
   `.tbl th`, featured cards): confirm the text is `--ink` or the darkened `--ink-soft` and passes AA.
6. Leave the **dark-background text alone** — the light mint/teal on the pine hero & footer
   (`#9fe6d6`, `#cfe0d7`, `#dfeae3` on `--pine`) is intentional and high-contrast; don't darken those.

## Pages to spot-check after the change
Julie's real-estate-partner page (bio + listing cards), Conditions (labels, source captions, tables),
the directory featured cards, and any `.band.alt` (tan) sections on the home/other pages.

## Verify
Re-check the darkened secondary text against `--sand` and `--sand-2` hits ≥ 4.5:1 (large/labels ≥ 3:1).
Redeploy + push.
