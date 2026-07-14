import { PatternConfig } from '../engine/types';
import { listPatternModules } from '../patterns';
import { PatternCard } from './PatternCard';

interface GalleryPageProps {
  config: PatternConfig;
  onSelectPattern: (id: string) => void;
}

export function GalleryPage({ config, onSelectPattern }: GalleryPageProps) {
  const patterns = listPatternModules();

  return (
    <div className="px-4 sm:px-6 pb-12">
      <div className="max-w-5xl mx-auto pt-12 pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Browse <span className="text-primary">14 patterns</span>
        </h1>
        <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          Click any pattern to customize colors, tweak parameters, and export.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
        {patterns.map((p, i) => (
          <div
            key={p.id}
            className="animate-[fade-up_300ms_ease-out_both]"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <PatternCard
              patternId={p.id}
              label={p.label}
              config={config}
              index={i}
              onSelect={onSelectPattern}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
