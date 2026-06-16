import { checkerboardPattern } from './checkerboard';
import { diagonalPattern } from './diagonal';
import { gradientGridPattern } from './gradientGrid';
import { hexagonPattern } from './hexagons';
import { polkaPattern } from './polka';
import { stripesPattern } from './stripes';
import { trianglesPattern } from './triangles';
import { wavesPattern } from './waves';
import { PatternModule } from '../engine/types';

const PATTERN_REGISTRY: PatternModule[] = [
  checkerboardPattern,
  diagonalPattern,
  polkaPattern,
  hexagonPattern,
  stripesPattern,
  trianglesPattern,
  wavesPattern,
  gradientGridPattern,
];

const PATTERN_MAP = new Map(PATTERN_REGISTRY.map((module) => [module.id, module] as const));

export function getPatternModule(id: string): PatternModule | undefined {
  return PATTERN_MAP.get(id);
}

export function listPatternModules(): PatternModule[] {
  return PATTERN_REGISTRY.slice();
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
