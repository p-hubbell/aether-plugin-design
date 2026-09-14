---
status: implemented
---

# Van De Graaf geometry module

## Goal

Callers can pass a carrier width and height and receive a pure Van De Graaf construction (diagonals, intersections, unique power lines) plus a default selected-few subset for later layout, without any React or drawing in this module.

## Acceptance Criteria

- [ ] Kit source includes a geometry module at `src/geometry/vanDeGraaf` (file or directory). It has no React/DOM/CSS imports. The kit public entry (`src/index.ts` or `src/index.tsx`) re-exports the construct and select-few APIs (names may be `vanDeGraaf` and `selectPowerLines` as in the plan, or equivalent named exports).
- [ ] For each of these finite sizes — square `400×400`, ~2:1 landscape `800×400`, short ~2.5:1 landscape `800×320` — `vanDeGraaf(w, h)` returns: (1) full-rect diagonals `(0,0)–(w,h)` and `(w,0)–(0,h)`; (2) half-width diagonals of the left and right halves (`w/2`); (3) half-height diagonals of the top and bottom halves (`h/2`); (4) at least one intersection point; (5) at least one finite vertical power line `x` and one finite horizontal power line `y`. Every intersection satisfies `0 ≤ x ≤ w` and `0 ≤ y ≤ h`. Every power-line coordinate is a finite number (not `NaN` / `±Infinity`).
- [ ] Unique vertical `x` values and unique horizontal `y` values are quantized with a named epsilon constant exported or documented next to the module (value ≤ `1e-3`). After quantization, no two vertical lines share an `x` and no two horizontal lines share a `y`.
- [ ] Default `selectPowerLines` (or equivalent default preset) on a construction from `w > 0` and `h > 0` returns selected verticals and horizontals that are a subset of that construction’s unique power lines (every selected `x`/`y` appears in the full sets). The default selection includes at least one vertical and at least one horizontal. Selected lines include the outermost unique verticals and horizontals (min/max `x`, min/max `y` of the full unique sets) when those sets are non-empty; any additional interior lines are a small subset of the remainder, not the full remainder unless the remainder has at most two lines per axis.
- [ ] When `w` is `0`, `h` is `0`, `w < 0`, `h < 0`, or either is non-finite (`NaN`, `±Infinity`), both construct and select-few return a safe empty result: empty arrays (or equivalent empty collections) for diagonals, intersections, and power lines; no field is `NaN`; the functions do not throw.

## Out of Scope

- React layout (`layout/Surface`), CSS grid tracks, `ResizeObserver`, and the 1-cell empty-selection fallback — that is `surface-overlay`.
- Overlay painting, `pointer-events`, and `rule` color — that is `surface-overlay`.
- Catalog page chrome, named SizeFrames, overlay toggle, and applying the canon to the catalog document — that is `catalog-composition`.
- GXSC/type tokens, Knob/Slider, grid authoring UI, and host/WebView integration.
- Proving the construction “looks like” a book-page Van De Graaf; short-landscape sparsity is accepted and inspected later via overlay.

## Constraints

- Architecture lock: pure `(w, h) → construction` in `geometry/vanDeGraaf`. Coordinate origin is the carrier’s top-left; `x` right, `y` down, units in CSS pixels matching later Surface/Overlay space.
- Construction **must** include half-height diagonals so short landscape carriers still produce tracks. Overlay-vs-layout split is construct-all / select-few only; this task does not paint.
- Kit never imports `catalog/`. Geometry must not depend on theme, type, or control modules.
- Use the existing Vitest runner; cover the sizes and empty/non-finite cases above with unit tests (no catalog/E2E required for this task).
- Do not add a new runtime dependency for geometry math.

## Implementation Notes

Pure math lives in `src/geometry/vanDeGraaf.ts` (no React/DOM/CSS). `vanDeGraaf(w, h)` builds full-rect, half-width, and half-height diagonals, pairwise segment intersections clamped to the carrier, then unique `x`/`y` power lines quantized with exported `VAN_DE_GRAAF_EPSILON` (`1e-6`). `selectPowerLines` always keeps outermost unique lines and at most two interior lines per axis (nearest to the 1/9 and 8/9 canon positions when the remainder is larger). Invalid/zero/non-finite sizes return empty collections with finite zeros for width/height and do not throw. Public entry re-exports these APIs next to the existing Placeholder. `npm test` exits 0 (17 tests).
