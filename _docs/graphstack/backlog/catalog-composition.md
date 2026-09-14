---
status: implemented
---

# Catalog composition on landscape frames

## Goal

The Vite catalog is a usable first consumer of the kit: GXSC-themed, short-landscape plugin Surfaces on named frames, with at least one knob and one slider on the Surface grid, and a construction overlay the user can toggle without leaving the carrier.

## Acceptance Criteria

- [ ] The documented Vite start script (`npm run dev` or equivalent) still serves the catalog. After start, an HTTP GET to the served origin returns **200**. The document is the catalog app under `catalog/` (not Storybook). The served (or RTL-rendered) page is no longer only the kit `Placeholder`: it contains at least one framed landscape `Surface`.
- [ ] Catalog application source composes the **existing** kit public API (`Surface`, `Overlay` via Surface’s overlay opt-in, `ThemeRoot`, `Knob`, `Slider`) imported through the kit public entry (`aether-kit` alias or `src/index.ts` / `src/index.tsx`). Catalog files do **not** deep-import `src/layout/*`, `src/controls/*`, `src/theme/*`, or `src/geometry/*`. Nothing under `src/` imports `catalog/`. This task does not reimplement those modules.
- [ ] At least one catalog source file loads kit CSS so the demo is not unstyled: either a side-effect import of the kit public entry (which already pulls GXSC/type CSS) **or** an explicit import of kit theme/type CSS. After render with that CSS applied (RTL may inject the same stylesheets if jsdom does not), a node inside a framed `Surface` has computed custom properties `--surface` and `--ink` defined (non-empty). The framed Surface is a descendant of `ThemeRoot` (or an equivalent host that applies class `aether-gxsc`).
- [ ] Catalog page chrome (the document around the frames: heading, fixture switcher, overlay toggle, page `<main>` / wrappers) is **not** a Van De Graaf carrier: those chrome nodes are not `data-aether="surface"` and do not call `vanDeGraaf` / `selectPowerLines`. Only embedded Surfaces are carriers. Named frames (`SizeFrame` or equivalent, living under `catalog/`) are fixed CSS width×height boxes; `Surface` fills the frame and remains the measured carrier.
- [ ] At least **two** of the three named short-landscape fixtures **compact**, **standard**, and **wide** are available as catalog constants. Each shipped fixture has **width > height** (landscape). The two (or three) sizes are pairwise distinct in width or height. Exact pixels are a Build choice (no Aether editor sizes exist in-repo). The user can select among the shipped named sizes (buttons, tabs, or equivalent with accessible names that include those fixture names).
- [ ] With a framed Surface mounted at a fixture size, an RTL test (mock `ResizeObserver` and deliver that frame’s content box, same pattern as Surface tests) asserts: (1) a `Surface` descendant exists (`data-aether="surface"` or the public `Surface` host); (2) at least one `Knob` and one `Slider` are **descendants of that Surface’s grid** (`data-aether="grid"` or the grid element); (3) each control’s accessible/text content includes a non-empty **name** and a finite **value** (unit may be present). No extra kit widget types (meters, XY, sequencers, clip launchers, toggles-as-kit-controls) appear on the faceplate.
- [ ] The catalog exposes a control to show and hide construction overlay (button, checkbox, or switch; accessible name includes **overlay**). Toggling it sets Surface’s existing overlay opt-in. Default may be on or off. When overlay is **on** and the observer has delivered a finite positive size: overlay nodes exist **inside the Surface carrier** (same coordinate space). When overlay is **off**: no construction overlay is painted (unmounted or not in the document), matching Surface’s opt-in contract.
- [ ] **Overlay stays in carrier bounds:** with overlay on and a mocked/delivered fixture size, the overlay element’s `getBoundingClientRect()` (or equivalent box) is contained in the Surface carrier’s rect (overlay `left/top ≥` carrier `left/top` and overlay `right/bottom ≤` carrier `right/bottom`, allowing 1px subpixel slack). Overlay is not a sibling of the page chrome that paints over the catalog document.
- [ ] **Overlay recomputes per frame:** after overlay is on, switching from one shipped named fixture to another (distinct size) and delivering the new content box via `ResizeObserver` updates overlay construction to match `vanDeGraaf(newWidth, newHeight)`: painted overlay piece count equals `diagonals.length + verticals.length + horizontals.length` for the **new** size (not the previous fixture). Grid tracks are not required to be re-asserted here beyond Surface already doing live measure.
- [ ] `npm test` / `vitest run` exits 0 and includes catalog-page coverage for: boots/composes framed Surface + GXSC tokens; ≥1 Knob + ≥1 Slider on the grid; overlay toggle on/off; overlay contained in the carrier; at least two named fixtures; overlay count updates after a fixture change. Verification is RTL of `CatalogPage` (jsdom + mocked `ResizeObserver`) and/or a catalog smoke/E2E plus source inspection of the CSS import and public-API-only imports. Do **not** add Storybook or Playwright unless already in the repo (it is not).

