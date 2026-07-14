import { normalizeHex, safeModulo } from '../engine/color';
import { PatternModule } from '../engine/types';

export const zigzagPattern: PatternModule = {
  id: 'zigzag',
  label: 'Zigzag',
  params: [
    { key: 'amplitude', label: 'Amplitude', min: 8, max: 80, step: 1, default: 30 },
    { key: 'width', label: 'Band height', min: 8, max: 120, step: 1, default: 40 },
  ],
  draw(ctx, config) {
    const amp = Math.max(4, Math.round(config.params.amplitude ?? 30));
    const bandH = Math.max(4, Math.round(config.params.width ?? 40));
    const colors = config.colors.map((c) => normalizeHex(c));
    const period = amp * 2;

    for (let x = 0; x < config.width; x++) {
      const phase = (x % period) / period;
      const yOffset = phase < 0.5 ? phase * 2 * amp : (1 - phase) * 2 * amp;

      let y = -yOffset;
      let band = 0;
      while (y < config.height) {
        const y0 = Math.max(0, y);
        const y1 = Math.min(y + bandH, config.height);
        if (y1 > y0) {
          ctx.fillStyle = colors[safeModulo(band, colors.length)];
          ctx.fillRect(x, y0, 1, y1 - y0);
        }
        y += bandH;
        band++;
      }
    }
  },
};
