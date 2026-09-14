---
status: implemented
---

# GXSC theme and type tokens

## Goal

The kit ships one Gen X Soft Club starter theme and a functional-sans type scale as CSS custom properties so later surfaces and controls bind to semantic tokens (`bg`, `surface`, `ink`, `muted`, `rule`, `accent`), not one-off hex.

## Acceptance Criteria

- [ ] Kit source includes a GXSC theme module at `src/theme/gxsc` (file or directory) and a type-token module at `src/type/tokens` (file or directory). The kit public entry (`src/index.ts` or `src/index.tsx`) re-exports a `ThemeRoot` React component (name may be equivalent) that applies the theme so descendants inherit the CSS variables. Importing the theme CSS (from the kit, without wrapping `ThemeRoot`) still defines every semantic variable below — `ThemeRoot` is not required for the variables to exist after the CSS is loaded.
- [ ] After that CSS is applied, computed style on a themed node (or `:root` / the ThemeRoot host) defines CSS custom properties named `--bg`, `--surface`, `--ink`, `--muted`, `--rule`, and `--accent`. Each semantic property’s value is a `var(...)` of a primitive custom property (or otherwise resolves through a named primitive layer). Primitive custom properties include at least one token in each of these GXSC registers: cool muted blue, cool muted green, beige or tan, grey, and black. Semantic values are not hardcoded one-off hex that bypass the primitive layer.
- [ ] A unit test resolves `--ink` and `--surface` and asserts WCAG 2.1 contrast ratio ≥ **4.5:1**. The same test resolves `--muted` and `--surface` and asserts contrast ratio ≥ **3.0:1**. The floor and the relative-luminance method are documented next to the assertion (comment in the test is enough). The test fails if either pair is below the floor.
- [ ] A unit test resolves `--accent` and asserts it is a muted cool (not Teenage Engineering orange): hue is not in the orange range **15°–50°** (CSS/HSL hue), **or** if hue falls in that range, chroma/saturation is low enough that it cannot read as TE hardware orange (saturation ≤ **25%**). Kit theme/type CSS and `src/theme` / `src/type` source contain no TE cream/orange product colors as token values (no `#ff6b00`, `#ff5c00`, `#ff6600`, `#f5e6d3`, `#faeeda`, or equivalent `rgb()`/`hsl()` of those).
- [ ] Type tokens exist as CSS custom properties covering: (1) a family token whose value is an open functional sans plus a fallback stack that ends in a generic `sans-serif`; (2) three size tokens for **name**, **value**, and **label** (three distinct `--*` names, values in `px` or `rem`); (3) at least one tracking / `letter-spacing` token; (4) at least two weight tokens (e.g. regular and medium/bold). If any `@font-face` is declared for the v1 face, it sets `font-display: swap` (or equivalent). The shipped v1 face is an open-licensed functional sans (OFL, Apache, MIT, or SIL); it is not a licensed Helvetica file.
- [ ] The documented test script (`npm test` / `vitest run`) exits 0 and includes the contrast and accent assertions above. `ThemeRoot` renders children (a trivial wrapper test is enough). No second theme module, theme-switcher API, or `data-theme` pair ships in this task.

## Out of Scope

- `layout/Surface`, Overlay painting, `ResizeObserver`, CSS grid tracks, and construction overlay — that is `surface-overlay`.
- Knob, Slider, dial size variant, parameter chrome (name / value / unit), pointer/keyboard mapping — that is `knob-slider`. Binding those controls to these tokens happens there, not here.
- Catalog page composition, named SizeFrames (compact / standard / wide), overlay toggle, and requiring the catalog demo to look like a plugin faceplate — that is `catalog-composition`.
- A second theme, dark/light pair, or theme-switcher product.
- Licensed Helvetica (or any paid Helvetica-line webfont) purchase or self-host; that is a later token swap.
- Van De Graaf geometry changes, extra widgets, JUCE/host wiring, Storybook, marketing site.

## Constraints

- Architecture lock: `src/theme/gxsc` (one token theme as CSS variables) and `src/type/tokens` (functional sans scale). Components later bind **semantics only**. Accent is muted cool, not TE orange. Palette register: cool muted blues, greens, beiges, tans, greys, black.
- One starter theme only. Structure primitives vs semantics so a later swap is possible; do not ship the second theme.
- Do not implement Surface, Overlay, Knob, or Slider in this task. Do not couple theme/type modules to `geometry/vanDeGraaf`.
- Kit never imports `catalog/`. Catalog may import kit CSS in a later task; this task must make that CSS importable from the kit.
- Use the existing Vitest runner. Prefer no new runtime dependency for contrast math (a small test helper is enough). Adding an open font file under the kit is allowed; do not add a webfont CDN as a required network dependency for tests.
- Existing public exports (`Placeholder`, Van De Graaf APIs) stay; add theme/type exports beside them.

## Implementation Notes

GXSC lives in `src/theme/gxsc` (`gxsc.css` primitives plus semantic `var()` aliases, `ThemeRoot` wrapper with class `aether-gxsc`). Type scale lives in `src/type/tokens` (IBM Plex Sans OFL woff2, `font-display: swap`, family/size/tracking/weight custom properties). Kit `src/index.ts` side-effect imports both so CSS variables exist without wrapping `ThemeRoot`, and re-exports `ThemeRoot` next to Placeholder and Van De Graaf. Contrast and accent checks use a WCAG 2.1 helper in `gxsc.test.tsx` (jsdom does not apply Vite-injected CSS, so the test injects the kit stylesheets). Did not add a second theme, `data-theme`, Surface/Overlay/Knob/Slider, shadcn, or catalog composition. `npm test` exits 0 (22 tests).
