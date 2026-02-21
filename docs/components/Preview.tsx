import { useState } from 'react';
import type { FaceConfig } from '../../src/types.ts';
import { generateFace } from '../../src/renderer/index.ts';

export function Preview({ config }: { config: FaceConfig }) {
  const [copied, setCopied] = useState<'svg' | 'json' | null>(null);
  const svg = generateFace(config);

  function handleCopySvg() {
    navigator.clipboard.writeText(svg);
    setCopied('svg');
    setTimeout(() => setCopied(null), 1500);
  }

  function handleCopyJson() {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied('json');
    setTimeout(() => setCopied(null), 1500);
  }

  function handleDownload() {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bitface-avatar.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="preview-panel">
      <div className="preview-sizes">
        {[
          { label: 'S', size: 64 },
          { label: 'M', size: 128 },
          { label: 'L', size: 256 },
        ].map(({ label, size }) => (
          <div key={label} className="preview-size-col">
            <span className="preview-size-label">{label}</span>
            <div
              className="preview-svg"
              style={{ width: size, height: size }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        ))}
      </div>

      <div className="toolbar">
        <button className="toolbar-btn" onClick={handleDownload}>Download SVG</button>
        <button className="toolbar-btn" onClick={handleCopySvg}>
          {copied === 'svg' ? 'Copied!' : 'Copy SVG'}
        </button>
      </div>

      <div className="json-viewer">
        <div className="json-header">
          <h3>JSON Config</h3>
          <button className="json-copy-btn" onClick={handleCopyJson}>
            {copied === 'json' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="json-code">{JSON.stringify(config, null, 2)}</pre>
      </div>
    </div>
  );
}
