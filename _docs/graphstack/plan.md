# Plan: Aether plugin UI design library

## Scope

**Mode: Hold Scope.** Think already locked the fuller day-one kit. Expanding would reopen JUCE, extra widgets, or a marketing site. Cutting would undo the explicit “not a one-knob playground” choice.

**In**

- Van De Graaf layout primitive from the live carrier size; controls/labels snap to a *selected* subset of power lines; catalog overlay inspects construction — not a grid authoring tool.
- One starter Gen X Soft Club theme as tokens (muted blues, greens, beiges, tans, greys, black), structured for a later swap, not a theme product.
- Type tokens: functional signage sans (Helvetica/subway lineage). Open substitute is the v1 ship; a licensed face is a later token swap.
- Knobs/dials and sliders with name, value, unit. Teenage Engineering *hardware grammar* (few types, large hits, color-as-function), not TE skins, logos, or assets. Dial is a knob size variant, not a second widget.
- One Vite-style catalog app as the first consumer: framed landscape plugin surfaces composing grid + theme + type + those controls.

**Out**

- JUCE, DAW/WebView param bridge, DSP, automation/gesture protocols, shipping a `.vst3` / `.component`.
- Extra widgets (meters, XY, sequencers, clip launchers, toggles/buttons).
- Public marketing site, Storybook as a second product, npm-into-an-existing-plugin as the first milestone.
- Unbounded fluid editor resize as a product; custom power-line authoring.

**Deferred**

- Second theme / dark–light pair.
- Additional control types, after the first set reads as one designer.
- Host-shaped parameter protocol, after a real plugin consumes the kit.

**Settled assumptions**

- Parameter contract: `value` / `onChange` plus `min`/`max`/`step`, name, unit. No host IDs.
- Catalog: one Vite app, not Storybook *and* a second app.
- Window frames: three named short-landscape fixtures (compact / standard / wide) as catalog constants, plus the catalog page around them. Overlay still recomputes from live carrier size.
- Font: ship an open functional sans under type tokens with a fallback stack; paid Helvetica-line licensing is not a requirement for v1.

**Premises**

- Van De Graaf on short landscape WebViews is unproven; half-height construction exists so tracks still appear. The overlay is how we see if it feels sparse — not a guarantee of “correct” book-canon look.
- GXSC palette + TE hardware grammar is a deliberate clash; cohesion is craft (tokens + control language), not more widgets.
- The catalog will not prove HiDPI or DAW focus; do not grow a fake host to pretend it does.

**Regret risk:** slightly “built more than we needed to learn” versus a one-control playground — accepted. Failure mode to avoid is turning the catalog/grid into a design tool.

## Architecture

**Shape:** one library (`src/`) + one catalog app (`catalog/`). Catalog imports the kit; the kit never imports the catalog.

```
catalog/                 Vite app
  CatalogPage            document chrome (not Van De Graaf)
  SizeFrame              named landscape fixtures
  → library public API

src/
  geometry/vanDeGraaf    pure (w,h) → construction
  layout/Surface         measures carrier; CSS grid from selected power lines
  layout/Overlay         opt-in construction drawing
  theme/gxsc             one token theme (CSS variables)
  type/tokens            functional sans scale
  controls/Knob          rotary + name/value/unit
  controls/Slider        linear + same chrome
```

Van De Graaf applies only to `Surface` (the plugin carrier). The catalog page is ordinary document layout that embeds framed surfaces.

**Construction (addresses sparse landscape):** for rectangle `(w,h)`: full-rect diagonals; half-width diagonals; half-height diagonals; intersections → unique epsilon-quantized `x`/`y` power lines. Overlay shows *all* lines; layout snaps to a *selected* subset (outer intersection box as margins + a small interior set). If the selected set is empty, Surface falls back to a 1-cell grid so content still shows.

**Theming:** primitive palette + semantic CSS variables (`bg`, `surface`, `ink`, `muted`, `rule`, `accent`). Components bind semantics only. Accent is a muted cool, not TE orange. `ink`/`muted` on `surface` must meet a contrast floor.

**Controls:** `Knob` (vertical-delta drag, DAW-standard; visual rotation follows value) and `Slider` (horizontal first). Keyboard arrows; Shift = finer step. Missing `onChange` = read-only. `min >= max` or non-finite `value` must not produce NaN or call `onChange` with NaN. Overlay is non-interactive (`pointer-events: none`) and lives inside Surface in the same coordinate space.

**Measure:** `ResizeObserver` on the carrier. Nil/zero/non-finite size: measuring box, no NaN tracks, overlay hidden/inert. Frames are fixed this milestone; measurement stays live so overlay cannot go stale.

**Coupling:** catalog → kit public API; Overlay → geometry + `rule` color; controls → semantic tokens only. Controls do **not** depend on Van De Graaf (placement is the parent grid). No host protocol.

### Data flow (happy / nil / empty / error)

**Grid:** measured `(w,h)` → `vanDeGraaf` → `selectPowerLines` → CSS tracks + overlay. Nil/0/NaN: no intersection math, no NaN styles.

**Theme/type:** `ThemeRoot` + CSS variables. Missing root: catalog still imports kit CSS. Missing var: fallback on the variable definition. Font 404: fallback stack + `font-display: swap`.

**Controls:** clamp + step → `onChange`. Empty name/unit: no `"undefined"` in the chrome.

## Test Matrix

| Area | Unit | Integration / E2E | Happy | Failure / edge |
|------|------|-------------------|-------|----------------|
| Van De Graaf geometry | Known sizes (square, ~2:1, ~2.5:1); epsilon uniqueness; select-few ⊆ all | — | Finite v/h lines, intersections inside rect | `w=0`/`h=0`/NaN → empty/safe, not NaN; at least one col and row when `w,h>0` |
| Surface + Overlay | Mocked size → track count; overlay line count matches construction; overlay not hittable | Catalog frame switch updates overlay in carrier bounds | Overlay matches carrier | 0 size: no NaN; overlay inert |
| GXSC + type tokens | Semantic vars defined; no TE orange in control CSS; `ink`/`muted` on `surface` contrast floor | — | Tokens inherited | Missing face → fallback still labeled |
| Knob + Slider | RTL: `onChange` clamped/stepped; chrome shows name/value/unit; arrows | — | Drag/keys update | No `onChange`: no throw; `min>=max` / NaN value: no NaN DOM or `onChange` |
| Catalog | — | Smoke: boots; framed Surface; ≥1 knob + ≥1 slider; overlay toggle | Two+ fixture sizes (or one + page) | Overlay stays in carrier bounds; no extra widgets/host |
