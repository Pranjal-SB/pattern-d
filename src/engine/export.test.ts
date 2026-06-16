import { describe, expect, it } from 'vitest';
import { createDefaultConfig } from '../state/config';
import { renderToBlob } from './export';

describe('export', () => {
  it('exports a png blob at a clamped size', async () => {
    const blob = await renderToBlob(createDefaultConfig(), 120);
    expect(blob.type).toBe('image/png');
  });
});
