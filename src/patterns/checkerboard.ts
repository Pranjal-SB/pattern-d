import { normalizeHex, safeModulo } from '../engine/color';
import { PatternModule } from '../engine/types';

const TILE_DEFAULT = 48;

export const checkerboardPattern: PatternModule = {
  id: 'checkerboard',
  label: 'Checkerboard',
  params: [
    {
      key: 'tileSize',
      label: 'Tile size',
      min: 8,
      max: 240,
      step: 1,
      default: TILE_DEFAULT,
    },
  ],
  draw(ctx, config) {
    const tileSize = Math.max(1, Math.round(config.params.tileSize ?? TILE_DEFAULT));
    const colors = config.colors.map((color) => normalizeHex(color));

    for (let y = 0; y < config.height; y += tileSize) {
      for (let x = 0; x < config.width; x += tileSize) {
        const colorIndex = safeModulo(Math.floor(x / tileSize) + Math.floor(y / tileSize), colors.length);
        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(
          x,
          y,
          Math.min(tileSize, config.width - x),
          Math.min(tileSize, config.height - y),
        );
      }
    }
  },
};
