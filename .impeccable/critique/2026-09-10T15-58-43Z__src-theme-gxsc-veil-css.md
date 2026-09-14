---
target: the animations
total_score: 23
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-09-10T15-58-43Z
slug: src-theme-gxsc-veil-css
---
# Critique: kit animations (veil + hits)

Target: `src/theme/gxsc/veil.css` (with `Veil.tsx`, `AsciiField.tsx`, hit hover in `src/controls/controls.css`)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Hits update immediately; the ASCII tick can be misread as the plugin working |
| 2 | Match System / Real World | 3 | Snap matches pocket hardware; 280ms ASCII ticker is terminal weather, not a desk lamp |
| 3 | User Control and Freedom | 2 | No catalog pause for the veil; reduced-motion is OS-only |
| 4 | Consistency and Standards | 3 | Hits share 0ms invert; atmosphere uses two clocks (280ms vs 48s) |
| 5 | Error Prevention | 2 | 0ms hover can flash like a press; double-click rest has no motion cue |
| 6 | Recognition Rather Than Recall | 3 | Rotor and latch are visible; the field moves without meaning |
| 7 | Flexibility and Efficiency | 2 | Instant drag is efficient; full-field React ticks while operating are tax |
| 8 | Aesthetic and Minimalist Design | 2 | Stills are disciplined; live, the field is the loudest moving thing |
| 9 | Error Recovery | 2 | Range clamp / double-click rest snap with no acknowledge |
| 10 | Help and Documentation | 1 | No story note of the two clocks or reduced-motion freeze |
| **Total** | | **23/40** | **Acceptable** |

## Design Specificity Verdict

**LLM assessment:** Authored, not interchangeable — with a split personality. VT323 density, Italianno flourish, mute grain, and a glacial wisp are Aether. Control motion is hardware-panel honesty: hover invert and rotor rotate with no CSS transition. DESIGN.md’s memorable moment is a *slow* veil behind haze. What actually reads as alive is an 80×36 sine field rewritten every 280ms. The 48s wisp is almost subliminal. Specific, but not yet one motion language.

**Deterministic scan:** `detect.mjs --json` on `src/theme/gxsc`, then `src/theme/gxsc` + `src/controls` + `catalog`: **0 findings**, exit 0. The 48s `aether-wisp-drift` keyframe (transform + reduced-motion `animation: none`) did not trip a rule.

**Visual overlays:** Injected on `[Human] Insert` (`http://127.0.0.1:61005/?story=faceplate--insert`). Overlay labels on the ~800×440 plate: cramped padding; tight line height / wide letter spacing; text occluded by an overlapping element; banner “overused font: Primary font: arial (57% of text)”. Treat as **false positives** for this motion critique (veil overlapping chrome is the world; Ladle chrome is Arial; Nunito tracking on labels is the type spec).

## Overall Impression

The still is a lamp-lit instrument. The live plate fidgets. Biggest opportunity: put the perceptible clock on the slow veil (or freeze the field as sculpture) and keep hits as the only fast motion.

## What's Working

1. **Hardware-true feedback.** Rotor, slider fill, pad latch, and readout follow `value` with no spin-wait — the right Operate contract for a WebView.
2. **Reduced-motion is real in code.** Wisp killed in CSS; AsciiField pauses on `prefers-reduced-motion`, `document.hidden`, and IntersectionObserver; veil is `aria-hidden`.
3. **Material, not a library preset.** Grain + mist + VT323 + flourish is one idea. Insert / Prism / Dial stills look like one designer.

## Priority Issues

**[P1] ASCII cadence contradicts “slow veil” and fights Operate**
- **Why it matters:** Users set Drive/Cutoff against a ~3.6 Hz background. The memorable motion is the ticker, not the mist.
- **Fix:** Slow the field to the wisp’s clock (rAF or ≥1–2s steps), or treat ASCII as a still sculpture. Keep 280ms only if the thesis is CRT.
- **Suggested command:** `/impeccable animate`

**[P1] Two motion dialects, unnamed**
- **Why it matters:** Atmosphere loops forever; hits are 0ms. Hover invert reads as a missing transition, not a rule.
- **Fix:** Name it in DESIGN.md (*hits snap; veil drifts*). If snap stays, keep `transition: none` on purpose. If Operate needs ack, 100–120ms color-only on hover — never on the rotor while dragging.
- **Suggested command:** `/impeccable document` then `/impeccable animate`

**[P2] Wisp loop is a sawtooth**
- **Why it matters:** `from` → `to` `linear infinite` jumps back to -2% at 48s.
- **Fix:** `alternate`, or a closed path that returns to origin.
- **Suggested command:** `/impeccable animate`

**[P2] Reduced-motion is not authorable in Ladle**
- **Why it matters:** Sam’s path exists in source; Seto cannot preview the freeze without OS settings.
- **Fix:** Story decorator or catalog control: veil on / still / reduced.
- **Suggested command:** `/impeccable harden`

**[P3] 0ms hover invert vs moss latch**
- **Why it matters:** Correct paints, harsh next to a ticking field; easy to read as a glitch.
- **Fix:** Same as the snap rule — either defend 0ms or add a short color-only fade.
- **Suggested command:** `/impeccable quieter`

## Persona Red Flags

**Alex (plugin designer / power user):** Instant drag is the win. The 280ms full-field React tick is unpaid tax during pointer capture. No inspector mute for the veil.

**Sam (a11y / reduced motion):** Pause logic is good. Live catalog offers no toggle. Screen readers skip `aria-hidden` veil; vestibular users still sit in a rewriting field.

**Seto in Ladle:** `SizeFrame` always mounts the veil. Isolated Dial makes the field *more* dominant. Wisp is only obvious in DevTools. No story documents the two clocks.

## Cognitive load

3 checklist failures (moderate): single focus, visual hierarchy, one thing at a time — all from the live field competing with hits.

## Emotional journey

Enter is strong (place, not loading). Intended peak is slow mist; actual peak is ASCII crawl. Operate drag is analog and confident. End never settles — last taste is restless weather.

## Minor Observations

- Grain, mist, and flourish are the actual slow scene.
- `data-grabbed` mute fill snaps like hover — consistent, slightly loud.
- IN/OUT meters sit still while the veil moves; they read as dead LEDs.
- Isolated stories make the field more dominant than Insert.
- `pointer-events: none` on the veil is correct.

## Questions to Consider

- If the memorable moment is “slow veil behind a hit,” why is the only perceptible clock 280ms?
- Should a plugin WebView animate when no parameter is changing?
- Would a still ASCII sculpture be more Aether, with motion reserved for latch/grab?
- Is 0ms invert a craft rule you would defend in a DAW?
- When reduced-motion freezes the field at frame 0, is that pose designed?
