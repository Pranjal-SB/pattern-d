import { normalizeHex, safeModulo } from '../engine/color';
import { PatternModule } from '../engine/types';

const TILE_DEFAULT = 72;

export const polkaPattern: PatternModule = {
  id: 'polka',
  label: 'Polka dots',
  params: [
    {
      key: 'tileSize',
      label: 'Spacing',
      min: 12,
      max: 240,
      step: 1,
      default: TILE_DEFAULT,
    },
    {
      key: 'radiusRatio',
      label: 'Radius ratio',
      min: 0.1,
      max: 0.5,
      step: 0.01,
      default: 0.33,
    },
  ],
  draw(ctx, config) {
    const spacing = Math.max(1, Math.round(config.params.tileSize ?? TILE_DEFAULT));
    const radiusRatio = config.params.radiusRatio ?? 0.33;
    const radius = spacing * radiusRatio;
    const colors = config.colors.map((color) => normalizeHex(color));
    const background = colors[colors.length - 1];

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, config.width, config.height);

    for (let y = 0; y <= config.height + spacing; y += spacing) {
      for (let x = 0; x <= config.width + spacing; x += spacing) {
        const colorIndex = safeModulo(Math.floor(x / spacing) + Math.floor(y / spacing), colors.length - 1);
        ctx.beginPath();
        ctx.fillStyle = colors[colorIndex];
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },
};
