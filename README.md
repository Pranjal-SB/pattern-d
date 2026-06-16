# pattern'd

Web studio for generating tileable patterns with live controls and PNG export.

## Stack

- React 18 + TypeScript + Vite
- Vitest + React Testing Library
- Client-side only

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm test
```

## What it does

- Preview patterns live on a canvas
- Edit palettes, background color, and per-pattern params
- Reorder and randomize palette slots
- Switch between light/dark themes
- Toggle a 3D floor-style preview
- Export PNGs from the same render engine used by preview

## Notes

- Legacy prototype files live in `old/` and are reference only.
- The render engine is shared between preview and export so output stays consistent.
