import { useEffect, useRef, useState, type Dispatch } from 'react';
import { ArrowLeft, Download, Plus, X } from 'lucide-react';
import { PatternConfig } from '../engine/types';
import { renderPattern } from '../engine/render';
import { getPatternDefaultParams, getPatternModule, listPatternModules } from '../patterns';
import { ConfigAction } from '../state/reducer';
import { renderToBlob } from '../engine/export';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface EditorPageProps {
  config: PatternConfig;
  dispatch: Dispatch<ConfigAction>;
  onBack: () => void;
}

/* ── Mini thumb for pattern strip ───────────── */

function MiniThumb({ patternId, config }: { patternId: string; config: PatternConfig }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    c.width = 56; c.height = 56;
    renderPattern(ctx, { ...config, type: patternId, width: 56, height: 56 });
  }, [patternId, config]);
  return <canvas ref={ref} width={56} height={56} className="size-14 rounded-md" />;
}

/* ── Pattern strip ──────────────────────────── */

function PatternStrip({ current, config, onSelect }: {
  current: string; config: PatternConfig; onSelect: (id: string) => void;
}) {
  const patterns = listPatternModules();
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 px-4 py-3">
        {patterns.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            className={cn(
              'flex flex-col items-center gap-1 shrink-0 p-0 border-2 rounded-lg transition-all duration-150',
              p.id === current
                ? 'border-primary shadow-[0_0_0_2px] shadow-primary/20'
                : 'border-border hover:border-primary/50',
            )}
          >
            <MiniThumb patternId={p.id} config={config} />
            <span className="text-[10px] font-semibold text-muted-foreground px-1 pb-1.5 whitespace-nowrap">
              {p.label}
            </span>
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

/* ── Colors tab ─────────────────────────────── */

function ColorsTab({ config, dispatch }: { config: PatternConfig; dispatch: Dispatch<ConfigAction> }) {
  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap gap-2 items-center">
        {config.colors.map((c, i) => (
          <div key={i} className="relative group">
            <input
              type="color" value={c}
              onChange={(e) => dispatch({ type: 'set-color', index: i, color: e.target.value })}
              className="size-10 p-0.5 border-2 border-border rounded-lg bg-transparent cursor-pointer"
              aria-label={`Color ${i + 1}`}
            />
            {config.colors.length > 2 && (
              <button
                type="button"
                onClick={() => dispatch({ type: 'remove-color', index: i })}
                className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove color"
              >
                <X className="size-2.5" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => dispatch({ type: 'add-color', color: config.colors[config.colors.length - 1] ?? '#FFFFFF' })}
          className="size-10 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          aria-label="Add color"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span>Background</span>
        <input type="color" value={config.bgColor}
          onChange={(e) => dispatch({ type: 'set-bg-color', color: e.target.value })}
          className="size-7 p-0.5 border border-border rounded bg-transparent cursor-pointer" />
      </div>
    </div>
  );
}

/* ── Params tab ─────────────────────────────── */

function ParamsTab({ config, dispatch }: { config: PatternConfig; dispatch: Dispatch<ConfigAction> }) {
  const pattern = getPatternModule(config.type);
  if (!pattern || pattern.params.length === 0) {
    return <p className="p-4 text-sm text-muted-foreground">No parameters for this pattern.</p>;
  }
  return (
    <div className="space-y-5 p-4">
      {pattern.params.map((p) => {
        const raw = config.params[p.key] ?? p.default;
        const display = p.step >= 1 ? Math.round(raw) : Math.round(raw * 100) / 100;
        return (
          <div key={p.key} className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="font-medium text-muted-foreground">{p.label}</label>
              <span className="font-bold tabular-nums text-primary">{display}</span>
            </div>
            <Slider
              value={[raw]}
              min={p.min}
              max={p.max}
              step={p.step}
              onValueChange={(v) => dispatch({ type: 'set-param', key: p.key, value: (v as number[])[0] })}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ── Export tab ─────────────────────────────── */

function ExportTab({ config }: { config: PatternConfig }) {
  const [resolution, setResolution] = useState('2000');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function download() {
    setBusy(true); setErr(null);
    try {
      const blob = await renderToBlob(config, Number(resolution));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'pattern-d.png'; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { setErr(e instanceof Error ? e.message : 'Export failed'); }
    finally { setBusy(false); }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1 space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Resolution</label>
          <Select value={resolution} onValueChange={(v) => setResolution(v ?? '2000')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['1000', '2000', '3000', '4000'].map((v) => (
                <SelectItem key={v} value={v}>{v}px</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={download} disabled={busy} className="gap-2">
          <Download className="size-4" />
          {busy ? 'Exporting…' : 'Download PNG'}
        </Button>
      </div>
      {err && <p className="text-sm text-destructive font-medium">{err}</p>}
    </div>
  );
}

/* ── EditorPage ─────────────────────────────── */

export function EditorPage({ config, dispatch, onBack }: EditorPageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) { setErr(true); return; }
    setErr(false);
    const size = Math.min(window.innerWidth * 0.85, window.innerHeight * 0.65);
    c.width = size;
    c.height = size;
    renderPattern(ctx, { ...config, width: size, height: size });
  }, [config]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onBack(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onBack]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0 bg-background/80 backdrop-blur-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="size-4" /> Gallery
        </Button>
        <span className="text-lg font-black tracking-tight">pattern'd</span>
        <div className="w-20" />
      </header>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto">
        {err ? (
          <p className="text-destructive font-medium">Canvas unavailable</p>
        ) : (
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full rounded-xl shadow-2xl shadow-background ring-1 ring-border"
            aria-label="Pattern preview"
          />
        )}
      </div>

      {/* Control bar */}
      <div className="shrink-0 border-t border-border bg-card">
        <PatternStrip
          current={config.type}
          config={config}
          onSelect={(id) => dispatch({ type: 'set-pattern', patternType: id, defaults: getPatternDefaultParams(id) })}
        />

        <Tabs defaultValue="colors" className="border-t border-border">
          <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent px-4 h-10">
            <TabsTrigger value="colors" className="text-xs">Colors</TabsTrigger>
            <TabsTrigger value="params" className="text-xs">Parameters</TabsTrigger>
            <TabsTrigger value="export" className="text-xs">Export</TabsTrigger>
          </TabsList>
          <TabsContent value="colors"><ColorsTab config={config} dispatch={dispatch} /></TabsContent>
          <TabsContent value="params"><ParamsTab config={config} dispatch={dispatch} /></TabsContent>
          <TabsContent value="export"><ExportTab config={config} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
