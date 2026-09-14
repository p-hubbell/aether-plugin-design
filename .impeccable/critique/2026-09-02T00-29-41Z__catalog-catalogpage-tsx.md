---
target: catalog
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-09-02T00-29-41Z
slug: catalog-catalogpage-tsx
---
# Critique: catalog (`catalog/CatalogPage.tsx`)

Method: dual-agent

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Readouts and pressed states update; Delay never shows that Time (ms) is unrelated to Division pads |
| 2 | Match System / Real World | 2 | Tab **Scene** is the Prism filter; Clock **sync** still shows Time in ms |
| 3 | User Control and Freedom | 2 | Views/sizes/overlay exit easily; no reset/undo; overlay state does not persist across Kit/Scene/Delay |
| 4 | Consistency and Standards | 2 | Exclusive choice is Stepper (Type/Clock) vs pads-as-radio (Division); EQ is `.face-eq`, Delay uses `ControlBank` |
| 5 | Error Prevention | 2 | Knobs clamp; sync+ms and pads that look multi-select are unguarded |
| 6 | Recognition Rather Than Recall | 3 | Controls labeled; “Scene = Prism” and overlay geometry must be recalled |
| 7 | Flexibility and Efficiency | 2 | Arrow/Shift on knobs; no view shortcuts; no side-by-side products or sizes |
| 8 | Aesthetic and Minimalist Design | 3 | Faceplates restrained; Kit is seven equal boxed sections competing with the plate |
| 9 | Error Recovery | 1 | No error language; invalid musical state (sync vs ms) is silent |
| 10 | Help and Documentation | 1 | Overlay unlabeled; no legend that Kit / Prism / Hold are one language, three jobs |
| **Total** | | **21/40** | **Acceptable** |

## Design Specificity Verdict

**Start here.** Authored for Aether as a *control language* (GXSC, Plex, TE-scale hits, VdG overlay). Not yet authored as a *plugin family proof*: Seto still cannot put Prism and Hold in one glance.

**LLM assessment:** Ice/fluoro/ink, tracked uppercase, catalog-owned `areas` (Prism `name/hero/rail/eq` vs Hold `name/time/mix/bank`), and inspect-only overlay are product-specific. Kit specimen nameplate is already Prism/filter, so the “primitives” view is branded as one plugin. Delay reuses Scene’s rail silhouette (stepper + secondary + Mix) and swaps the bottom row for a bank — same dialect, not a second product in space.

**Deterministic scan:** `detect.mjs --json catalog` exit 0, findings `[]`. Stderr: HTML parser modules unavailable; regex fallback; contrast/selectors/custom properties **not** evaluated. Zero findings is an undercount. No false positives (nothing flagged). Detector did not catch naming, IA, or Delay Clock/Time mismatch.

**Visual overlays:** No reliable user-visible overlay. Browser MCP did not re-register; mutation preflight and `detect.js` injection never ran. Vite at http://localhost:5173/ returned HTTP 200.

## Overall Impression

The kit grammar is coherent. The catalog still asks Seto to **remember** family instead of **seeing** it. Biggest opportunity: put two plates in one fixture (or rename Scene and unlink Delay’s lying Clock/Time) so Delay actually tests cohesion.

## What's Working

- Shared param sentence: muted name, tabular value, ink 2px hits, fluoro as function (rotor, fill, pressed pad, nameplate rule).
- Kit `Surface` stays generic; catalog owns both topologies.
- Overlay is inspect-only (`pointer-events: none`, `aria-hidden`); chrome is not a VdG carrier.

## Priority Issues

- **[P1] Mutually exclusive views fail the family test**
  - **Why it matters:** PRODUCT success is “a delay still looks like the kit.” Sequential tabs cannot prove that; Kit even wears Prism’s nameplate.
  - **Fix:** Dual plates at one fixture size; Kit nameplate stays Blank/generic.
  - **Suggested command:** `/impeccable layout`

- **[P1] “Scene” hides the second product**
  - **Why it matters:** Kit \| Scene \| Delay reads as app modes, not specimen / filter / delay.
  - **Fix:** Label Kit · Prism · Hold (or Filter / Delay) with a one-line job under the bar.
  - **Suggested command:** `/impeccable clarify`

- **[P2] Delay Clock and Time lie**
  - **Why it matters:** `sync` + Time in ms + Division pads that do not drive Time looks like one kit and behaves like two mocks.
  - **Fix:** Sync hides ms / uses division as time; free shows ms and dims the bank.
  - **Suggested command:** `/impeccable harden`

- **[P2] Two grouping grammars for exclusive choice**
  - **Why it matters:** Type/Clock = Stepper, Division = pads not a radio group, EQ = ad-hoc grid.
  - **Fix:** One exclusive pattern; SR should hear one-of-many on Division.
  - **Suggested command:** `/impeccable distill`

- **[P2] Construction overlay is mute**
  - **Why it matters:** “Show construction overlay” does not name canon, diagonals vs power, or inspect-only.
  - **Fix:** Short legend; keep lines non-interactive.
  - **Suggested command:** `/impeccable onboard`

## Persona Red Flags

**Alex (power / plugin designer):** Cannot A/B Prism vs Hold without wiping the other. No keys for views. Overlay resets per tab.

**Jordan (first-timer):** Scene ≠ filter. Overlay is unexplained geometry. Will treat Delay as a second app.

**Sam (keyboard / SR):** Knobs/sliders keyboard OK. Division pads are toggles, not a radio group. SizeFrame scale can shrink hits. Overlay is `aria-hidden` (correct for inspect).

**Seto (family judge):** Same tokens, yes. Same composition dialect (rail clone). Verdict available: “same skin.” Verdict missing: “delay sits on the same canon as a filter.”

## Minor Observations

- Kit Surface fixture is 360×200, not compact/standard/wide.
- Pad marks plus ParamChrome duplicate the same fact (`1/8`, in/out).
- Catalog chrome 1px blue vs plate 2px rule is right; Kit specimen boxes match chrome so they feel like cards, not WebViews.

## Questions to Consider

- If success is “a delay still looks like the kit,” why is the only comparison time, not space?
- If Hold must not be Prism, why does it keep Prism’s rail?
- Should the overlay name the canon, or stay a silent drawing?
