export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function safeModulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

export function normalizeHex(input: string): string {
  const cleaned = input.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    throw new Error(`Invalid hex color: ${input}`);
  }

  return `#${cleaned.toUpperCase()}`;
}

export function hexToRgb(input: string): [number, number, number] {
  const hex = normalizeHex(input).slice(1);
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ];
}

export function rgbToHex(red: number, green: number, blue: number): string {
  return [red, green, blue]
    .map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
    .replace(/^/, '#');
}
