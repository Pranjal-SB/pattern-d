import { createContext, type Dispatch, type ReactNode, useContext, useEffect, useReducer } from 'react';
import { PatternConfig } from '../engine/types';
import { createDefaultConfig } from './config';
import { ConfigAction, configReducer } from './reducer';

interface ConfigContextValue {
  config: PatternConfig;
  dispatch: Dispatch<ConfigAction>;
}

const STORAGE_KEY = 'patternd-config';

const ConfigContext = createContext<ConfigContextValue | null>(null);

function readConfig(): PatternConfig {
  const fallback = createDefaultConfig();
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PatternConfig>;
    return {
      ...fallback,
      ...parsed,
      colors: Array.isArray(parsed.colors) && parsed.colors.length >= 2 ? parsed.colors : fallback.colors,
      params: {
        ...fallback.params,
        ...(parsed.params ?? {}),
      },
    };
  } catch (error) {
    console.warn('Unable to read saved config, using defaults.', error);
    return fallback;
  }
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, dispatch] = useReducer(configReducer, undefined, readConfig);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  return <ConfigContext.Provider value={{ config, dispatch }}>{children}</ConfigContext.Provider>;
}

export function useConfig(): ConfigContextValue {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used inside ConfigProvider');
  }

  return context;
}
