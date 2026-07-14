import { normalizeHex, safeModulo } from '../engine/color';
import { PatternModule } from '../engine/types';

export const crosshatchPattern: PatternModule = {
  id: 'crosshatch',
  label: 'Crosshatch',
  params: [
    { key: 'spacing', label: 'Spacing', min: 8, max: 80, step: 1, default: 32 },
    { key: 'lineWidth', label: 'Line width', min: 1, max: 12, step: 1, default: 2 },
  ],
  draw(ctx, config) {
    const spacing = Math.max(4, Math.round(config.params.spacing ?? 32));
    const lw = Math.max(1, Math.round(config.params.lineWidth ?? 2));
    const colors = config.colors.map((c) => normalizeHex(c));
    const diag = config.width + config.height;

    ctx.lineWidth = lw;
    ctx.lineCap = 'round';

    // direction 1: top-left to bottom-right
    for (let d = -config.height; d < config.width; d += spacing) {
      const idx = safeModulo(Math.floor(d / spacing), colors.length);
      ctx.beginPath();
      ctx.moveTo(Math.max(0, d), Math.max(0, -d));
      ctx.lineTo(Math.min(config.width, d + config.height), Math.min(config.height, config.height - d + config.width));
      ctx.strokeStyle = colors[idx];
      ctx.stroke();
    }

    // direction 2: bottom-left to top-right
    for (let d = 0; d < diag; d += spacing) {
      const idx = safeModulo(Math.floor(d / spacing) + colors.length / 2, colors.length);
      ctx.beginPath();
      ctx.moveTo(Math.max(0, d - config.height), Math.min(config.height, d));
      ctx.lineTo(Math.min(config.width, d), Math.max(0, d - config.width));
      ctx.strokeStyle = colors[idx];
      ctx.stroke();
    }
  },
};
