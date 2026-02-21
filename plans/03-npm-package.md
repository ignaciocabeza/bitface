# Plan: Convert to npm Package

## Context

The SVG avatar generator is currently a Vite web app (`"private": true`). The renderer module (`src/renderer/`) is already cleanly isolated from the DOM — it takes a `FaceConfig` JSON object and returns SVG strings with zero runtime dependencies. This makes it an ideal candidate for extraction into a publishable npm package.

**Goal:** Ship the renderer as a dual-format (ESM + CJS) npm package that anyone can `npm install` and use from Node.js, browsers, or frameworks, while keeping the existing web app working as a docs/playground.

## Architecture

```
svg-avatar-generator/              (repo — npm package name: bitface)
├── package.json                   # Library package (publishable)
├── tsconfig.json                  # Base config (shared)
├── tsconfig.build.json            # Library build config (stricter)
├── tsup.config.ts                 # Library bundler config
├── src/
│   ├── index.ts                   # NEW — Package entry point (re-exports)
│   ├── react.tsx                  # NEW — React hook + component (optional subpath)
│   ├── types.ts                   # Shared types (unchanged)
│   ├── renderer/                  # Core library code (unchanged)
│   │   ├── index.ts
│   │   ├── generator.ts
│   │   ├── svg.ts
│   │   ├── palette.ts
│   │   ├── animations.ts
│   │   └── parts/
├── docs/                          # NEW — React docs site (deployed to Vercel)
│   ├── index.html                 # HTML shell (mounts React)
│   ├── main.tsx                   # React entry point
│   ├── App.tsx                    # Root: DocsSection + Playground
│   ├── components/
│   │   ├── DocsSection.tsx        # Installation, API reference, config tables
│   │   ├── Playground.tsx         # Interactive avatar builder (React rewrite of old UI)
│   │   ├── Preview.tsx            # SVG preview panel
│   │   ├── PartSelector.tsx       # Thumbnail grid for picking variants
│   │   ├── ColorPicker.tsx        # Color swatch picker
│   │   └── CodeBlock.tsx          # Code snippet with copy button
│   ├── App.css                    # Styles (dark theme)
│   └── vite.config.ts
├── vercel.json                    # Vercel config (points to docs/)
├── dist/                          # Library build output (ESM + CJS + types)
│   ├── index.mjs
│   ├── index.cjs
│   └── index.d.ts
└── docs/dist/                     # Demo app build output
```

## Package Public API

The core package is **framework-agnostic** — it returns plain SVG strings. It also ships a `react` subpath with a ready-made hook and component for React users.

```ts
// Main entry: src/index.ts
export { generateFace, getAvailableParts, getPartThumbnail } from './renderer/index';
export { getAnimationNames, ANIMATIONS } from './renderer/animations';
export { SKIN_PRESETS, HAIR_PRESETS, EYE_PRESETS } from './renderer/palette';
export type { FaceConfig, PixelGrid, PartPattern, PartCategory } from './types';
export type { AnimationFrame, AnimationSequence } from './renderer/animations';

// React entry: src/react.tsx
export { useAvatar, Avatar } from './react';
```

### Core usage (any framework or Node.js)

```ts
import { generateFace } from 'bitface';

const svg = generateFace({
  faceShape: 'round',
  eyes: 'big',
  eyebrows: 'thick',
  mouth: 'smile',
  nose: 'small',
  ears: 'small',
  hair: 'short',
  skinColor: 'light',
  hairColor: 'brown',
  eyeColor: 'blue',
});
```

### React

```tsx
import { Avatar, useAvatar } from 'bitface/react';

// Component — renders SVG inline via dangerouslySetInnerHTML
<Avatar config={{ faceShape: 'round', eyes: 'big', ... }} size={128} />

// Hook — returns raw SVG string for custom rendering
const svg = useAvatar({ faceShape: 'round', eyes: 'big', ... });
```

### Vue

```vue
<template>
  <div v-html="svg" />
</template>
<script setup>
import { ref, computed } from 'vue';
import { generateFace } from 'bitface';

const svg = computed(() => generateFace({ faceShape: 'round', eyes: 'big', ... }));
</script>
```

### Svelte

```svelte
<script>
  import { generateFace } from 'bitface';
  $: svg = generateFace({ faceShape: 'round', eyes: 'big', ... });
</script>
{@html svg}
```

### Node.js (server-side)

```ts
import { generateFace } from 'bitface';
import { writeFileSync } from 'fs';

const svg = generateFace({ faceShape: 'round', eyes: 'big', ... });
writeFileSync('avatar.svg', svg);
```

## Implementation Steps

