# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Web studio for generating tileable patterns (checkerboard, hex, polka, etc.) with live
controls and PNG export. Replaces the legacy Python/PIL scripts that required code edits.

## Stack

- React 18 + TypeScript + Vite
- Vitest + React Testing Library + jsdom
- Plain CSS with custom-property design tokens (light + dark themes)
- Client-side only. No backend. Static deploy.

## Commands

```bash
npm install
npm run dev        # Vite dev server
npm run build      # type-check + production build
npm run preview    # serve the build
npm test           # Vitest (all tests)
npx vitest run src/engine/render.test.ts   # single test file
npx vitest run --reporter=verbose          # verbose output
```

> `test:cov` and `lint` are not wired yet — no coverage or ESLint scripts in `package.json`.

## Architecture

**Engine / UI split is the core rule.** Pattern math is pure, framework-free TS so the
live preview and the export render share one source of truth.

- `src/engine/` — `renderPattern(ctx, config)`, types, color helpers (`safeModulo`, `normalizeHex`, `hexToRgb`/`rgbToHex`), and `renderToBlob` PNG export (256–6000 px, clamped).
- `src/patterns/` — one file per pattern, each exporting a `PatternModule` (`{ id, label, params, draw }`). Registered in `patterns/index.ts`. Currently: checkerboard, diagonal, polka, hexagons, stripes, triangles, waves, gradientGrid.
  **Add a pattern = add a file + register it.** UI (picker + sliders) updates from the registry; never hardcode per-pattern UI.
- `src/state/config.ts` — `createDefaultConfig()`, `DEFAULT_PATTERN_SIZE`. Source of truth for initial `PatternConfig` values.
- `src/state/reducer.ts` — `ConfigAction` union + `configReducer`. All mutations go through here; returns new objects.
- `src/state/context.tsx` — `ConfigProvider` (useReducer + localStorage under `patternd-config`), `useConfig()` hook.
- `src/state/theme.ts` — light/dark theme logic.
- `src/ui/` — `App`, `ControlPanel`, `PreviewStage` (canvas), `PaletteEditor`, `ParamSliders` (generated from active pattern's `params[]`), `ExportDialog`, `PatternPicker`, `ThemeToggle`.
- `src/presets/palettes.ts` — the 3 original Adobe 5-color schemes.
- `src/styles/` — `tokens.css` (theme vars), `global.css`.

Full design: `docs/superpowers/specs/2026-06-15-patternd-web-studio-design.md`.

## Pattern logic (root concept)

Every pattern is `colorIndex = f(gridPosition) % numColors`. Use `safeModulo` (not `%`) for
sign-safe results — critical for hex patterns. Ported faithfully from the legacy `generate_*.py`
scripts (see spec for per-pattern formulas and the two bug fixes vs `pattern_lab.html`: diagonal
banding and sign-safe hex modulo).

## Conventions

- Follow `~/.claude/rules/ecc/` (coding-style, web/*, testing, security).
- TypeScript: explicit types on exported fns; `PascalCase` components, `camelCase` vars, `UPPER_SNAKE_CASE` consts.
- Immutability: reducer returns new config objects, never mutates.
- Files small + focused (<800 lines; one pattern per file).
- Compositor-friendly motion only (`transform`/`opacity`); respect `prefers-reduced-motion`.

## Legacy (reference, not used by the app)

`old/generate_*.py`, `old/*.html`, and `old/*.png` are the original prototypes.
They are the source of the pattern math. Do not wire the app to them.
