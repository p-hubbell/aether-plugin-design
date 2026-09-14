---
status: implemented
---

# Scaffold React kit and Vite catalog

## Goal

The repo is a runnable React kit plus a Vite catalog so later tasks can land geometry, tokens, controls, and tests in the locked layout (`src/` library, `catalog/` app) without inventing a second product or a monorepo.

## Acceptance Criteria

- [ ] Repo-root directories `src/` (the kit) and `catalog/` (the Vite catalog) both exist. Kit application source lives under `src/`; catalog application source lives under `catalog/`.
- [ ] The kit has a public entry at `src/index.ts` or `src/index.tsx` that exports at least one named symbol. That export (and anything it re-exports) is a placeholder only: it is not Van De Graaf geometry, not GXSC/type tokens, and not Surface, Overlay, Knob, or Slider.
- [ ] `catalog/` is a Vite + React app. A script in the root or catalog `package.json` starts it; after start, an HTTP GET to the served origin returns 200.
- [ ] The served catalog page DOM includes output that comes from the kit public export (the placeholder appears as visible text or a rendered element).
- [ ] At least one catalog source file imports the kit through that public entry (path alias or import that resolves to `src/index.ts` / `src/index.tsx`), not through a deep import of a future geometry/theme/control module.
- [ ] No file under `src/` imports `catalog/` (no module specifier that points at the catalog app).
- [ ] Kit and catalog application source is TypeScript (`.ts` / `.tsx`).
- [ ] A unit test runner is wired with React Testing Library. The documented test script exits 0 and includes at least one test that imports the kit public entry (a trivial assertion on the placeholder is enough).
- [ ] There is no Storybook app or `.storybook/` config, no shadcn `components.json` / `@/components/ui` registry, no `turbo.json`, and no package-manager workspace that splits kit and catalog into separate packages.

## Out of Scope

- Van De Graaf construction, power-line selection, Surface, Overlay, and named landscape SizeFrames.
- GXSC palette, semantic CSS variables, type tokens, and ThemeRoot.
- Knob, Slider, and parameter chrome (name / value / unit).
- Catalog composition of framed plugin surfaces, overlay toggle, and fixture sizes (compact / standard / wide).
- Library `dist/` / npm publish, a public marketing site, JUCE or any plugin host, DSP, and extra widgets.

## Constraints

- Architecture lock: one library at `src/` + one Vite catalog at `catalog/`. Catalog imports the kit; the kit never imports the catalog.
- One Vite-style catalog only. Do not add Storybook as a second product.
- Do not add turborepo or a multi-package workspace; the plan does not ask for a monorepo.
- Do not add shadcn/ui.
- Do not add JUCE, CMake plugin trees, or a fake DAW host.
- Catalog may consume kit source via the public entry; do not build a publish pipeline in this task.
- Placeholders are allowed only so the catalog can import and boot; do not implement later-task modules early.

## Implementation Notes

Single-package scaffold: kit under `src/` (`Placeholder` + `PLACEHOLDER_LABEL` via `src/index.ts`), Vite catalog under `catalog/` with `root` set to that directory. Catalog imports `aether-kit` (alias to the public entry); nothing under `src/` imports `catalog/`. Root scripts: `dev` → Vite, `test` → `vitest run` with RTL/`jsdom`. `npm test` exits 0; a GET to the Vite origin returned 200. Did not add Storybook, shadcn, workspaces, JUCE, or later-task modules. TypeScript is `~5.9` rather than the create-vite template’s `~6` so the toolchain stays on a current stable compiler.
