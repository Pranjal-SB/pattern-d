import '@testing-library/jest-dom/vitest';

const canvasContext = {
  save: () => undefined,
  restore: () => undefined,
  clearRect: () => undefined,
  fillRect: () => undefined,
  beginPath: () => undefined,
  closePath: () => undefined,
  moveTo: () => undefined,
  lineTo: () => undefined,
  arc: () => undefined,
  fill: () => undefined,
  stroke: () => undefined,
  createLinearGradient: () => ({
    addColorStop: () => undefined,
  }),
  createImageData: (w: number, h: number) => ({
    width: w, height: h,
    data: new Uint8ClampedArray(w * h * 4),
  }),
  putImageData: () => undefined,
  set fillStyle(_value: string) {},
  set strokeStyle(_value: string) {},
  set lineWidth(_value: number) {},
} as unknown as CanvasRenderingContext2D;

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => canvasContext,
});

Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: (callback: BlobCallback) => callback(new Blob(['mock'], { type: 'image/png' })),
});