### Step 1: Create package entry point

Create `src/index.ts` that re-exports the public API from the renderer module, palette, animations, and types. This becomes the single entry point for library consumers.

### Step 2: Remove `.ts` extensions from imports

tsup (and standard Node.js resolution) doesn't use `.ts` extensions in import paths. Update all internal imports across `src/renderer/` and `src/types.ts` to drop the `.ts` suffix:

```
Files to update:
- src/renderer/index.ts       (imports from ../types.ts, ./generator.ts, ./svg.ts, ./parts/index.ts)
- src/renderer/generator.ts   (imports from ../types.ts, ./palette.ts, ./parts/index.ts)
- src/renderer/svg.ts         (imports from ../types.ts)
- src/renderer/animations.ts  (imports from ../types.ts)
- src/renderer/parts/index.ts (imports from ../../types.ts, ./*.ts part files)
```

The `.ts` extensions were added for Vite compatibility but must be removed for the library build. The Vite docs site will still work because Vite resolves extensionless imports fine.

### Step 3: Install tsup and configure library build

**Why tsup:** Lightweight, zero-config bundler built on esbuild. Produces ESM + CJS + `.d.ts` declarations from a single command. No complex Rollup config needed.

Install:
```bash
npm install -D tsup
```

Create `tsup.config.ts`:
```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  outDir: 'dist',
  target: 'es2020',
  minify: false,       // Keep readable for debugging
  sourcemap: true,
});
```

### Step 4: Add `tsconfig.build.json` for library type-checking

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "dist"
  },
  "include": ["src/index.ts", "src/types.ts", "src/renderer/**/*"],
  "exclude": ["src/ui/**/*", "src/main.ts", "docs/**/*"]
}
```

### Step 5: Build React docs site in `docs/`

Instead of moving the vanilla UI, **rewrite the docs site as a React app** using Vite + React. The old `src/ui/` code serves as reference but the docs site is built from scratch with React components. This makes the site easier to maintain and also serves as a real-world React usage example of the package.

Install React dependencies (devDependencies — not shipped with the package):
```bash
npm install -D react react-dom @types/react @types/react-dom @vitejs/plugin-react
```

#### `docs/vite.config.ts`
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'docs',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});
```

#### `docs/index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>bitface</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./main.tsx"></script>
</body>
</html>
```

#### `docs/main.tsx`
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './App.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

#### `docs/App.tsx`
```tsx
import { DocsSection } from './components/DocsSection';
import { Playground } from './components/Playground';

