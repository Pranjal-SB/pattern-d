import { useState } from 'react';
import { PatternConfig } from '../engine/types';
import { renderToBlob } from '../engine/export';

interface ExportDialogProps {
  config: PatternConfig;
}

export function ExportDialog({ config }: ExportDialogProps) {
  const [resolution, setResolution] = useState(2000);
  const [busy, setBusy] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  async function handleDownload() {
    setBusy(true);
    setExportError(null);
    try {
      const blob = await renderToBlob(config, resolution);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pattern-d.png';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <p className="card-title">Export PNG</p>
      <div className="flex gap-2 items-end">
        <div className="field" style={{ flex: 1 }}>
          <label className="field-label" htmlFor="export-res">Resolution</label>
          <select
            id="export-res"
            value={resolution}
            onChange={(e) => setResolution(Number(e.target.value))}
          >
            {[1000, 2000, 3000, 4000].map((v) => (
              <option key={v} value={v}>{v}px</option>
            ))}
          </select>
        </div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleDownload}
          disabled={busy}
          style={{ paddingLeft: 20, paddingRight: 20 }}
        >
          {busy ? 'Exporting…' : '↓ Download'}
        </button>
      </div>
      {exportError && (
        <p className="error-banner" role="alert" style={{ marginTop: 8 }}>
          {exportError}
        </p>
      )}
    </div>
  );
}
