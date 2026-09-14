---
status: implemented
---

# Surface layout and construction overlay

## Goal

A measured plugin carrier (`Surface`) lays out ordinary children on a CSS grid derived from selected Van De Graaf power lines, and an opt-in `Overlay` can draw the full construction in that same coordinate space without intercepting pointer input.

## Acceptance Criteria

- [ ] Kit source includes `src/layout/Surface` and `src/layout/Overlay` (file or directory each). The kit public entry (`src/index.ts` or `src/index.tsx`) re-exports `Surface` and `Overlay` (names may be equivalent). Neither layout module imports `catalog/`, `controls/Knob`, or `controls/Slider`. Geometry is consumed from the existing `src/geometry/vanDeGraaf` APIs (`vanDeGraaf`, `selectPowerLines`); this task does not reimplement construction math.
- [ ] `Surface` measures its carrier with `ResizeObserver` (or an equivalent that observes the same element’s content box). A unit/RTL test installs a mock observer, delivers a finite positive `contentRect` of **800×400**, and asserts: (1) the Surface host (or its grid element) has `display: grid`; (2) `grid-template-columns` / `grid-template-rows` track sizes in CSS pixels match consecutive differences of the **default selected-few** verticals/horizontals for `selectPowerLines(vanDeGraaf(800, 400))` (sorted); (3) selected-few ⊆ that construction’s unique power lines (same contract as the geometry module). Default selection is `selectPowerLines` — not the full unique-line set.
- [ ] With overlay enabled for that same mocked **800×400** size, the overlay paints the **full construction** from `vanDeGraaf(800, 400)`: every diagonal segment, every unique vertical, and every unique horizontal. A test counts those painted pieces and asserts they equal `diagonals.length + verticals.length + horizontals.length` for that construction. Overlay line count is **not** the selected-few count. Overlay stroke/fill color uses the semantic `rule` token (`var(--rule)` or equivalent computed from `--rule`), not a one-off hex that bypasses the token.
- [ ] Overlay is opt-in on the Surface API (boolean or equivalent; **default off**). With the opt-in false/omitted, no construction overlay nodes are in the document (or they are not rendered). Overlay is a descendant of the measured carrier (same coordinate space: origin at the carrier’s top-left, `x` right, `y` down, CSS pixels). Overlay computed `pointer-events` is `none`. An RTL test that clicks through the overlay region still hits a child control/target underneath (or `document.elementFromPoint` on the overlay’s box returns a non-overlay node).
- [ ] When measured width or height is `0`, negative, or non-finite (`NaN`, `±Infinity`): no inline or computed style string on Surface or Overlay contains `NaN`; overlay is hidden, unmounted, or otherwise inert (`pointer-events: none` and not painted as a construction); the test does not require catalog fixtures. Delivering a valid size after an invalid one via a second observer callback produces finite tracks and no `NaN` styles.
- [ ] When selected verticals and selected horizontals are both empty arrays (explicit override of the default `selectPowerLines` result), Surface uses a **1-cell** grid: one column track and one row track so children still show. The same 1-cell fallback applies if either axis has fewer than two finite line positions (so the template never has zero tracks). Children of Surface are ordinary CSS grid items (auto-placement is enough); a test renders at least one child and asserts it is a descendant of the grid and is not positioned by importing or calling Van De Graaf from the child.
- [ ] After the observer reports **800×400**, a second callback reports **640×320** (or another distinct positive size). Grid track sizes and overlay construction counts update to match `selectPowerLines` / `vanDeGraaf` for the **new** size (overlay does not stay stale). Catalog named SizeFrames and a catalog overlay toggle are **not** required for this assertion.
- [ ] `npm test` / `vitest run` exits 0 and includes RTL/unit coverage for: mocked positive size → selected-few tracks; overlay full-construction count + `pointer-events: none`; opt-in default off; nil/0/NaN styles; empty/degenerate selected set → 1-cell; observer size change. No catalog boot/E2E is required for this task.

## Out of Scope

- Catalog page composition, named SizeFrames (compact / standard / wide), catalog overlay toggle UI, and applying Van De Graaf to catalog document chrome — that is `catalog-composition`.
- Knob, Slider, dial size variant, parameter chrome, pointer/keyboard mapping — that is `knob-slider`. Do not implement those controls here; children in Surface tests may be plain DOM/`div` stand-ins.
- Changing `vanDeGraaf` / `selectPowerLines` math, epsilon, or half-height construction — that is already `van-de-graaf-geometry`.
- Grid authoring (drag lines, save grids), custom power-line editors, unbounded fluid editor resize as a product.
- Host/WebView/JUCE integration, extra widgets, Storybook, marketing site, a second theme.

## Constraints

- Architecture lock: `layout/Surface` measures the carrier and builds CSS grid from **selected** power lines; `layout/Overlay` is opt-in, draws **full** construction, `pointer-events: none`, same coordinate space as the carrier. Van De Graaf applies only to Surface, never to the catalog page.
- Overlay uses semantic `rule` (`--rule`). Do not couple layout to Knob/Slider or to geometry internals beyond the public construct/select APIs. Kit never imports `catalog/`.
- Catalog may later default overlay on; this task’s Surface API still defaults overlay **off**.
- Reuse existing Vitest + React Testing Library + jsdom. Mock `ResizeObserver` (jsdom does not have to drive real layout). Do not add a new runtime dependency for measuring or drawing.
- Existing public exports (Placeholder, Van De Graaf, `ThemeRoot`) stay; add Surface/Overlay beside them.

## Implementation Notes

Added `src/layout/Surface.tsx` and `src/layout/Overlay.tsx`, re-exported from `src/index.ts`. Surface observes its carrier with `ResizeObserver` (content box / `contentRect`) and sets CSS grid tracks to consecutive differences of `selectPowerLines` (or an explicit selected-line override). Overlay is opt-in (`overlay` default false), paints the full `vanDeGraaf` construction as SVG `line`s with `stroke: var(--rule)` and `pointer-events: none`, and is an absolutely positioned descendant of the carrier. Invalid sizes unmount the overlay and use a 1-track `1fr` template so styles never contain `NaN`; empty or <2 finite lines per axis also fall back to a single track. Tests mock `ResizeObserver` and deliver 800×400 / 640×320 plus invalid sizes. jsdom has no `elementFromPoint`, so click-through is asserted via computed `pointer-events: none` plus a hit helper that skips those nodes. `npm test` exits 0 (30 tests). Did not add Knob/Slider, catalog SizeFrames, or geometry-math changes.
