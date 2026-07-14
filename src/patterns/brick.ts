import { normalizeHex, safeModulo } from '../engine/color';
import { PatternModule } from '../engine/types';

export const brickPattern: PatternModule = {
  id: 'brick',
  label: 'Brick',
  params: [
    { key: 'brickWidth', label: 'Brick width', min: 20, max: 200, step: 1, default: 60 },
    { key: 'brickHeight', label: 'Brick height', min: 10, max: 120, step: 1, default: 30 },
  ],
  draw(ctx, config) {
    const bw = Math.max(8, Math.round(config.params.brickWidth ?? 60));
    const bh = Math.max(4, Math.round(config.params.brickHeight ?? 30));
    const gap = 2;
    const colors = config.colors.map((c) => normalizeHex(c));

    const rows = Math.ceil(config.height / bh) + 1;
    const cols = Math.ceil(config.width / bw) + 2;

    for (let row = 0; row < rows; row++) {
      const offsetX = row % 2 === 0 ? 0 : bw / 2;
      for (let col = -1; col < cols; col++) {
        const x = col * bw + offsetX;
        const y = row * bh;
        const idx = safeModulo(row + col, colors.length);
        ctx.fillStyle = colors[idx];
        ctx.fillRect(x + gap, y + gap, bw - gap * 2, bh - gap * 2);
      }
    }
  },
};
