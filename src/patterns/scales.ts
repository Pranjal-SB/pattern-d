import { normalizeHex, safeModulo } from '../engine/color';
import { PatternModule } from '../engine/types';

export const scalesPattern: PatternModule = {
  id: 'scales',
  label: 'Scales',
  params: [
    { key: 'scaleSize', label: 'Scale size', min: 16, max: 120, step: 1, default: 48 },
  ],
  draw(ctx, config) {
    const size = Math.max(8, Math.round(config.params.scaleSize ?? 48));
    const colors = config.colors.map((c) => normalizeHex(c));
    const r = size / 2;
    const cols = Math.ceil(config.width / size) + 2;
    const rows = Math.ceil(config.height / (size * 0.75)) + 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cx = col * size + (row % 2 === 0 ? 0 : r);
        const cy = row * size * 0.75;
        const idx = safeModulo(col + row, colors.length);

        ctx.beginPath();
        ctx.arc(cx, cy + r * 0.2, r, Math.PI, 0);
        ctx.closePath();
        ctx.fillStyle = colors[idx];
        ctx.fill();
        ctx.strokeStyle = colors[safeModulo(idx + 1, colors.length)];
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
  },
};
