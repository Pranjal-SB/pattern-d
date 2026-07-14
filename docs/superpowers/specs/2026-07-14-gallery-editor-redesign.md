# pattern'd — Gallery + Editor Redesign

**Date**: 2026-07-14
**Status**: approved

## Overview

Two-view architecture: Gallery (browse all patterns) and Editor (full-bleed pattern with floating controls). The pattern IS the page, not a sidebar widget.

## Views

### Gallery
- Grid of live canvas thumbnails (~200×200px), 3-col desktop / 2-col tablet / 1-col mobile
- Top bar: logo + theme toggle + "Randomize" button
- Click card → navigate to Editor for that pattern
- Hover: card elevates, label overlays

### Editor
- Full-viewport pattern canvas (fills available space, maintains 1:1 aspect, centered)
- Floating bottom control bar with:
  - Pattern switcher: horizontal scroll strip of small (48×48) pattern thumbnails
  - Expandable sections: Colors, Parameters, Export
- Back button (top-left) + Export button (top-right)
- Real-time canvas re-render on any param/color change
- Keyboard: Escape = back to gallery

## Routes
- `/` — Gallery
- `/edit/:patternId` — Editor (pattern ID in URL, persisted config in localStorage)

## Components

### New
- `GalleryPage` — grid of `PatternCard` components
- `PatternCard` — clickable canvas thumbnail + label overlay
- `EditorPage` — full-bleed canvas + `ControlBar`
- `ControlBar` — bottom overlay with pattern strip + expandable panels
- `PatternStrip` — horizontal scroll of mini pattern thumbnails

### Modified
- `App.tsx` — routing between Gallery/Editor
- `PatternPicker` — simplified to `PatternStrip` (horizontal thumbnails for editor)
- `PreviewStage` — removed, canvas renders directly in EditorPage

### Removed
- `ControlPanel` — replaced by ControlBar
- `PaletteEditor` — replaced by inline controls in ControlBar
- `ParamSliders` — replaced by inline controls in ControlBar
- `ExportDialog` — replaced by Export section in ControlBar

## Data flow
- Config lives in React Context (unchanged)
- Gallery reads config to render thumbnails with current palette
- Editor shares same config context
- URL param drives pattern type in Editor, localStorage persists config

## Transitions
- Gallery → Editor: CSS `view-transition` or `animate` from card position to full-screen
- Pattern switch within Editor: 200ms crossfade on canvas
- Control bar expand: 250ms ease-out slide-up

## Non-goals
- Pattern layers/combinations (future)
- SVG export (future)
- User accounts/saving (future)
- Mobile app (responsive web only)
