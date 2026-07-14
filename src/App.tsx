import { useCallback, useEffect, useState } from 'react';
import { ConfigProvider, useConfig } from './state/context';
import { applyTheme, readTheme, ThemeMode, writeTheme } from './state/theme';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeToggle } from './ui/ThemeToggle';
import { GalleryPage } from './ui/GalleryPage';
import { EditorPage } from './ui/EditorPage';

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash.slice(1));

  useEffect(() => {
    const cb = () => setHash(window.location.hash.slice(1));
    window.addEventListener('hashchange', cb);
    return () => window.removeEventListener('hashchange', cb);
  }, []);

  const navigate = useCallback((h: string) => {
    window.location.hash = h;
  }, []);

  return { hash, navigate };
}

function AppShell() {
  const { config, dispatch } = useConfig();
  const [theme, setTheme] = useState<ThemeMode>(() => readTheme());
  const { hash, navigate } = useHashRoute();

  useEffect(() => {
    applyTheme(theme);
    writeTheme(theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const patternId = hash.startsWith('edit/') ? hash.slice(5) : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!patternId && (
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black tracking-tight">pattern'd</span>
          </div>
          <ThemeToggle theme={theme} onChange={setTheme} />
        </header>
      )}

      {patternId ? (
        <EditorPage config={config} dispatch={dispatch} onBack={() => navigate('')} />
      ) : (
        <GalleryPage config={config} onSelectPattern={(id) => navigate(`edit/${id}`)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <TooltipProvider>
        <AppShell />
      </TooltipProvider>
    </ConfigProvider>
  );
}
