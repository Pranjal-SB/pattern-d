import { hexToRgb, normalizeHex, safeModulo } from '../engine/color';
import { PatternModule } from '../engine/types';

export const wavesPattern: PatternModule = {
  id: 'waves',
  label: 'Waves',
  params: [
    {
      key: 'amplitude',
      label: 'Amplitude',
      min: 4,
      max: 80,
      step: 1,
      default: 24,
    },
    {
      key: 'frequency',
      label: 'Frequency (px)',
      min: 10,
      max: 200,
      step: 1,
      default: 80,
    },
  ],
  draw(ctx, config) {
    const amplitude = Math.max(1, config.params.amplitude ?? 24);
    const frequency = Math.max(1, config.params.frequency ?? 80);
    const rgbColors = config.colors.map((c) => hexToRgb(normalizeHex(c)));
    const bandWidth = amplitude * 2;

    const imageData = ctx.createImageData(config.width, config.height);
    const data = imageData.data;

    for (let y = 0; y < config.height; y++) {
      for (let x = 0; x < config.width; x++) {
        const offset = amplitude * Math.sin((x / frequency) * Math.PI * 2);
        const band = Math.floor((y + offset) / bandWidth);
        const idx = safeModulo(band, rgbColors.length);
        const [r, g, b] = rgbColors[idx];
        const i = (y * config.width + x) * 4;
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  },
};
