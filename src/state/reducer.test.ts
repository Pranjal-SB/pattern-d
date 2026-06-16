import { describe, expect, it } from 'vitest';
import { createDefaultConfig } from './config';
import { configReducer } from './reducer';

describe('configReducer', () => {
  it('resets params when switching patterns', () => {
    const next = configReducer(createDefaultConfig(), {
      type: 'set-pattern',
      patternType: 'waves',
      defaults: { amplitude: 24, frequency: 48 },
    });

    expect(next.type).toBe('waves');
    expect(next.params).toEqual({ amplitude: 24, frequency: 48 });
  });
});
