import { normalizeHex, safeModulo } from '../engine/color';
import { PatternModule } from '../engine/types';

export const diamondPattern: PatternModule = {
  id: 'diamond',
  label: 'Diamond',
  params: [
    { key: 'size', label: 'Size', min: 16, max: 200, step: 1, default: 64 },
  ],
  draw(ctx, config) {
    const size = Math.max(8, Math.round(config.params.size ?? 64));
    const colors = config.colors.map((c) => normalizeHex(c));
    const d = size / 2;

    const cols = Math.ceil(config.width / size) + 2;
    const rows = Math.ceil(config.height / size) + 2;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const cx = col * size + (row % 2 === 0 ? 0 : d);
        const cy = row * d;
        const idx = safeModulo(col + row, colors.length);

        ctx.beginPath();
        ctx.moveTo(cx, cy - d);
        ctx.lineTo(cx + d, cy);
        ctx.lineTo(cx, cy + d);
        ctx.lineTo(cx - d, cy);
        ctx.closePath();
        ctx.fillStyle = colors[idx];
        ctx.fill();
      }
    }
  },
};
