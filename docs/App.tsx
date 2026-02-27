import { useMemo } from 'react';
import { generateFace, generateRandomConfig } from '../src/renderer/index.ts';
import { AnimationDemo } from './components/AnimationDemo.tsx';
import { DocsSection } from './components/DocsSection.tsx';
import { Playground } from './components/Playground.tsx';
import faviconUrl from './favicon.svg';

const NAV_ITEMS = [
  { label: 'Quick Start', href: '#quick-start', desc: 'Get up and running' },
  { label: 'Reference', href: '#reference', desc: 'Full API docs' },
  { label: 'Animations', href: '#animations', desc: 'See them in action' },
  { label: 'Playground', href: '#playground', desc: 'Build your avatar' },
];

function NavMenu() {
  const avatars = useMemo(
    () => NAV_ITEMS.map(() => generateFace(generateRandomConfig({ backgroundColor: 'transparent' }))),
    [],
  );

  return (
    <nav className="flex justify-center gap-4 mt-8 max-sm:flex-col max-sm:gap-3">
      {NAV_ITEMS.map((item, i) => (
        <a
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl no-underline transition-all duration-150 hover:border-accent hover:scale-[1.03] group"
        >
          <div
            className="w-10 h-10 [image-rendering:pixelated] shrink-0"
            dangerouslySetInnerHTML={{ __html: avatars[i] }}
          />
          <div className="text-left">
            <div className="text-sm font-semibold text-white group-hover:text-accent transition-colors duration-150">{item.label}</div>
            <div className="text-xs text-muted">{item.desc}</div>
          </div>
        </a>
      ))}
    </nav>
  );
}

export function App() {
  return (
    <div className="max-w-[960px] mx-auto p-4">
      <header className="text-center pt-12 pb-8 max-sm:pt-6 max-sm:pb-4">
        <img src={faviconUrl} alt="bitface logo" className="w-20 h-20 [image-rendering:pixelated] mb-2 inline-block" />
        <h1 className="text-4xl font-bold text-white -tracking-wide max-sm:text-3xl">bitface</h1>
        <p className="text-muted mt-2 text-lg">Pixel art SVG avatar generator with zero dependencies</p>
        <NavMenu />
      </header>

      <hr className="border-border my-2" />

      <DocsSection />

      <AnimationDemo />

      <section id="playground" className="py-8 max-sm:py-4">
        <h2 className="text-2xl text-white mb-5 text-center">Playground</h2>
        <Playground />
      </section>

      <footer className="text-center py-8 flex justify-center gap-6 text-[#666] text-sm border-t border-border mt-8">
        <a href="https://github.com/ignaciocabeza/bitface" target="_blank" rel="noopener" className="text-muted no-underline transition-colors duration-150 hover:text-accent">GitHub</a>
        <a href="https://www.npmjs.com/package/@ignaciocabeza/bitface" target="_blank" rel="noopener" className="text-muted no-underline transition-colors duration-150 hover:text-accent">npm</a>
        <span>MIT License</span>
      </footer>
    </div>
  );
}
