export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'patternd-theme';

export function readTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === 'light' ? 'light' : 'dark';
}

export function writeTheme(theme: ThemeMode): void {
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export function applyTheme(theme: ThemeMode): void {
  document.documentElement.dataset.theme = theme;
}
