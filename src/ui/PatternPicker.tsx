import { listPatternModules } from '../patterns';

interface PatternPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function PatternPicker({ value, onChange }: PatternPickerProps) {
  const patterns = listPatternModules();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Pattern type"
    >
      {patterns.map((pattern) => (
        <option key={pattern.id} value={pattern.id}>
          {pattern.label}
        </option>
      ))}
    </select>
  );
}
