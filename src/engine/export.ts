import { renderPattern } from './render';
import { clamp } from './color';
import { PatternConfig } from './types';

export const MIN_EXPORT_SIZE = 256;
export const MAX_EXPORT_SIZE = 6000;

export async function renderToBlob(config: PatternConfig, size: number): Promise<Blob> {
  const exportSize = clamp(Math.round(size), MIN_EXPORT_SIZE, MAX_EXPORT_SIZE);
  const canvas = document.createElement('canvas');
  canvas.width = exportSize;
  canvas.height = exportSize;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to acquire 2D canvas context');
  }

  const scaledConfig: PatternConfig = {
    ...config,
    width: exportSize,
    height: exportSize,
  };

  renderPattern(context, scaledConfig);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (!result) {
        reject(new Error('Failed to export PNG'));
        return;
      }

      resolve(result);
    }, 'image/png');
  });

  return blob;
}
