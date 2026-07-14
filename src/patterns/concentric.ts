import { normalizeHex, safeModulo } from '../engine/color';
import { PatternModule } from '../engine/types';

export const concentricPattern: PatternModule = {
  id: 'concentric',
  label: 'Concentric',
  params: [
    { key: 'spacing', label: 'Ring spacing', min: 4, max: 80, step: 1, default: 20 },
  ],
  draw(ctx, config) {
    const spacing = Math.max(2, Math.round(config.params.spacing ?? 20));
    const colors = config.colors.map((c) => normalizeHex(c));
    const cx = config.width / 2;
    const cy = config.height / 2;
    const maxR = Math.hypot(cx, cy);

    for (let r = maxR; r > 0; r -= spacing) {
      const idx = safeModulo(Math.floor(r / spacing), colors.length);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = colors[idx];
      ctx.fill();
    }
  },
};
