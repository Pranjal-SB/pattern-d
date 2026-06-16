# pattern'd TODO

## Status
The legacy prototype files now live in `old/`. The production app is implemented in `src/` around the spec in `docs/superpowers/specs/2026-06-15-patternd-web-studio-design.md`.

## Started
- Vite + React + TypeScript scaffold added.
- App shell, theme toggle, 3D floor toggle, preview canvas, and control rail are in place.
- Shared render engine, export path, palette editor, and pattern registry are wired up.
- Core patterns plus the remaining pattern stubs are implemented.
- Engine and UI smoke tests pass; production build succeeds.
- Palette reordering, background color editing, and safer hex text entry are in place.
- Pattern switching now resets to the selected module's default params.
- Root README documents setup and usage.
- Palette randomization is available alongside reorder and preset loading.

## Progress plan

### 1. Scaffold the app
- Done.

### 2. Build the engine
- Done.

### 3. Port the core patterns
- Done.

### 4. Add configuration state
- Done.

### 5. Build the control surface
- Done.

### 6. Finish export and preview parity
- Done.

### 7. Expand the pattern set
- Done.

### 8. Harden the app
- Done for engine/UI tests and production build verification.

## Deliverables
- Working desktop-first pattern studio.
- Live canvas preview.
- PNG export.
- Registry-driven pattern modules.
- Persisted theme and palette state.
- Test coverage for engine behavior and key UI flows.

## Notes
- `old/` is reference-only and should not be wired into the app.
- The app should stay client-side only.
- The render engine should remain framework-free so preview and export stay identical.
