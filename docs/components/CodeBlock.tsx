import { useState } from 'react';

export function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="bg-code rounded-lg overflow-hidden border border-border">
      <div className="flex justify-between items-center px-3 py-2 border-b border-border">
        {language && <span className="text-[0.7rem] uppercase tracking-wide text-muted">{language}</span>}
        <button
          className="bg-transparent border border-border text-muted-light text-[0.7rem] px-2 py-0.5 rounded cursor-pointer transition-colors duration-150 hover:border-accent hover:text-white"
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-3 font-mono text-[0.8rem] leading-relaxed text-green overflow-x-auto whitespace-pre"><code>{code}</code></pre>
    </div>
  );
}