## Out of Scope

- Storybook, a public marketing site, a second catalog app, npm publish / library `dist/` as the milestone.
- JUCE, VST/AU shipping, DAW/WebView param bridge, DSP, host IDs, fake DAW chrome, or proving HiDPI/DAW focus.
- Extra widgets (meters, XY pads, sequencers, clip launchers, kit-level toggles/buttons). A catalog overlay toggle and fixture switcher are page chrome, not new kit widgets.
- Unbounded fluid editor resize as a product; custom power-line authoring; applying Van De Graaf to catalog page chrome.
- Reimplementing or changing `vanDeGraaf` / `selectPowerLines`, Surface/Overlay behavior, GXSC/type tokens, or Knob/Slider interaction contracts — those tasks are already implemented. Catalog only consumes them.
- Requiring all three named fixtures (two of compact / standard / wide is enough). Dial-size Knob on the faceplate is optional.

## Constraints

- Architecture lock: one library (`src/`) + one Vite catalog (`catalog/`). Catalog imports the kit public API; the kit never imports the catalog. Van De Graaf applies **only** to `Surface`, never to catalog document chrome.
- Compose existing `Surface`, `Overlay` (via Surface opt-in), `ThemeRoot`, `Knob`, `Slider`, and kit CSS. Do not add a new layout primitive, theme, or control type.
- Three named short-landscape frames are catalog constants; ship at least two. Overlay still recomputes from live carrier size (`ResizeObserver` already on Surface). Frames are fixed this milestone — do not productize freeform resize.
- Overlay is non-interactive (`pointer-events: none` already on Overlay) and must remain inside the carrier bounds.
- Reuse Vitest + React Testing Library + jsdom. Mock `ResizeObserver` for fixture sizes. Do not add Storybook, shadcn, JUCE, a fake host, or a new E2E framework as a requirement.
- Teenage Engineering influence is hardware grammar already in Knob/Slider; do not add TE logos, skins, or orange.

## Implementation Notes

Replaced the catalog `Placeholder` with a composed `CatalogPage`: `ThemeRoot` wraps a `SizeFrame` that fills with `Surface`, and the grid holds one `Knob` (Cutoff) and one `Slider` (Mix). Imports go through `aether-kit` only; `catalog/main.tsx` side-effect-imports the kit so GXSC/type CSS loads. Named fixtures `compact` (480×280), `standard` (640×320), and `wide` (800×400) live in `catalog/frames.ts`; chrome (heading, size buttons, overlay checkbox) is not a Van de Graaf carrier. Overlay defaults off and maps to Surface’s existing `overlay` prop. RTL tests mock `ResizeObserver` and inject theme CSS because jsdom does not inherit custom properties onto descendants. `Placeholder` remains exported from the kit but is not the catalog face. `npm test` exits 0 (52 tests).

Browser verification found Mix on implicit rows 4–6, clipped by `SizeFrame` overflow. Placement was moved to `gridRow: 2/3` (knob) and `3/4` (slider) so both sit inside selected tracks.
