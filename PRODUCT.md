# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Seto is the primary user: the person designing and shipping Aether VST3/AU plugins. The job is to drop a plugin faceplate into a plugin WebView and have it already sit on a shared grid, theme, and control language so the line looks like one designer made it.

End users of those plugins feel the cohesion. They are not builders of this library.

## Product Purpose

Aether is a React UI kit for plugin WebViews, plus a catalog that shows the language in one place. It is not a specific plugin’s UI.

Success is that any Aether plugin can compose a faceplate from the same primitives and still look like one family — without inventing layout, knobs, color, or type per product.

## Positioning

The layout primitive is a Swiss modular grid: equal tracks whose module is the 44px (2.75rem) hit, with a tight gutter. Plugins place controls with CSS Grid named `areas` (or Cell column/row). That is hardware-panel / JUCE Grid thinking, not a book-page canon and not a 12-column bootstrap.

The control language is inspired by Teenage Engineering hardware: few types, large hits, color as function. Plugins should look like pocket hardware, not like a 1:1 clone of a TE product.

## Operating Context

UI always runs as React inside a plugin WebView. Native widget drawing is out of scope.

Use and evaluation of a **plugin faceplate** happen as if it were a physical pocket instrument on a desk under a lamp — not as a glass UI on a marketing site.

This repo’s first consumer is Ladle (`npm run dev`): kit stories in `catalog/*.stories.tsx`. Ladle is the inspector chrome. Named landscape Surfaces (compact / standard / wide) sit on Prism and Hold (and a Pair helper). Kit tokens and hits are the family language; Ladle is not a second plugin skin.

Fluoro-as-function on kit plates is the moss accent (latched / current), not Teenage Engineering product orange.

A real `.vst3` / `.component`, DAW host, and JUCE/WebView param bridge are not shipped from this repo.

## Capabilities and Constraints

Confirmed kit surface (public `aether-kit` entry): theme root; Surface/Cell modular grid; Nameplate and ControlBank; Knob (knob/dial/hero sizes, optional hidden readout and end captions), Slider, Pad, Stepper, Meter (generic 0–1 `level`) with generic `value` / `onChange`, name, unit, and formatters.

Controls must stay configurable building blocks. The catalog may compose a filter-like demo; the kit must not bake a specific plugin’s regions or parameter IDs as the only layout.

Out of this repo: DAW/host and JUCE wiring, audio DSP, automation/gesture protocols, extra widgets (XY pads, sequencers, clip launchers), a public marketing site.

Undecided: exact editor sizes vs resizable hosts beyond the catalog fixtures; whether a JUCE/WebView param contract ever lives here vs staying generic.

## Brand Commitments

Product name: Aether.

Scene (binding for shipped plugins): a physical pocket instrument under a desk lamp. Catalog inspector: Ladle. Materials on plates: 1px boxes and large hits. Color is function (moss when on), not decoration. No glassmorphism. No OP-1 clone.

Teenage Engineering: be inspired by their hardware. Do not clone any TE product 1:1. Do not use TE assets, logos, or product skins.

The 44px modular grid is the alignment guide for plugin panels. Theme and type are tokenized so a second theme can be swapped later — not a theme marketplace. Van de Graaf, power lines, and construction overlay are retired.

## Evidence on Hand

- Graphstack brief and plan under `_docs/graphstack/`
- Kit source under `src/`
- Ladle stories and plate compositions under `catalog/`
- No customer testimonials, press, plugin-store listings, or licensed marketing photography. Do not invent them.

## Product Principles

- One family of plugins, not one plugin’s faceplate.
- Controls sit on equal modules; they do not each own an irregular track.
- Few control types, fully parameterized (range, name, unit, format, interaction).
- Kit tokens and hits are one family; Ladle is the inspector around those hits, not a duplicate plugin UI.
- WebView is the runtime; host and DSP stay outside this kit.
- Cohesion is the product: a later delay or sampler should compose the same kit, not fork it.

## Accessibility & Inclusion

Kit controls aim for WCAG 2.2 AA (names, roles, keyboard, contrast on the starter theme). Plugin hosts may still constrain available chrome; that does not lower the kit’s target.
