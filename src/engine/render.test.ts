import { describe, expect, it } from 'vitest';
import { safeModulo } from './color';
import { renderPattern } from './render';
import { createDefaultConfig } from '../state/config';
import { getPatternModule, listPatternModules } from '../patterns';

function createMockContext() {
  const calls: string[] = [];
  const context = {
    calls,
    save: () => calls.push('save'),
    restore: () => calls.push('restore'),
    clearRect: (...args: unknown[]) => calls.push(`clearRect:${args.join(',')}`),
    fillRect: (...args: unknown[]) => calls.push(`fillRect:${args.join(',')}`),
    beginPath: () => calls.push('beginPath'),
    closePath: () => calls.push('closePath'),
    moveTo: (...args: unknown[]) => calls.push(`moveTo:${args.join(',')}`),
    lineTo: (...args: unknown[]) => calls.push(`lineTo:${args.join(',')}`),
    arc: (...args: unknown[]) => calls.push(`arc:${args.join(',')}`),
    fill: () => calls.push('fill'),
    stroke: () => calls.push('stroke'),
    createLinearGradient: () => ({
      addColorStop: () => undefined,
    }),
    createImageData: (w: number, h: number) => ({
      width: w, height: h,
      data: new Uint8ClampedArray(w * h * 4),
    }),
    putImageData: () => undefined,
    set fillStyle(_value: string) {
      calls.push('fillStyle');
    },
    set strokeStyle(_value: string) {
      calls.push('strokeStyle');
    },
    set lineWidth(_value: number) {
      calls.push('lineWidth');
    },
  };

  return context as unknown as CanvasRenderingContext2D;
}

describe('engine', () => {
  it('keeps modulo sign-safe', () => {
    expect(safeModulo(-1, 5)).toBe(4);
  });

  it('registers all pattern modules', () => {
    expect(listPatternModules().length).toBeGreaterThanOrEqual(4);
    expect(getPatternModule('checkerboard')).toBeDefined();
  });

  it('renders without throwing for the default config', () => {
    const ctx = createMockContext();
    expect(() => renderPattern(ctx, createDefaultConfig())).not.toThrow();
  });
});
