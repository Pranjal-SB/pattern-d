export interface ParamSpec {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface PatternConfig {
  type: string;
  colors: string[];
  bgColor: string;
  width: number;
  height: number;
  params: Record<string, number>;
}

export interface PatternModule {
  id: string;
  label: string;
  params: ParamSpec[];
  draw(ctx: CanvasRenderingContext2D, config: PatternConfig): void;
}
