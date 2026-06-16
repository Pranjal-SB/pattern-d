import { normalizeHex, safeModulo } from '../engine/color';
import { PatternModule } from '../engine/types';

export const stripesPattern: PatternModule = {
  id: 'stripes',
  label: 'Stripes',
  params: [
    {
      key: 'stripeWidth',
      label: 'Stripe width',
      min: 4,
      max: 160,
      step: 1,
      default: 32,
    },
    {
      key: 'angle',
      label: 'Angle step',
      min: 1,
      max: 12,
      step: 1,
      default: 2,
    },
  ],
  draw(ctx, config) {
    const stripeWidth = Math.max(1, Math.round(config.params.stripeWidth ?? 32));
    const angle = Math.max(1, Math.round(config.params.angle ?? 2));
    const colors = config.colors.map((color) => normalizeHex(color));

    for (let y = 0; y < config.height; y += 1) {
      const index = safeModulo(Math.floor((y + y / angle) / stripeWidth), colors.length);
      ctx.fillStyle = colors[index];
      ctx.fillRect(0, y, config.width, 1);
    }
  },
};
