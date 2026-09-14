---
name: Aether
description: High-key mist on charcoal ink — moss when latched.
colors:
  fog: "#eef1f4"
  ink: "#2f3438"
  mute: "#5a6570"
  moss: "#4f6458"
typography:
  display:
    fontFamily: "Spectral, Iowan Old Style, Palatino, serif"
    fontSize: "2rem"
    fontWeight: 200
    fontStyle: normal
    lineHeight: 1.1
    letterSpacing: "0.01em"
  title:
    fontFamily: "Spectral, Iowan Old Style, Palatino, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    fontStyle: normal
    lineHeight: 1.15
    letterSpacing: "0.01em"
  body:
    fontFamily: "Spectral, Iowan Old Style, Palatino, serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    fontStyle: normal
    lineHeight: 1.15
    letterSpacing: "0.01em"
  label:
    fontFamily: "Spectral, Iowan Old Style, Palatino, serif"
    fontSize: "0.75rem"
    fontWeight: 600
    fontStyle: normal
    lineHeight: 1.1
    letterSpacing: "0.02em"
rounded:
  none: "0"
spacing:
  hair: "0.15rem"
  tight: "0.35rem"
  md: "0.75rem"
  stage: "0.85rem"
  xl: "1.15rem"
components:
  story-chip:
    backgroundColor: "{colors.fog}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.4rem 0.7rem"
    height: "2.75rem"
  story-chip-current:
    backgroundColor: "{colors.moss}"
    textColor: "{colors.fog}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.4rem 0.7rem"
    height: "2.75rem"
  pad:
    backgroundColor: "{colors.fog}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0"
    width: "2.75rem"
    height: "2.75rem"
  pad-pressed:
    backgroundColor: "{colors.moss}"
    textColor: "{colors.fog}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0"
    width: "2.75rem"
    height: "2.75rem"
  stepper-btn:
    backgroundColor: "{colors.fog}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0"
    width: "2.75rem"
    height: "2.75rem"
  nameplate:
    backgroundColor: "{colors.fog}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: "0.35rem 0.45rem 0.45rem"
  knob:
    backgroundColor: "{colors.fog}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "0"
    width: "108px"
    height: "108px"
  slider:
    backgroundColor: "{colors.fog}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0"
    width: "9rem"
    height: "1.5rem"
---

# Design System: Aether

## Overview

**Creative North Star: "Lamp Mist"**

The kit is mist and charcoal: fog ground, ink type, moss when latched. `ThemeRoot` carries glacial fog banks behind the plate — high-key air, not glyphs. Ladle hosts stories; it is not a second Aether skin.

**Key Characteristics:**

- Fog `#eef1f4`, ink `#2f3438`, mute `#5a6570`, moss `#4f6458`
- Spectral on kit chrome: old-style roman for a reading instrument. ExtraLight on the nameplate, Regular on values, SemiBold on pads. Not didone, not italic, not a script.
- One control type per Ladle story; Faceplate, Prism, and Hold are composed plates
- 44px (2.75rem) module and minimum on pads and stepper hits
- Two clocks: visible fog weather (CSS drift and bloom, 11–22s closed paths); 120ms color-only hit acknowledge. Rotors never interpolate while dragging.

## Colors

Honest primitives are fog, ink, mute, and moss. Legacy GXSC names (`paper`, `ice`, `pool`, `blue`, `grey`, `green`, `fluoro`, `black`) map to the same four paints so older CSS still resolves. `--gxsc-fluoro` is moss, not a fluorescent green.

### Primary
- **Moss**: latched pads, current story, rotors, slider fill, selection, caret. Invert is moss fill with fog type.

### Neutral
- **Fog**: page, surface, inverted type on moss.
- **Ink**: body type, 1px boxes, knob rings.
- **Mute**: captions, rest-story borders, cooler fog pockets, hover invert fill.

### Named Rules
**The Veil Rule.** Grey in the field is air density (soft banks of mist), not a second ink and not a glyph ramp.

**The Latch Rule.** Rest chrome is ink on fog. Moss is function: current story and latched-on only.

## Typography

**Display / body / label:** Spectral (OFL, Production Type), fallback `Iowan Old Style, Palatino, serif`

**Character:** Screen old-style. Even stress, open counters, roman only. Thinness comes from ExtraLight, not from razor hairlines or a lean.

### Hierarchy
- **Display** (200, 2rem, tracking 0.01em): nameplate model (`Hold`, `Prism`).
- **Title** (400, 1.25rem, tracking 0.01em): param values.
- **Name** (400, 0.9375rem, tracking 0.01em): param names.
- **Label** (600, 0.75rem, tracking 0.02em): units, pads, atmosphere chips.

### Named Rules
**The Reading-Face Rule.** One old-style roman on operate chrome. Do not restore Bodoni, Didot, Great Vibes, Italianno, Nunito, Pixelify Sans, IBM Plex, or VT323. Do not use italic as the brand voice.

## Layout