export function App() {
  return (
    <>
      <header> {/* Title, tagline, npm badge, "Try it" anchor */} </header>
      <DocsSection />
      <Playground />
      <footer> {/* GitHub, npm, license links */} </footer>
    </>
  );
}
```

#### Page layout (top to bottom)

```
┌──────────────────────────────────────────┐
│  Header: "bitface"          │
│  Tagline + npm install badge             │
├──────────────────────────────────────────┤
│  DOCS SECTION  <DocsSection />           │
│  ┌────────────────────────────────────┐  │
│  │ Installation                       │  │
│  │   npm install bitface │  │
│  ├────────────────────────────────────┤  │
│  │ Quick Start (tabs: React/Vue/      │  │
│  │   Svelte/Node.js code snippets)    │  │
│  ├────────────────────────────────────┤  │
│  │ API Reference                      │  │
│  │   generateFace(config) → string    │  │
│  │   getAvailableParts() → Record     │  │
│  │   getPartThumbnail(...)→ string    │  │
│  │   getAnimationNames() → string[]   │  │
│  │   useAvatar hook (React)           │  │
│  │   Avatar component (React)         │  │
│  ├────────────────────────────────────┤  │
│  │ FaceConfig Options                 │  │
│  │   Table of all properties, types,  │  │
│  │   defaults, and available values   │  │
│  ├────────────────────────────────────┤  │
│  │ Color Presets (with swatches)      │  │
│  │   Skin / Hair / Eye preset names   │  │
│  └────────────────────────────────────┘  │
├──────────────────────────────────────────┤
│  INTERACTIVE PLAYGROUND  <Playground />  │
│  (anchor: #playground)                   │
│  ┌─────────────────┬────────────────┐    │
│  │  <Preview />     │  Controls col  │    │
│  │                  │  <PartSelector>│    │
│  │                  │  <ColorPicker> │    │
│  └─────────────────┴────────────────┘    │
├──────────────────────────────────────────┤
│  Footer: GitHub link, npm link, license  │
└──────────────────────────────────────────┘
```

#### Key components

**`DocsSection.tsx`** — Renders all documentation. Pulls live data from the package API (`getAvailableParts()`, preset objects, `getAnimationNames()`) so docs stay in sync when parts/colors are added. Includes a tabbed code block showing Quick Start for React, Vue, Svelte, and Node.js.

**`Playground.tsx`** — Interactive avatar builder. Manages `FaceConfig` state with `useState`, calls `generateFace()` on every change. Contains `<Preview>`, `<PartSelector>` for each category, and `<ColorPicker>` for skin/hair/eye/background.

**`Preview.tsx`** — Renders the SVG output at S/M/L sizes. Shows the current `FaceConfig` as JSON. Download and Copy SVG buttons.

**`PartSelector.tsx`** — Thumbnail grid for one part category. Uses `getPartThumbnail()` to render each option. Highlights the selected variant.

**`ColorPicker.tsx`** — Row of color swatches for one color category. Supports preset names and custom hex input.

**`CodeBlock.tsx`** — Styled `<pre>` with a copy-to-clipboard button. Reused across the docs section.

#### Styling

`docs/App.css`:
- Dark theme consistent with existing design (`#1a1a2e` background)
- Code blocks with dark background and monospace font
- `image-rendering: pixelated` on SVG containers
- Responsive: two-column playground on desktop, single column on mobile
- Smooth scroll anchor link from header "Try it" button to `#playground`

#### Delete old vanilla UI

After the React docs site is working, remove the old `src/ui/` directory and `src/main.ts` — they are no longer needed.

### Step 6: Create React subpath (`src/react.tsx`)

A thin React wrapper that provides a hook and component. React is a **peer dependency** — consumers must have React installed in their own project.

```tsx
// src/react.tsx
import { useMemo } from 'react';
import { generateFace } from './renderer/index';
import type { FaceConfig } from './types';

/** Hook: returns SVG string, memoized on config changes. */
export function useAvatar(config: FaceConfig): string {
  return useMemo(() => generateFace(config), [
    config.faceShape, config.eyes, config.eyebrows, config.mouth,
    config.nose, config.ears, config.hair, config.beard,
    config.accessories, config.skinColor, config.hairColor,
    config.eyeColor, config.backgroundColor,
  ]);
}

/** Component: renders the avatar SVG inline. */
export function Avatar({
  config,
  size = 128,
  className,
}: {
  config: FaceConfig;
  size?: number;
  className?: string;
}) {
  const svg = useAvatar(config);
  return (
    <div
      className={className}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
```

Update `tsup.config.ts` to include the React entry:

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/react.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  outDir: 'dist',
  target: 'es2020',
  minify: false,
  sourcemap: true,
  external: ['react'],      // Don't bundle React — it's a peer dep
});
```

This produces:
```
dist/
├── index.mjs / index.cjs / index.d.ts       # Core (no React)
└── react.mjs / react.cjs / react.d.ts       # React wrapper
```

### Step 7: Update `package.json` for publishing

```jsonc
{
  "name": "bitface",
  "version": "1.0.0",
  "description": "Pixel art SVG avatar/face generator with zero dependencies",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./react": {
      "import": "./dist/react.mjs",
      "require": "./dist/react.cjs",
      "types": "./dist/react.d.ts"
    }
  },
  "files": [
    "dist"
  ],
  "sideEffects": false,
  "keywords": [
    "svg", "avatar", "pixel-art", "face-generator", "identicon", "react"
  ],
  "license": "MIT",
  "peerDependencies": {
    "react": ">=18"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": true          // Core works without React
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "vite --config docs/vite.config.ts",
    "build:docs": "vite build --config docs/vite.config.ts",
    "preview": "vite preview --config docs/vite.config.ts",
    "prepublishOnly": "npm run build"
  },
  "devDependencies": {
    "typescript": "~5.9.3",
    "vite": "^7.3.1",
    "tsup": "^8.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
  // Remove "private": true
}
```

Key points:
- `"private": true` is removed so npm allows publishing
- `"exports"` has two subpaths: `"."` (core) and `"./react"` (React wrapper)
- `"peerDependencies"` declares React as optional — core package works without it
- `"files": ["dist"]` ensures only the built output is published
- `"sideEffects": false` enables tree-shaking
- React + Vite React plugin are devDependencies (for the docs site build only)
- `"prepublishOnly"` ensures a fresh build before every `npm publish`

### Step 8: Update `.gitignore`

Add `dist/` to `.gitignore` since it's now the library build output (generated, not committed).

### Step 9: Add Vercel deployment config

The docs site will be deployed to Vercel. Create `vercel.json` at the project root:

```json
{
  "buildCommand": "npm run build:docs",
  "outputDirectory": "docs/dist",
  "installCommand": "npm install"
}
```

This tells Vercel:
- **buildCommand** — run the docs site Vite build (not the library build)
- **outputDirectory** — serve the static files from `docs/dist/`

To deploy: connect the GitHub repo to Vercel. Every push to `main` will auto-deploy the docs site. The npm package and Vercel site are independent — publishing to npm ships only `dist/`, while Vercel builds and serves only `docs/dist/`.

### Step 10: Create LICENSE file

Add an MIT license file at the project root (standard for npm packages).

## Summary of File Changes

| Action | File | Notes |
|--------|------|-------|
| Create | `src/index.ts` | Package entry point with re-exports |
| Create | `src/react.tsx` | React hook (`useAvatar`) + component (`Avatar`) |
| Edit | `src/renderer/index.ts` | Remove `.ts` from imports |
| Edit | `src/renderer/generator.ts` | Remove `.ts` from imports |
| Edit | `src/renderer/svg.ts` | Remove `.ts` from imports |
| Edit | `src/renderer/animations.ts` | Remove `.ts` from imports |
| Edit | `src/renderer/parts/index.ts` | Remove `.ts` from imports |
| Create | `tsup.config.ts` | Library bundler config (two entries: core + react) |
| Create | `tsconfig.build.json` | Library-only TypeScript config |
| Edit | `package.json` | Exports, peer deps, scripts; remove private |
| Create | `docs/index.html` | HTML shell for React app |
| Create | `docs/main.tsx` | React entry point |
| Create | `docs/App.tsx` | Root component: DocsSection + Playground |
| Create | `docs/App.css` | Dark theme styles |
| Create | `docs/components/DocsSection.tsx` | Docs with live API data + framework examples |
| Create | `docs/components/Playground.tsx` | Interactive avatar builder |
| Create | `docs/components/Preview.tsx` | SVG preview panel |
| Create | `docs/components/PartSelector.tsx` | Thumbnail grid for variant picking |
| Create | `docs/components/ColorPicker.tsx` | Color swatch picker |
| Create | `docs/components/CodeBlock.tsx` | Code snippet with copy button |
| Create | `docs/vite.config.ts` | Vite + React plugin config |
| Create | `vercel.json` | Vercel deployment config for docs site |
| Delete | `src/ui/` | Old vanilla UI (replaced by React docs site) |
| Delete | `src/main.ts` | Old app entry (replaced by docs/main.tsx) |
| Delete | `src/style.css` | Old styles (replaced by docs/App.css) |
| Delete | `index.html` | Old HTML (replaced by docs/index.html) |
| Edit | `.gitignore` | Add `dist/` |
| Create | `LICENSE` | MIT license |

## Implementation Order

1. Create `src/index.ts` (package entry point)
2. Remove `.ts` extensions from all renderer imports
3. Create `src/react.tsx` (React hook + component)
4. Install tsup, create `tsup.config.ts`
5. Create `tsconfig.build.json`
6. Install React + Vite React plugin as devDependencies
7. Build React docs site (`docs/` — all components)
8. Delete old vanilla UI (`src/ui/`, `src/main.ts`, `src/style.css`, `index.html`)
9. Update `package.json` (exports, peer deps, scripts, remove private)
10. Create `vercel.json`
11. Update `.gitignore`
12. Create `LICENSE`
13. Run `npm run build` — verify library produces core + react outputs
14. Run `npm run dev` — verify docs site works (docs + interactive playground)
15. Run `npm pack --dry-run` — verify only `dist/` is included in the tarball
16. Deploy to Vercel — connect repo and verify live deployment

## Verification Checklist

- [ ] `npm run build` produces `dist/index.{mjs,cjs,d.ts}` and `dist/react.{mjs,cjs,d.ts}`
- [ ] Core entry has zero dependencies (no React in `dist/index.mjs`)
- [ ] React entry imports React as external (not bundled)
- [ ] `npm run dev` launches the React docs site
- [ ] `npm pack --dry-run` shows only files from `dist/`
- [ ] `import { generateFace } from 'bitface'` works
- [ ] `import { Avatar, useAvatar } from 'bitface/react'` works
- [ ] TypeScript types are available for both entries
- [ ] No DOM or UI code is included in the library bundle
- [ ] `"sideEffects": false` allows tree-shaking
- [ ] Docs page shows documentation (install, quick start with framework tabs, API reference)
- [ ] Docs section lists all parts, color presets, and animations from live API data
- [ ] Interactive playground appears below docs with "Try it" anchor link
- [ ] Vercel deployment builds and serves the docs site correctly
- [ ] Docs site is accessible at the Vercel URL with full docs + interactive playground
