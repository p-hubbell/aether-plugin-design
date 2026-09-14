---
target: catalog
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
timestamp: 2026-09-01T23-29-45Z
slug: catalog-catalogpage-tsx
---
# Critique: catalog (`catalog/CatalogPage.tsx`)

Method: dual-agent

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Readouts update; focus is `outline: none`; Bypass pad is an empty square; small EQ ticks barely leave noon |
| 2 | Match System / Real World | 2 | Hardware grammar fits plugin designers; `lp`/`bp`/`hp` and “Construction overlay” fail first-run catalog language |
| 3 | User Control and Freedom | 2 | Size, overlay, Bypass reverse; no reset/undo for Cutoff, Mix, EQ |
| 4 | Consistency and Standards | 2 | Fluoro means tab, tick, fill, pad, and construction; catalog invents `face-rail`/`face-eq` while kit `ControlBank` sits unused; Surface bakes a filter map |
| 5 | Error Prevention | 3 | Ranges clamp, Type discrete, Pad boolean; SizeFrame `overflow: hidden` can clip; Bypass is a large accidental hit |
| 6 | Recognition Rather Than Recall | 3 | Name + value on every param; Type codes and overlay geometry still require recalled DSP/canon knowledge |
| 7 | Flexibility and Efficiency | 2 | Arrows + Shift-fine on knobs/slider; no overlay shortcut, no param reset, no second layout |
| 8 | Aesthetic and Minimalist Design | 2 | Quiet TE-like Standard faceplate; overlay uses the same fluoro as widgets; Wide is empty; Compact overlay is a net through Cutoff and Bypass |
| 9 | Error Recovery | 2 | Invalid input is hard; overshot Cutoff / accidental Bypass is unexplained and unrestored |
| 10 | Help and Documentation | 1 | No legend for construction, fixtures, or filter types |
| **Total** | | **21/40** | **Acceptable** |

## Design Specificity Verdict

**Start here.** The catalog is authored in parts and interchangeable as a product.

**LLM assessment:** GXSC ice/pool/fluoro, IBM Plex with 0.12em tracking, Van De Graaf overlay, and a tiny control vocabulary (dial, knob, stepper, pad, slider) are Aether-specific. The live page still reads as one boutique filter: Nameplate `Aether` / `filter`, Surface areas locked to `name` / `hero` / `rail` / `eq`, no second composition. A delay or sampler could not sit in this chassis without forking the kit. Compact / Standard / Wide chrome is generic lab UI, not plugin hardware.

**Deterministic scan:** `detect.mjs` on `catalog` (and on `index.html`, `CatalogPage.tsx`, `index.css`) returned `[]`, exit 0. Stderr: HTML parser modules unavailable (`htmlparser2`, `css-select`, `css-tree`, `domutils`); regex fallback. Custom properties, selector matching, and computed contrast were **not** evaluated. Zero findings is an **undercount**, not a clean bill of health. No false positives (nothing flagged). The scan therefore missed the contrast and overlay-color issues the design review named.

**Visual overlays:** No reliable user-visible overlay. Browser MCP could not keep a tab; live-server was never started; `detect.js` was never injected. Do not look for a [Human] overlay. Assessment A inspected the running Vite app at http://localhost:5173/ via separate Chrome captures (Standard / Compact / Wide, overlay on/off, live tweaks).

## Overall Impression

The Standard faceplate already feels like a hardware object: Cutoff as hero, ice field, fluoro ticks, honest Hz/%/dB readouts. The single biggest opportunity is to stop selling a filter chassis as the kit. Until Surface is a generic canon carrier, overlay ink is distinct from widgets, and keyboard/contrast meet the AA bar you locked in PRODUCT.md, this catalog cannot prove “any Aether plugin, one family.”

## What's Working

- Cutoff vs rail vs EQ is a clear three-region hardware sentence; live readouts make Operate honest.
- Named landscape fixtures (560×400 / 800×440 / 1000×520) are the right catalog job: judge scale, not marketing.
- Restricted GXSC palette and tracked uppercase labels already feel like one designer’s line.

## Priority Issues

- **[P1] What:** `Surface` grid areas are a filter topology (`name`/`hero`/`rail`/`eq`), not a generic Van De Graaf carrier.
  - **Why it matters:** The only public layout is this catalog’s filter, so cohesion across products cannot be judged.
  - **Fix:** Keep this composition in the catalog; Surface should be canon frame + free cells. Show a second non-filter faceplate.
  - **Suggested command:** `/impeccable distill catalog` (or `/impeccable shape` for a second fixture)

