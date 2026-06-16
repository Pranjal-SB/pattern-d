import { useEffect, useMemo, useState } from 'react';
import { ConfigProvider, useConfig } from './state/context';
import { applyTheme, readTheme, ThemeMode, writeTheme } from './state/theme';
import { ControlPanel } from './ui/ControlPanel';
import { PreviewStage } from './ui/PreviewStage';
import { ThemeToggle } from './ui/ThemeToggle';

function AppShell() {
  const { config, dispatch } = useConfig();
  const [theme, setTheme] = useState<ThemeMode>(() => readTheme());

  useEffect(() => {
    applyTheme(theme);
    writeTheme(theme);
  }, [theme]);

  const layoutClassName = useMemo(
    () => `app-shell app-shell--${theme}`,
    [theme],
  );

  return (
    <div className={layoutClassName}>
      <header className="app-header">
        <div>
          <p className="eyebrow">pattern&apos;d</p>
          <h1>Pattern studio</h1>
        </div>
        <div className="header-actions">
          <ThemeToggle theme={theme} onChange={setTheme} />
        </div>
      </header>

      <main className="app-main">
        <section className="preview-panel">
          <PreviewStage config={config} />
        </section>

        <aside className="controls-panel">
          <ControlPanel config={config} dispatch={dispatch} />
        </aside>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <AppShell />
    </ConfigProvider>
  );
}
