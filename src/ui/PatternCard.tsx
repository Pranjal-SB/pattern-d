import { useEffect, useRef } from 'react';
import { PatternConfig } from '../engine/types';
import { renderPattern } from '../engine/render';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PatternCardProps {
  patternId: string;
  label: string;
  config: PatternConfig;
  index: number;
  onSelect: (id: string) => void;
}

export function PatternCard({ patternId, label, config, index, onSelect }: PatternCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    renderPattern(ctx, { ...config, type: patternId, width: size, height: size });
  }, [patternId, config]);

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={() => onSelect(patternId)}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelect(patternId); }}
      className={cn(
        'group relative overflow-hidden border-2 border-border cursor-pointer p-0 aspect-square',
        'transition-all duration-200 ease-out hover:border-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10',
        'active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <canvas ref={canvasRef} width={200} height={200} className="w-full h-full" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-xs font-semibold text-foreground">{label}</span>
      </div>
    </Card>
  );
}
