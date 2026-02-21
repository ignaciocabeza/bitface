import { DocsSection } from './components/DocsSection.tsx';
import { Playground } from './components/Playground.tsx';
import faviconUrl from './favicon.svg';

export function App() {
  return (
    <div className="app-root">
      <header className="site-header">
        <img src={faviconUrl} alt="bitface logo" className="site-logo" />
        <h1>bitface</h1>
        <p className="tagline">Pixel art SVG avatar generator with zero dependencies</p>
        <div className="header-actions">
          <code className="install-badge">npm install @ignaciocabeza/bitface</code>
          <a href="#playground" className="try-btn">Try it</a>
        </div>
      </header>

      <DocsSection />

      <section id="playground" className="playground-section">
        <h2>Playground</h2>
        <Playground />
      </section>

      <footer className="site-footer">
        <a href="https://github.com/ignaciocabeza/bitface" target="_blank" rel="noopener">GitHub</a>
        <a href="https://www.npmjs.com/package/@ignaciocabeza/bitface" target="_blank" rel="noopener">npm</a>
        <span>MIT License</span>
      </footer>
    </div>
  );
}
