# pattern'd — Web Studio Design Spec

**Date:** 2026-06-15
**Status:** Approved (design), pending implementation plan

## Problem

The project currently generates tileable patterns via hardcoded Python/PIL scripts
(`generate_*.py`). Every change — colors, pattern type, tile size — means editing code
and re-running a script to produce a 2000×2000 PNG. There is a rough proof-of-concept
(`pattern_lab.html`) but it is a single buggy file.

Goal: a clean, polished **web studio** where all of that is driven by UI controls —
pick colors, pattern type, size, and per-pattern parameters; preview live; export a PNG.
No code editing.

## Root logic (ported from the Python scripts)

Every pattern reduces to: `colorIndex = f(gridPosition) % numColors`.

| Pattern | Index logic (from source) |
|---|---|
| Checkerboard | `(gridX + gridY) % n` — `generate_checkerboard.py` |
| Diagonal | `floor((x + y) / tile) % n` — `generate_new_shapes.py:generate_diagonal` |
| Polka dots | dots on bg color; `(gridX + gridY) % (n-1)` — `generate_new_shapes.py:generate_polka_dots` |
| Hexagons | pointy-top grid, axial `q=col`, `r=row-floor(col/2)`, `(q+r) % n` — `generate_hex_pattern.py` |

Hardcoded palettes were 5-color Adobe schemes. These become **preset palettes** in the app.

The two ports faithfully fix bugs present in `pattern_lab.html`:
- Diagonal currently fills with a `size`-stepped grid that distorts the 45° banding; the
  port matches the Python `floor((x+y)/tile)` banding.
- Hex coloring used `Math.abs(q+r)` which breaks the modulo cycle for negative sums; the
  port uses a sign-safe modulo `((q+r) % n + n) % n`.

## Stack

- **React + TypeScript + Vite** — client-side only, no backend.
- **Vitest + React Testing Library** — engine unit tests + UI smoke tests.
- Static deploy (any host: Vercel/Netlify/GitHub Pages).

## Architecture

The key boundary is **engine vs UI**. The math is pure and framework-free so the live
preview and the export render share one source of truth.

```
src/
  engine/
    render.ts        # renderPattern(ctx, config) — dispatch by config.type
    types.ts         # PatternConfig, PatternModule, ParamSpec
    color.ts         # hex<->rgb, palette helpers, sign-safe modulo
    export.ts        # renderToBlob(config, resolution) -> PNG blob (offscreen canvas)
  patterns/
    checkerboard.ts  # each: { id, label, draw(ctx, cfg), params: ParamSpec[] }
    diagonal.ts
    polka.ts
    hexagons.ts
    stripes.ts
    triangles.ts
    waves.ts
    gradientGrid.ts
    index.ts         # registry: id -> PatternModule
  state/
    config.ts        # PatternConfig type + defaults
    reducer.ts       # useReducer actions (setType, setColor, addColor, ...)
    context.tsx      # ConfigProvider + useConfig hook; localStorage persistence
  ui/
    App.tsx
    ControlPanel.tsx
    PreviewStage.tsx     # canvas + optional 3D floor mode
    PatternPicker.tsx
    PaletteEditor.tsx    # add/remove/reorder/hex-paste/randomize + presets
    ParamSliders.tsx     # generated from active pattern's params[]
    ExportDialog.tsx     # resolution choice -> download
    ThemeToggle.tsx
  styles/
    tokens.css       # CSS custom props: light + dark themes
    global.css
  presets/
    palettes.ts      # the 3 original Adobe schemes
```

### Pattern module contract

```ts
interface ParamSpec {
  key: string;          // e.g. "tileSize", "amplitude"
  label: string;
  min: number; max: number; step: number;
  default: number;
}

interface PatternModule {
  id: string;           // "checkerboard"
  label: string;        // "Checkerboard"
  params: ParamSpec[];  // drives ParamSliders dynamically
  draw(ctx: CanvasRenderingContext2D, cfg: PatternConfig): void;
}
```

Adding a pattern = add one file + register it. The slider panel and picker update
automatically from the registry. No hardcoded per-pattern UI.

### PatternConfig

```ts
interface PatternConfig {
  type: string;              // pattern id
  colors: string[];          // hex, length n >= 2
  bgColor: string;           // for polka / patterns needing a base
  width: number;             // canvas logical size (default 2000)
  height: number;
  params: Record<string, number>;  // per-pattern values keyed by ParamSpec.key
}
```

## Data flow

1. UI control → `dispatch(action)` → reducer returns new `PatternConfig`.
2. `PreviewStage` `useEffect([config])` calls `renderPattern(ctx, config)` on the visible canvas (downscaled via CSS).
3. Config persisted to `localStorage` on change; rehydrated on load.
4. **Export**: `ExportDialog` clones config with chosen resolution → `renderToBlob` draws to a detached canvas → `canvas.toBlob` → object URL → anchor download. Same engine, so download == preview.

## Features (in scope)

- **Colors**: preset palettes (3 Adobe schemes), add/remove/reorder slots, hex paste, randomize. Count feeds `% n` live.
- **Pattern types**: 8 (original 4 + stripes, triangles, waves, gradientGrid).
- **Per-pattern params**: dynamic sliders (e.g. polka radius ratio, wave amplitude/frequency, hex size).
- **Tile/scale**: size control.
- **Export PNG**: choose resolution (1000–4000px), download.
- **3D floor preview**: optional CSS perspective + animated drift (from the demos), `prefers-reduced-motion` respected.
- **Theme**: light + dark, toggle, persisted; both designed intentionally.

## Out of scope (YAGNI)

- Shareable URL / copy-CSS snippet.
- Backend, accounts, saving to cloud.
- SVG export, animation export (GIF/video).
- Mobile-first layout (responsive-friendly, but desktop studio is primary).

## Error handling

- Invalid hex on paste → ignored, slot keeps last valid value, inline hint.
- `colors.length < 2` blocked (min 2 enforced in reducer).
- Export resolution clamped to [256, 6000] to avoid OOM canvases.
- Canvas context null → surfaced as a non-blocking error banner.

## Testing

- **Engine (primary, 80%+):** pure-function tests on each pattern's index logic and
  determinism — same config → same pixel sampling. Sign-safe modulo edge cases. Color
  conversion round-trips.
- **UI smoke (RTL):** panel renders, changing pattern updates param sliders, add/remove
  color updates state, theme toggle flips the attribute.

## UI direction

Dark "studio" by default (canvas-first, purple accent `#7866F2` carried from the source,
big preview, left control rail) and a light "editorial" mode. Theme is a deliberate pair,
not an auto-invert. Compositor-friendly motion only.
