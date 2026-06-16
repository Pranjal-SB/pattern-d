import { useEffect, useState } from 'react';
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

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-name">pattern<span>'</span>d</span>
          <span className="brand-tag">Studio</span>
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
