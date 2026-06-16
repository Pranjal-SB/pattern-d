import { PatternConfig } from './types';
import { getPatternModule } from '../patterns';
import { normalizeHex } from './color';

export function renderPattern(ctx: CanvasRenderingContext2D, config: PatternConfig): void {
  const module = getPatternModule(config.type);

  ctx.save();
  ctx.clearRect(0, 0, config.width, config.height);
  ctx.fillStyle = normalizeHex(config.bgColor);
  ctx.fillRect(0, 0, config.width, config.height);

  if (module) {
    module.draw(ctx, config);
  }

  ctx.restore();
}
