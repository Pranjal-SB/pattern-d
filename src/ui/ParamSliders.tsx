import { PatternConfig, ParamSpec } from '../engine/types';

interface ParamSlidersProps {
  params: ParamSpec[];
  config: PatternConfig;
  onChange: (key: string, value: number) => void;
}

export function ParamSliders({ params, config, onChange }: ParamSlidersProps) {
  if (params.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      {params.map((param) => {
        const value = config.params[param.key] ?? param.default;
        return (
          <div className="field" key={param.key}>
            <span className="field-label">
              {param.label}
              <strong>{value}</strong>
            </span>
            <input
              type="range"
              min={param.min}
              max={param.max}
              step={param.step}
              value={value}
              onChange={(e) => onChange(param.key, Number(e.target.value))}
            />
          </div>
        );
      })}
    </div>
  );
}
