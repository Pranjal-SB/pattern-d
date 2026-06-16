import { useEffect, useState } from 'react';
import { PRESET_PALETTES } from '../presets/palettes';

interface PaletteEditorProps {
  colors: string[];
  bgColor: string;
  onChangeColor: (index: number, color: string) => void;
  onChangeBackground: (color: string) => void;
  onAddColor: (color: string) => void;
  onRemoveColor: (index: number) => void;
  onMoveColor: (fromIndex: number, toIndex: number) => void;
  onLoadPalette: (palette: string[]) => void;
  onRandomizePalette: () => void;
}

function PaletteRow({
  color,
  index,
  total,
  onChangeColor,
  onRemove,
  onMoveUp,
  onMoveDown,
  disabled,
}: {
  color: string;
  index: number;
  total: number;
  onChangeColor: (value: string) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  disabled: boolean;
}) {
  const [draft, setDraft] = useState(color);
  const [hexError, setHexError] = useState(false);

  useEffect(() => {
    setDraft(color);
    setHexError(false);
  }, [color]);

  function commit(value: string) {
    if (/^#?[0-9a-fA-F]{6}$/.test(value.trim())) {
      const normalized = value.trim().startsWith('#') ? value.trim() : `#${value.trim()}`;
      onChangeColor(normalized.toUpperCase());
      setHexError(false);
      return;
    }

    setHexError(true);
    setDraft(color);
  }

  return (
    <div className="palette-row">
      <input type="color" value={color} onChange={(e) => onChangeColor(e.target.value)} />
      <div className="palette-row__text">
        <input
          type="text"
          value={draft}
          aria-invalid={hexError}
          onChange={(e) => { setDraft(e.target.value); setHexError(false); }}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { commit(draft); e.currentTarget.blur(); }
          }}
        />
        {hexError && <span className="field-hint">Invalid hex — use #RRGGBB</span>}
      </div>
      <button className="btn-icon" type="button" onClick={onMoveUp} disabled={index === 0} aria-label="Move up">↑</button>
      <button className="btn-icon" type="button" onClick={onMoveDown} disabled={index === total - 1} aria-label="Move down">↓</button>
      <button className="btn-icon" type="button" onClick={onRemove} disabled={disabled} aria-label="Remove color">×</button>
    </div>
  );
}

export function PaletteEditor({
  colors,
  bgColor,
  onChangeBackground,
  onChangeColor,
  onAddColor,
  onRemoveColor,
  onMoveColor,
  onLoadPalette,
  onRandomizePalette,
}: PaletteEditorProps) {
  return (
    <div className="card">
      <p className="card-title">Colors</p>

      <div className="flex flex-col gap-2 mb-3">
        {colors.map((color, index) => (
          <PaletteRow
            key={`${color}-${index}`}
            color={color}
            index={index}
            total={colors.length}
            onChangeColor={(value) => onChangeColor(index, value)}
            onRemove={() => onRemoveColor(index)}
            onMoveUp={() => onMoveColor(index, index - 1)}
            onMoveDown={() => onMoveColor(index, index + 1)}
            disabled={colors.length <= 2}
          />
        ))}

        <div className="palette-row mt-1">
          <label className="field-label" style={{ margin: 0, alignSelf: 'center', fontSize: '0.78rem' }}>Background</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => onChangeBackground(e.target.value)}
            style={{ marginLeft: 'auto' }}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          className="btn btn-ghost"
          type="button"
          style={{ flex: 1 }}
          onClick={() => onAddColor(colors[colors.length - 1] ?? '#FFFFFF')}
        >
          + Add color
        </button>
        <button
          className="btn btn-ghost"
          type="button"
          style={{ flex: 1 }}
          onClick={onRandomizePalette}
        >
          ↺ Randomize
        </button>
      </div>

      <p className="card-title" style={{ marginBottom: 8 }}>Presets</p>
      <div className="flex gap-2">
        {PRESET_PALETTES.map((palette, index) => (
          <button
            key={`preset-${index}`}
            className="preset-swatch"
            type="button"
            onClick={() => onLoadPalette(palette)}
            title={`Load preset ${index + 1}`}
            aria-label={`Load preset palette ${index + 1}`}
          >
            {palette.map((color) => (
              <span key={color} style={{ background: color }} />
            ))}
          </button>
        ))}
      </div>
    </div>
  );
}
