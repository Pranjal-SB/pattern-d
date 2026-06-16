import { PatternConfig } from '../engine/types';

export type ConfigAction =
  | { type: 'set-pattern'; patternType: string; defaults?: Record<string, number> }
  | { type: 'set-color'; index: number; color: string }
  | { type: 'add-color'; color: string }
  | { type: 'remove-color'; index: number }
  | { type: 'set-bg-color'; color: string }
  | { type: 'set-size'; dimension: 'width' | 'height'; value: number }
  | { type: 'set-param'; key: string; value: number }
  | { type: 'reset'; config: PatternConfig };

export function configReducer(state: PatternConfig, action: ConfigAction): PatternConfig {
  switch (action.type) {
    case 'set-pattern':
      return {
        ...state,
        type: action.patternType,
        params: action.defaults ? { ...action.defaults } : state.params,
      };
    case 'set-color': {
      const colors = state.colors.slice();
      colors[action.index] = action.color;
      return { ...state, colors };
    }
    case 'add-color':
      return { ...state, colors: [...state.colors, action.color] };
    case 'remove-color':
      return state.colors.length <= 2
        ? state
        : { ...state, colors: state.colors.filter((_, index) => index !== action.index) };
    case 'set-bg-color':
      return { ...state, bgColor: action.color };
    case 'set-size':
      return { ...state, [action.dimension]: action.value };
    case 'set-param':
      return {
        ...state,
        params: {
          ...state.params,
          [action.key]: action.value,
        },
      };
    case 'reset':
      return action.config;
    default:
      return state;
  }
}
