import { normalizeHex, safeModulo } from '../engine/color';
import { PatternModule } from '../engine/types';

const HEX_SIZE_DEFAULT = 60;

function drawHexagon(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
): void {
  ctx.beginPath();
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
}

export const hexagonPattern: PatternModule = {
  id: 'hex',
  label: 'Hexagons',
  params: [
    {
      key: 'hexSize',
      label: 'Hex size',
      min: 20,
      max: 160,
      step: 1,
      default: HEX_SIZE_DEFAULT,
    },
  ],
  draw(ctx, config) {
    const hexSize = Math.max(1, Math.round(config.params.hexSize ?? HEX_SIZE_DEFAULT));
    const colors = config.colors.map((color) => normalizeHex(color));
    const background = colors[colors.length - 1];
    const radius = hexSize;
    const hexHeight = Math.sqrt(3) * radius;
    const hexWidth = radius * 2;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, config.width, config.height);

    for (let row = -1; row < config.height / hexHeight + 2; row += 1) {
      for (let col = -1; col < config.width / (hexWidth * 0.75) + 2; col += 1) {
        const centerX = col * (hexWidth * 0.75);
        let centerY = row * hexHeight;
        if (safeModulo(col, 2) === 1) {
          centerY += hexHeight / 2;
        }

        const q = col;
        const r = row - Math.floor(col / 2);
        const colorIndex = safeModulo(q + r, colors.length);

        drawHexagon(ctx, centerX, centerY, radius);
        ctx.fillStyle = colors[colorIndex];
        ctx.fill();
        ctx.strokeStyle = background;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  },
};
