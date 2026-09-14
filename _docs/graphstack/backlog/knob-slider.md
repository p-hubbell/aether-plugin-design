---
status: implemented
---

# Knob and Slider parameter controls

## Goal

The kit ships two Teenage Engineering hardware-grammar parameter controls — `Knob` (vertical-delta drag; dial is a size variant of the same control) and `Slider` (horizontal first) — with name, formatted value, and unit on a generic `value` / `onChange` contract, so a later catalog can place them on a Surface grid without the controls knowing Van De Graaf.

## Acceptance Criteria

- [ ] Kit source includes `src/controls/Knob` and `src/controls/Slider` (file or directory each). The kit public entry (`src/index.ts` or `src/index.tsx`) re-exports `Knob` and `Slider` (names may be equivalent). There is no second widget for a dial: dial is a size variant on `Knob` (prop such as `size="dial"` vs default/`"knob"`). Neither control module imports `geometry/vanDeGraaf`, `layout/Surface`, `layout/Overlay`, or `catalog/`.
- [ ] Public props on both controls include: `value` (number), optional `onChange` `(next: number) => void`, `min`, `max`, `step` (numbers), `name`, `unit` (strings), and optional `format` `(n: number) => string`. An RTL test renders each control with `name="Cutoff"`, `unit="Hz"`, `value={440}`, `min={0}`, `max={1000}`, `step={1}`, and a `format` that returns `"440.0"`; the control’s accessible/text content includes `Cutoff`, `440.0`, and `Hz` (exact substrings). A second render omits `format` and still shows a finite numeric representation of `440` (not `"NaN"`, not `"undefined"`).
- [ ] **Knob pointer:** with `min={0}`, `max={100}`, `step={1}`, `value={50}`, and a spy `onChange`, an RTL pointer sequence (`pointerDown` on the knob hit target, then `pointerMove` with a smaller `clientY` than the down position, then `pointerUp`) calls `onChange` with a number **greater than 50** and **≤ 100**. The same sequence with a **larger** `clientY` calls `onChange` with a number **less than 50** and **≥ 0**. A purely horizontal `clientX` change with **unchanged** `clientY` does not by itself move the value to the opposite side of 50 (vertical-delta mapping; horizontal-only drag is a no-op or negligible vs the vertical case). Every `onChange` argument is `Number.isFinite` and lies in `[min, max]`.
- [ ] **Slider pointer:** same numeric contract (`min={0}`, `max={100}`, `step={1}`, `value={50}`). Pointer drag that increases `clientX` (right) yields `onChange` **> 50**; decreasing `clientX` (left) yields `onChange` **< 50**. Orientation under test is **horizontal**. Every `onChange` argument is finite and in `[min, max]`.
- [ ] **Keyboard:** both controls expose a focusable slider-like target (`role="slider"` or equivalent that `getByRole('slider')` finds). With the same 0–100 / step 1 / value 50 setup: `ArrowUp` and `ArrowRight` each call `onChange` with **51**; `ArrowDown` and `ArrowLeft` each call `onChange` with **49**. From `value={100}`, `ArrowUp` does not call `onChange` with a number **> 100** (clamp). From `value={0}`, `ArrowDown` does not call `onChange` with a number **< 0**. With `{ shiftKey: true }`, the absolute change from 50 is **strictly smaller** than `step` (e.g. `step / 10` → `50.1` / `49.9`) and still finite and inside `[min, max]`. Shift-modified pointer drag on Knob (same pixel delta as a non-Shift drag, with `shiftKey: true`) produces a **smaller** value delta than without Shift when neither hit the clamp.
- [ ] **Stepping:** with `min={0}`, `max={10}`, `step={2}`, `value={0}`, `ArrowUp` calls `onChange` with **2** (not 1). Emitted values for this integer-step case are exact integers on the step grid (`min + n * step` for integer `n`), clamped to `[min, max]`.
- [ ] **Read-only:** omitting `onChange` does not throw when the control mounts, when pointer down/move/up fires, or when arrow keys fire on the focused slider. The chrome still shows the provided `value` after those events (controlled: the displayed number does not change because the parent never updates `value`).
- [ ] **Empty name/unit:** `name=""` and omitted `unit` (and the reverse: omitted `name`, `unit=""`) — the control’s `textContent` does not include the substring `undefined`. The numeric value chrome still appears (finite display of the given `value`).
- [ ] **Degenerate range / non-finite value:** separate RTL cases for (1) `min={10}`, `max={10}`; (2) `min={20}`, `max={10}`; (3) `value={Number.NaN}` with a valid `min < max`. After render and after pointer + keyboard interaction: no element’s `textContent` or relevant `style` / attribute string contains `NaN`; `onChange` is never invoked with a non-finite number (spy every call). Normalizing pointer position must not divide by zero (covered by these cases not throwing and not emitting `NaN`).
- [ ] **Dial size variant:** the same `Knob` component with the dial size produces a **larger** hit or visual box than the default knob size (compare `getBoundingClientRect().width` or height; dial > default). Interaction contract (vertical-delta, keys, chrome) is unchanged — not a second control type.
- [ ] **Tokens:** Knob and Slider color and type bind to existing semantic/type CSS variables only (`--ink`, `--muted`, `--surface`, `--accent`, `--rule`, `--bg`, and type tokens such as `--type-size-name` / `--type-size-value` / `--font-family`). Source under `src/controls` contains no hardcoded hex / `rgb()` / `hsl()` paint colors and no Teenage Engineering product orange. A test (file-read or rendered computed style under `ThemeRoot`) asserts chrome uses `var(--ink)` / `var(--muted)` (or computed values that come from those variables), not a one-off hex in the control stylesheet.
- [ ] **Motion:** the displayed name/value/unit update from props without waiting on a spin animation. If rotation/transform is used on the knob, it reflects the current `value` at rest (two values with `min < max` produce two different transforms or equivalent visual angles). The control remains usable with `prefers-reduced-motion: reduce` (value chrome still correct; no requirement that a looping spin run).
- [ ] `npm test` / `vitest run` exits 0 and includes RTL coverage for the pointer, keyboard/Shift, chrome, read-only, empty name/unit, and NaN/`min >= max` cases above. Catalog boot / E2E is **not** required for this task.

