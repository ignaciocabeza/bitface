# bitface - Pixel Art SVG Avatar Generator

Zero-dependency library that generates deterministic 16x16 pixel art faces as optimized SVG strings. Works with vanilla JS, React, Vue, and Svelte.

**Package**: `@ignaciocabeza/bitface` | **License**: MIT

## Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Build library with tsup (ESM + CJS) |
| `npm test` | Run tests once (Vitest) |
| `npm run test:watch` | Watch mode for tests |
| `npm run dev` | Start docs site dev server (Vite + React) |
| `npm run build:docs` | Build production docs site |
| `npm run prepublishOnly` | Runs `npm test && npm run build` before publish |

## Project Structure

```
src/
  index.ts              # Main entry, re-exports public API
  types.ts              # Core interfaces (FaceConfig, PixelGrid, PartPattern)
  react.tsx             # React hooks (useAvatar, useAnimatedAvatar) + <Avatar> component
  vue.ts                # Vue composables + <Avatar> component
  svelte/Avatar.svelte  # Svelte component
  renderer/
    index.ts            # Public API: generateFace, generateRandomConfig, getAvailableParts
    generator.ts        # Grid builder: layered part stamping onto 16x16 grid
    svg.ts              # SVG serialization with horizontal pixel merging optimization
    animations.ts       # Frame-based animation sequences (idle, blink, talk, emote)
    palette.ts          # Color presets (skin/hair/eye) + hex validation + shadow calc
    parts/              # Part definitions as numeric pixel arrays
      face-shapes.ts    # 7 variants
      eyes.ts           # 11 variants
      eyebrows.ts       # 7 variants
      mouth.ts          # 9 variants
      nose.ts           # 6 variants
      ears.ts           # 5 variants
      hair.ts           # 10 variants
      beard.ts          # 6 variants
      accessories.ts    # 6 variants
test/
  core.test.ts          # Core API tests
  react.test.tsx        # React integration tests
  vue.test.ts           # Vue integration tests
  svelte.test.ts        # Svelte integration tests
  security.test.ts      # Color validation / XSS prevention tests
docs/                   # Interactive playground site (React + Vite, deployed on Vercel)
```

## Architecture

### Rendering Pipeline

1. **FaceConfig** defines part choices + colors (skin, hair, eyes)
2. **Generator** (`generator.ts`) builds a 16x16 `PixelGrid`:
   - Resolves color presets to hex via `palette.ts`
   - Stamps parts in layer order: face -> ears -> nose -> mouth -> eyes -> eyebrows -> hair -> beard -> accessories
   - Each part is a `PartPattern` with numeric pixel arrays mapped to color roles via `slotMap`
3. **SVG serializer** (`svg.ts`) converts grid to SVG string, merging adjacent same-color pixels into wider `<rect>` elements

### Part System

Parts use numeric pixel encoding where `0` = transparent and `1-9` map to color roles (skin, skinShadow, hair, hairShadow, eyes, pupil, white, mouth, etc.) via each part's `slotMap`.

### Framework Integrations

Subpath exports (`/react`, `/vue`, `/svelte`) provide hooks/composables and components. Animation is handled via `setTimeout` cycling through `AnimationFrame[]` overrides.

## Key Conventions

- **No runtime dependencies** - everything is pure TypeScript
- **Deterministic output** - same FaceConfig always produces identical SVG
- **Pixel art rendering** - SVGs use `shape-rendering="crispEdges"` and viewBox `0 0 16 16`
- **Color validation** - hex colors are validated via regex to prevent XSS
- **Build targets** - ESM (primary) + CJS, targeting ES2020
- **Peer deps** - React 18+, Vue 3+, Svelte 3+ are optional peer dependencies

## Tech Stack

TypeScript 5.9 | tsup (bundler) | Vitest (tests) | Vite (docs site) | Testing Library (React/Vue tests) | jsdom (DOM environment)
