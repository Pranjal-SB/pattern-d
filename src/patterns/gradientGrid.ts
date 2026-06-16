import { normalizeHex, safeModulo } from '../engine/color';
import { PatternModule } from '../engine/types';

function hexChannel(value: string, channelIndex: number): number {
  return Number.parseInt(value.slice(channelIndex, channelIndex + 2), 16);
}

export const gradientGridPattern: PatternModule = {
  id: 'gradientGrid',
  label: 'Gradient grid',
  params: [
    {
      key: 'tileSize',
      label: 'Tile size',
      min: 12,
      max: 200,
      step: 1,
      default: 48,
    },
  ],
  draw(ctx, config) {
    const tileSize = Math.max(1, Math.round(config.params.tileSize ?? 48));
    const colors = config.colors.map((color) => normalizeHex(color));

    for (let y = 0; y < config.height; y += tileSize) {
      for (let x = 0; x < config.width; x += tileSize) {
        const index = safeModulo(Math.floor(x / tileSize) + Math.floor(y / tileSize), colors.length);
        const base = colors[index].slice(1);
        const rgb = [
          hexChannel(base, 0),
          hexChannel(base, 2),
          hexChannel(base, 4),
        ];
        const gradient = ctx.createLinearGradient(x, y, x + tileSize, y + tileSize);
        gradient.addColorStop(0, `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
        gradient.addColorStop(1, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.4)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, tileSize, tileSize);
      }
    }
  },
};
