import { useEffect, useRef, useState } from 'react';
import { renderPattern } from '../engine/render';
import { PatternConfig } from '../engine/types';

interface PreviewStageProps {
  config: PatternConfig;
}

export function PreviewStage({ config }: PreviewStageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [contextError, setContextError] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      setContextError(true);
      return;
    }

    setContextError(false);
    canvas.width = config.width;
    canvas.height = config.height;
    renderPattern(context, config);
  }, [config]);

  return (
    <div className="preview-stage">
      {contextError && (
        <p className="error-banner" role="alert">
          Canvas 2D context unavailable — try a different browser.
        </p>
      )}
      <canvas ref={canvasRef} className="preview-canvas" aria-label="Pattern preview" />
    </div>
  );
}
