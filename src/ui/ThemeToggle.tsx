import { ThemeMode } from '../state/theme';

interface ThemeToggleProps {
  theme: ThemeMode;
  onChange: (theme: ThemeMode) => void;
}

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={() => onChange(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  );
}