- **[P1] What:** Construction overlay uses `--rule`/`--accent` fluoro identical to knob rings, slider fill, and the selected size tab; Compact overlay is especially dense.
  - **Why it matters:** The placement guide hides the language it is meant to explain.
  - **Fix:** Dedicated construction ink (weight/opacity/dash); mute widgets slightly while overlay is on.
  - **Suggested command:** `/impeccable quieter catalog`

- **[P1] What:** No `:focus-visible` on fixture buttons, overlay checkbox, or faceplate controls; selected size button is white on `#00c8be` (~2:1).
  - **Why it matters:** Keyboard/SR Operate and the WCAG 2.2 AA product bar fail on both chrome and faceplate.
  - **Fix:** Visible focus on `--ink`; do not use white type on fluoro; pad/stepper hits ≥24px with a non-color pressed state.
  - **Suggested command:** `/impeccable audit catalog`

- **[P2] What:** Bypass pad is an empty 2.5rem square; Type shows `lp`/`bp`/`hp`.
  - **Why it matters:** Affordance and copy fail the few-large-hits hardware brief.
  - **Fix:** Mark the pad (or filled inner); readable Type labels, short values if needed.
  - **Suggested command:** `/impeccable clarify catalog`

- **[P2] What:** Catalog chrome never shows another product composition; Nameplate brands the demo as Aether filter.
  - **Why it matters:** First-timers think Aether *is* the filter; power users cannot stress-test the kit.
  - **Fix:** Nameplate the demo as a fixture; add one alternate bank (e.g. delay).
  - **Suggested command:** `/impeccable shape catalog`

## Persona Red Flags

**Alex (power / plugin designer):** Primary action — judge whether this language would hold a delay. Blocked by baked `hero`/`rail`/`eq`. Overlay is the power tool but fights Cutoff/Bypass chrome. Keyboard arrows work; no overlay shortcut; no reset after dragging Cutoff off 440 Hz. Will not trust `ControlBank` because the catalog does not use it.

**Jordan (first-timer on the catalog):** Primary action — understand Aether, then nudge a control. H1 “Aether catalog” plus Nameplate “Aether” / “filter” reads as a product named Aether Filter. Type `lp` is opaque. Bypass pad looks broken until it fills teal. Overlay looks like a CAD dump. Will click Compact/Standard/Wide and stall on Type ‹ ›.

**Sam (keyboard / SR):** Tab order compact → standard → wide → overlay → Cutoff → Type previous/next → Bypass → Mix → Low → Mid → High. After High, `outline` is still `none`. Bypass has `aria-pressed` but no visible focus. Overlay SVG is `aria-hidden` (good) but crosses the Bypass hit when on. White-on-fluoro tabs fail contrast. Muted labels `#3d6f88` on pool `#d4eef7` are barely ~4.5:1.

## Cognitive load

4 checklist failures (high): single focus; visual hierarchy; one thing at a time; progressive disclosure. Faceplate presents 7 simultaneous tweak targets plus 3 fixtures + overlay. Overlay on Compact adds undifferentiated construction lines as competing noise.

## Emotional journey

Opening peak: Standard faceplate as a hardware object. Valley: overlay in widget fluoro, hierarchy collapses. Second valley: Type `lp` and a blank Bypass pad. End after tweaks confirms widgets work but never proves “kit, not one plugin.” Peak-end is a filter demo.

## Minor Observations

- Catalog toolbar is outside `ThemeRoot` (tokens leak via `:root`).
- `face-rail` / `face-eq` duplicate `ControlBank`.
- Type values stay lowercase while other labels are uppercase.
- Wide 1000×520 leaves a hollow interior; High sits lonely.
- EQ +1 dB tick is almost still noon — status is the number, not the rotor.
- SizeFrame `overflow: hidden` is a clipping trap at Compact if chrome grows.
- Pad pressed and fixture `aria-pressed="true"` share the same solid fluoro fill.

## Questions to Consider

- If every Aether plugin must use `name` / `hero` / `rail` / `eq`, is this a kit or a filter chassis with extra steps?
- What would the catalog have to show in 10 seconds for a designer to believe a sampler would still look like family?
- If construction lines cannot be a different color from the widgets, why is the overlay on by choice rather than a separate inspect mode?