## Out of Scope

- Catalog page composition, named SizeFrames (compact / standard / wide), overlay toggle, and placing knobs/sliders on a framed Surface in the Vite app — that is `catalog-composition`. Do not add catalog fixtures or require a catalog smoke test here.
- Changing GXSC/type token values, `ThemeRoot`, Van De Graaf math, or Surface/Overlay behavior — those tasks already own that. Controls consume tokens; they do not restyle the theme module.
- Extra widgets (toggles, meters, XY pads, sequencers, clip launchers). A dedicated **vertical** slider product (second orientation API) unless it is unused in this task’s tests — ship horizontal Slider only.
- JUCE / host param IDs, DAW automation protocols, WebView bridges, TE logos/skins/assets, Storybook, marketing site, npm publish.
- Uncontrolled (`defaultValue`) mode, gesture-protocol libraries, and a public `Dial` widget that is a separate interaction model from `Knob`.

## Constraints

- Architecture lock: `src/controls/Knob` (rotary visual; **vertical-delta** drag, DAW-standard; rotation follows value) and `src/controls/Slider` (**horizontal** first) with the same chrome and value contract. Placement on the Van De Graaf grid is the parent’s job; controls **must not** import or call `vanDeGraaf` / `selectPowerLines`.
- Parameter contract is generic `value` / `onChange` plus `min` / `max` / `step`, `name`, `unit`, optional `format`. No host IDs.
- Bind color and type to **semantic tokens only** (and the existing type tokens). Accent is the muted cool from GXSC, not TE orange.
- Shift-drag and Shift-keys use a finer step than `step`. Prefer reduced-motion-safe visuals.
- Kit never imports `catalog/`. Do not couple controls to Overlay or Surface.
- Reuse existing Vitest + React Testing Library + jsdom. Pointer assertions use Testing Library / `fireEvent` pointer events (jsdom does not need a real plugin host). Do not add a new runtime dependency for gestures or knobs.
- Existing public exports (Placeholder, Van De Graaf, `ThemeRoot`, Surface, Overlay) stay; add Knob/Slider beside them.

## Implementation Notes

Added `src/controls/Knob.tsx` and `src/controls/Slider.tsx` (shared math/chrome/pointer-keyboard hook, CSS tokens only). Both are re-exported from `src/index.ts`. Knob drag is vertical-delta (up increases); Slider is horizontal (right increases). Dial is `size="dial"` on the same Knob (72px vs 40px hit). Shift uses `step / 10` for keys and a 0.1 pointer scale. Missing `onChange` is read-only. Degenerate `min >= max` and non-finite `value` skip divide-by-zero, never paint `NaN`, and never emit a non-finite `onChange`. Controls do not import vanDeGraaf, Surface, Overlay, or catalog. `npm test` exits 0 (46 tests).
