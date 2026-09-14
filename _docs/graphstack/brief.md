# Brief: Aether plugin UI design library

## Problem

Aether plugins are about to get React/WebView UIs with nothing shared between them. Without a kit, each plugin will invent its own layout, knobs, colors, and type — and the line will not look like one designer made it.

This repo is greenfield. There is no current copy-paste kit, no existing plugin UI to extract from, and no third-party component library already in use.

## Target User

Seto: the person designing and shipping Aether VST3/AU plugins. The kit exists so *he* can drop a plugin faceplate into a WebView and have it already sit on-grid, on-theme, and on-control language. Plugin users feel the cohesion; they are not the builders of this library.

## Core Wedge

A React UI library plus a catalog page that shows the language in one place:

- A **Van De Graaf (golden canon) grid** as the layout primitive for plugin surfaces — diagonals and power lines derived from the carrier’s proportions, not a generic 12-column bootstrap. Controls and labels snap to selected power lines; the catalog can overlay the construction so the grid is inspectable.
- A **shared parameter-control set** inspired by Teenage Engineering *hardware* (OP-1 / Pocket Operator grammar): few control types, large hit targets, color used as function not decoration, playful rotary/slider affordances. First kit includes **dials/knobs and sliders** (and the chrome they need: value readout, parameter name, unit). Not a clone of TE products.
- **Color themes** in a Gen X Soft Club register instead of TE’s cream/orange: cool, muted blues, greens, beiges, tans, greys, and black; sterile-meets-organic; urban-minimal, not Y2K candy.
- **Type** that can carry both references: functional, signage-like sans (GXSC’s Helvetica/subway lineage) with TE-like small labels and tight hierarchy — locked as tokens, not one-off CSS in each plugin.

Deliberately out of this wedge: DAW/host and JUCE wiring, audio DSP, automation/gesture protocols, extra widgets (meters, XY pads, sequencers, clip launchers), a public marketing site, and shipping a real `.vst3`/`.component` from this repo. The catalog is the first consumer of the kit.

## Assumptions

- UI is always React inside a plugin WebView; native widget drawing is out of scope.
- One starter theme (GXSC palette) with tokens structured so a second theme can be swapped later — not a theme marketplace.
- Fonts will be licensed or open substitutes that *feel* like Helvetica/functional sans; exact faces are a Plan/Build choice.
- Van De Graaf is applied as Obys describes it: construct from diagonals, pick power lines, do not use every line. Plugin windows may not be book-page ratios; the grid must still derive from the actual WebView size.
- Inspiration, not reproduction: no TE assets, logos, or product skins.

## Open Questions

- Exact typefaces and whether we self-host them.
- Plugin window sizes/aspect ratios the grid must feel right on (fixed editor size vs resizable).
- How much of a parameter contract the controls assume (generic `value`/`onChange` vs a JUCE/WebView bridge in this repo).
- Whether the catalog is Storybook, a small Vite app, or both.
