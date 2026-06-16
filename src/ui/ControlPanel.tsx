import type { Dispatch } from 'react';
import { PatternConfig } from '../engine/types';
import { getPatternDefaultParams, getPatternModule } from '../patterns';
import { ConfigAction } from '../state/reducer';
import { PaletteEditor } from './PaletteEditor';
import { PatternPicker } from './PatternPicker';
import { ParamSliders } from './ParamSliders';
import { ExportDialog } from './ExportDialog';

function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (toIndex < 0 || toIndex >= items.length) {
    return items;
  }

  const next = items.slice();
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

function randomPalette(size: number): string[] {
  return Array.from({ length: size }, (_, index) => {
    const seed = Math.floor(Math.random() * 0xffffff);
    const offset = Math.round((index / Math.max(1, size - 1)) * 0x3f);
    return `#${((seed + offset) & 0xffffff).toString(16).padStart(6, '0').toUpperCase()}`;
  });
}

interface ControlPanelProps {
  config: PatternConfig;
  dispatch: Dispatch<ConfigAction>;
}

export function ControlPanel({ config, dispatch }: ControlPanelProps) {
  const pattern = getPatternModule(config.type);

  return (
    <div className="flex flex-col gap-3">
      <div className="card">
        <p className="card-title">Pattern</p>
        <PatternPicker
          value={config.type}
          onChange={(patternType) =>
            dispatch({
              type: 'set-pattern',
              patternType,
              defaults: getPatternDefaultParams(patternType),
            })
          }
        />
      </div>

      <PaletteEditor
        colors={config.colors}
        bgColor={config.bgColor}
        onChangeColor={(index, color) => dispatch({ type: 'set-color', index, color })}
        onChangeBackground={(color) => dispatch({ type: 'set-bg-color', color })}
        onAddColor={(color) => dispatch({ type: 'add-color', color })}
        onRemoveColor={(index) => dispatch({ type: 'remove-color', index })}
        onMoveColor={(fromIndex, toIndex) => {
          dispatch({
            type: 'reset',
            config: { ...config, colors: moveItem(config.colors, fromIndex, toIndex) },
          });
        }}
        onLoadPalette={(palette) => {
          dispatch({ type: 'reset', config: { ...config, colors: palette.slice() } });
        }}
        onRandomizePalette={() => {
          dispatch({ type: 'reset', config: { ...config, colors: randomPalette(config.colors.length) } });
        }}
      />

      {pattern && pattern.params.length > 0 && (
        <div className="card">
          <p className="card-title">Parameters</p>
          <ParamSliders
            params={pattern.params}
            config={config}
            onChange={(key, value) => dispatch({ type: 'set-param', key, value })}
          />
        </div>
      )}

      <div className="card">
        <p className="card-title">Canvas size</p>
        <div className="flex gap-2">
          <div className="field flex-1">
            <label className="field-label" htmlFor="canvas-width">W</label>
            <input
              id="canvas-width"
              type="number"
              min={128}
              max={4000}
              value={config.width}
              onChange={(e) => dispatch({ type: 'set-size', dimension: 'width', value: Number(e.target.value) })}
            />
          </div>
          <div className="field flex-1">
            <label className="field-label" htmlFor="canvas-height">H</label>
            <input
              id="canvas-height"
              type="number"
              min={128}
              max={4000}
              value={config.height}
              onChange={(e) => dispatch({ type: 'set-size', dimension: 'height', value: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <ExportDialog config={config} />
    </div>
  );
}
