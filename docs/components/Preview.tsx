import { useState } from 'react';
import type { FaceConfig } from '../../src/types.ts';
import type { AnimationSequence } from '../../src/renderer/animations.ts';
import { useAnimatedAvatar } from '../../src/react.tsx';

export function Preview({ config, animation, intensity }: { config: FaceConfig; animation?: string | AnimationSequence; intensity?: number }) {
  const [copied, setCopied] = useState<'svg' | 'json' | null>(null);
  const svg = useAnimatedAvatar(config, animation || undefined, intensity);

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
    <div className="bg-card rounded-xl p-6 flex flex-col gap-5">
      <div className="flex items-end justify-center gap-5">
        {[
          { label: 'S', size: 64 },
          { label: 'M', size: 128 },
          { label: 'L', size: 256 },
        ].map(({ label, size }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 min-w-0">
            <span className="text-[0.7rem] uppercase tracking-widest text-muted">{label}</span>
            <div
              className="preview-svg aspect-square w-full"
              style={{ maxWidth: size }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <button className="flex-1 min-w-30 px-4 py-2.5 bg-accent text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-150 hover:bg-accent-hover active:bg-accent-active" onClick={handleDownload}>Download SVG</button>
        <button className="flex-1 min-w-30 px-4 py-2.5 bg-accent text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-150 hover:bg-accent-hover active:bg-accent-active" onClick={handleCopySvg}>
          {copied === 'svg' ? 'Copied!' : 'Copy SVG'}
        </button>
      </div>

      <div className="bg-code rounded-lg overflow-hidden">
        <div className="flex justify-between items-center px-3 py-2 border-b border-border">
          <h3 className="text-xs uppercase tracking-wide text-muted">JSON Config</h3>
          <button
            className="bg-transparent border border-border text-muted-light text-[0.7rem] px-2 py-0.5 rounded cursor-pointer transition-colors duration-150 hover:border-accent hover:text-white"
            onClick={handleCopyJson}
          >
            {copied === 'json' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="p-3 font-mono text-[0.7rem] leading-normal text-green overflow-x-auto max-h-70 overflow-y-auto">{JSON.stringify(config, null, 2)}</pre>
      </div>
    </div>
  );
}
