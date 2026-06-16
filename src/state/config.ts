import { PatternConfig } from '../engine/types';

export const DEFAULT_PATTERN_SIZE = 720;

export function createDefaultConfig(): PatternConfig {
  return {
    type: 'checkerboard',
    colors: ['#7866F2', '#F4F1EA'],
    bgColor: '#0B1020',
    width: DEFAULT_PATTERN_SIZE,
    height: DEFAULT_PATTERN_SIZE,
    params: {
      tileSize: 48,
      radiusRatio: 0.33,
      hexSize: 60,
      stripeWidth: 32,
      angle: 2,
      amplitude: 24,
      frequency: 48,
    },
  };
}
