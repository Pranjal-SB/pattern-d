import { brickPattern } from './brick';
import { concentricPattern } from './concentric';
import { crosshatchPattern } from './crosshatch';
import { diamondPattern } from './diamond';
import { scalesPattern } from './scales';
import { zigzagPattern } from './zigzag';
import { checkerboardPattern } from './checkerboard';
import { diagonalPattern } from './diagonal';
import { gradientGridPattern } from './gradientGrid';
import { hexagonPattern } from './hexagons';
import { polkaPattern } from './polka';
import { stripesPattern } from './stripes';
import { trianglesPattern } from './triangles';
import { wavesPattern } from './waves';
import { PatternModule } from '../engine/types';

const PATTERN_MAP = new Map<string, PatternModule>([
  ['checkerboard', checkerboardPattern],
  ['brick', brickPattern],
  ['concentric', concentricPattern],
  ['crosshatch', crosshatchPattern],
  ['diagonal', diagonalPattern],
  ['diamond', diamondPattern],
  ['gradientGrid', gradientGridPattern],
  ['hex', hexagonPattern],
  ['polka', polkaPattern],
  ['scales', scalesPattern],
  ['stripes', stripesPattern],
  ['triangles', trianglesPattern],
  ['waves', wavesPattern],
  ['zigzag', zigzagPattern],
]);


export function getPatternModule(id: string): PatternModule | undefined {
  return PATTERN_MAP.get(id);
}

export function listPatternModules(): PatternModule[] {
  return Array.from(PATTERN_MAP.values());
}

export function getPatternDefaultParams(id: string): Record<string, number> {
  const module = getPatternModule(id);
  if (!module) {
    return {};
  }

  return module.params.reduce<Record<string, number>>((defaults, param) => {
    defaults[param.key] = param.default;
    return defaults;
  }, {});
}
