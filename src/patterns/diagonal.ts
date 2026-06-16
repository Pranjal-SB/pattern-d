import { normalizeHex, safeModulo } from '../engine/color';
import { PatternModule } from '../engine/types';

const TILE_DEFAULT = 48;

export const diagonalPattern: PatternModule = {
  id: 'diagonal',
  label: 'Diagonal',
  params: [
    {
      key: 'tileSize',
      label: 'Band size',
      min: 8,
      max: 240,
      step: 1,
      default: TILE_DEFAULT,
    },
  ],
  draw(ctx, config) {
    const tileSize = Math.max(1, Math.round(config.params.tileSize ?? TILE_DEFAULT));
    const colors = config.colors.map((color) => normalizeHex(color));

    for (let y = 0; y < config.height; y += 1) {
      let x = 0;

      while (x < config.width) {
        const colorIndex = safeModulo(Math.floor((x + y) / tileSize), colors.length);
        const offset = (x + y) % tileSize;
        const run = Math.min(tileSize - offset, config.width - x);

        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(x, y, run, 1);
        x += run;
      }
    }
  },
};
