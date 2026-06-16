import { normalizeHex, safeModulo } from '../engine/color';
import { PatternModule } from '../engine/types';

export const trianglesPattern: PatternModule = {
  id: 'triangles',
  label: 'Triangles',
  params: [
    {
      key: 'tileSize',
      label: 'Side length',
      min: 12,
      max: 200,
      step: 1,
      default: 64,
    },
  ],
  draw(ctx, config) {
    const side = Math.max(8, Math.round(config.params.tileSize ?? 64));
    const colors = config.colors.map((color) => normalizeHex(color));
    // Height of an equilateral triangle with given side length
    const triH = (Math.sqrt(3) / 2) * side;
    const halfSide = side / 2;

    const cols = Math.ceil(config.width / halfSide) + 3;
    const rows = Math.ceil(config.height / triH) + 2;

    for (let r = -1; r < rows; r++) {
      const y0 = r * triH;
      const y1 = (r + 1) * triH;

      for (let c = -1; c < cols; c++) {
        const x0 = c * halfSide;
        const xM = (c + 1) * halfSide;
        const x1 = (c + 2) * halfSide;

        ctx.beginPath();
        if ((c + r) % 2 === 0) {
          // Up-pointing ▲
          ctx.moveTo(x0, y1);
          ctx.lineTo(xM, y0);
          ctx.lineTo(x1, y1);
        } else {
          // Down-pointing ▽
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y0);
          ctx.lineTo(xM, y1);
        }
        ctx.closePath();

        ctx.fillStyle = colors[safeModulo(c + r, colors.length)];
        ctx.fill();
      }
    }
  },
};