Ladle provides story navigation. Kit plates use a Swiss modular CSS Grid: columns `minmax(2.75rem, 1fr)`, gutter `0.35rem`. A row whose areas are only `name` is `minmax(2.75rem, auto)`; remaining rows share leftover height as `minmax(2.75rem, 1fr)`. Plugins supply named `areas`. Isolated kit stories declare a name + hit map. `Rail` is the kit stack for a column of params (Type/Clock, Bypass/Feedback, Mix)—not catalog CSS. Flush ThemeRoot children fill the SizeFrame so Surface `height: 100%` resolves. Fixture sizes: compact `560×400`, standard `800×440`, wide `1000×520`. Knob size stories use frames that fit the hit (`280×220` / `400×300` / `560×400`). Ladle chrome is not a plate carrier. The catalog page is fog; mist weather lives inside each SizeFrame. Kit knob defaults remain `2.75rem` / `6.75rem` / `10rem` (knob / dial / hero). Analog slider hits are `2.75rem` tall. Meters are a `2.75rem` column so captions like In stay whole. Full-range pointer travel is `280px`. On Hold, synced Time is a readout; Division pads are the clock. Catalog SizeFrame exposes **live / still / reduce** so Seto can freeze the veil or preview reduced motion without an OS setting.

## Elevation & Depth

Flat. No drop shadows. Depth is fog-bank density, lamp haze over the plate, and invert (moss fill) for latched states. Knob rings are inset 1px ink boxes. Hits and plates use fog mixed with transparent so the mist reads through.

### Named Rules
**The Flat-Field Rule.** Surfaces and chrome stay flat at rest. Depth is mist density, haze, or invert — never offset shadow.

**The Two-Clock Rule.** Fog banks drift on a glacial-but-visible clock (CSS transform and density loops at 11–22s, closed paths, lamp bloom breathing). Hits acknowledge with 120ms color-only invert (`--motion-hit`). Knob rotors never interpolate `transform` while dragging. Reduced motion and SizeFrame **still** freeze the banks as a sculpture and keep a shorter color ack (80ms).

## Shapes

Squares and 1px boxes. Radius is `0` on knobs, pads, steppers, story chips, and nameplates. Knob rotors are rectangles (`16% × 48%`) rotating from the bottom center. Slider tracks are 1px boxes `0.75rem` tall with a moss fill. No nine-slice frames. No Bayer tile.

### Named Rules
**The 1px Box Rule.** Hits are ink boxes on fog. Do not thicken the stroke into product chrome, and do not round the corners.

## Components

Hits invert on hover (fine pointer): mute fill, fog type, 120ms color-only. Focus-visible is a `3px` ink outline at `3px` offset. Selection is moss background, fog type.

### Buttons (story chips)
- **Shape:** square corners, 1px mute box, min-height `2.75rem`
- **Rest:** fog fill, ink type
- **Current:** moss fill, fog type; `aria-current` only (not also `aria-pressed`)
- **Story labels:** `[ Knob ]` form for kit stories; `Faceplate`, `Prism`, and `Hold` are stories. Pair remains a two-up inspect helper.
- **Skip link:** same label type; hidden until focus; targets `#story-heading`

### Pads
- **Shape:** `2.75rem` square (WCAG 2.2 AA target), 1px ink box
- **Rest:** fog fill, ink glyph
- **Pressed:** moss fill, fog glyph

### Cards / Containers
- **Nameplate:** 1px ink box on translucent fog
- **Size frame / plate:** Surface interior; modular grid only here; haze so the veil reads through the plate
- **Rail:** column of params in one Cell; sizes to the cell so Mix is not stacked below the clip
- **Catalog stage:** fog page in Ladle; mist weather is clipped to the SizeFrame plate, not the whole inspector pane

### Inputs / Fields
- **Knob:** square hit, inset 1px ink ring, square moss rotor. Sizes `knob` / `dial` / `hero`. Optional hidden numeric chrome and plugin-supplied end captions. Double-click restores the rest value; Home/End jump the range. Rotor rotation tracks `value` with no CSS transition.
- **Meter:** 1px ink box, moss fill from the bottom, generic `level` 0–1. Display, not a drag fader.
- **Slider:** transparent hit `2.75rem` tall, track `3.5–9rem` wide
- **Stepper:** two `2.75rem` square hits; ink chevrons at 16px, `currentColor` so hover invert stays readable
- **Readout:** param chrome with no hit — Hold Time in sync (Division pads are the clock)

### Navigation
Ladle’s sidebar is the story nav. Do not rebuild a second story row.

## Do's and Don'ts

### Do:
- **Do** isolate one control type per Ladle story, then treat Faceplate, Prism, and Hold as composed plates.
- **Do** draw hits as 1px ink boxes with square corners and 44px minimums on pads and steppers.
- **Do** use moss invert for latched pads.
- **Do** let mist drift slowly behind the plate; acknowledge hits in 120ms color; keep rotor drag analog-instant.

### Don't:
- **Don't** restore HyperCard menus, ice desks, teal-on-paper chips, phosphor-on-black terminals, IBM Plex, the retired ASCII catalog shell, or the VT323/Italianno veil.
- **Don't** use Teenage Engineering orange or treat `--gxsc-fluoro` as a neon green.
- **Don't** round rotors, pads, or chips, or add drop shadows.
- **Don't** restore Bodoni, Didot, Great Vibes, Italianno, Nunito, Pixelify Sans, IBM Plex, VT323, or italic-as-brand on chrome.
- **Don't** bring back Van de Graaf, power lines, or a construction overlay.
- **Don't** tick a glyph field like a CRT (no ~280ms full-field rewrite).
- **Don't** interpolate the knob rotor while dragging.
