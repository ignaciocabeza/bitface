# SVG Pixel Art Face Generator — Implementation Plan

## Context

Build a pixel art SVG face generator web app (TypeScript + Vite). The app has a clear pipeline:

**UI (thumbnail selectors) → JSON FaceConfig → Renderer (produces SVG) → UI displays SVG**

The renderer is a clean, standalone module that takes a JSON config and returns an SVG string. The UI layer is separate — it provides thumbnail previews of each variant for visual selection. This separation means an external AI could also produce the JSON config and feed it to the renderer directly.

## Architecture

```
┌─────────────────────────────────────┐
│  UI Layer                           │
│  ┌──────────┐    ┌───────────────┐  │
│  │ Thumbnail │───→│  FaceConfig   │  │
│  │ Selectors │    │  (JSON)       │  │
│  └──────────┘    └───────┬───────┘  │
│                          │          │
│                          ▼          │
│               ┌──────────────────┐  │
│               │  Renderer Module │  │
│               │  (JSON → SVG)    │  │
│               └────────┬─────────┘  │
│                        │            │
│                        ▼            │
│               ┌──────────────────┐  │
│               │  SVG Preview     │  │
│               └──────────────────┘  │
└─────────────────────────────────────┘
```

## Project Structure

```
svg-avatar-generator/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.ts                       # Entry: wires UI to renderer
│   │
│   ├── # ─── RENDERER MODULE (standalone, no DOM dependencies) ───
│   ├── types.ts                      # FaceConfig, PixelGrid, PartPattern
│   ├── renderer/
│   │   ├── index.ts                  # Public API: generateFace(config) → SVG string
│   │   ├── generator.ts              # Assembles parts onto pixel grid
│   │   ├── svg.ts                    # PixelGrid → SVG string conversion
│   │   ├── palette.ts                # Color presets (skin tones, hair, eyes)
│   │   └── parts/
│   │       ├── index.ts              # Part registry & lookup by name
│   │       ├── face-shapes.ts        # round, oval, square, heart, long
│   │       ├── eyes.ts               # big, small, narrow, round, wink, happy, angry
│   │       ├── eyebrows.ts           # thick, thin, arched, angry, none
│   │       ├── mouth.ts              # smile, frown, open, flat, teeth, smirk
│   │       ├── nose.ts               # small, pointy, wide, button
│   │       ├── ears.ts               # small, big, pointed, none
│   │       ├── hair.ts               # short, long, curly, mohawk, bald, ponytail, spiky
│   │       └── accessories.ts        # glasses, sunglasses, hat, none
│   │
│   ├── # ─── UI LAYER (DOM-dependent) ───
│   ├── ui/
│   │   ├── app.ts                    # Main app controller, manages state
│   │   ├── preview.ts                # Large SVG preview panel
│   │   ├── part-selector.ts          # Thumbnail grid selector component
│   │   ├── color-picker.ts           # Color swatch pickers (skin, hair, eyes)
│   │   ├── toolbar.ts                # Randomize + Export buttons
│   │   └── export.ts                 # Download SVG / copy to clipboard
│   │
│   └── style.css                     # Dark theme, responsive layout
```

## Public API — FaceConfig (types.ts)

```ts
interface FaceConfig {
  faceShape: string;        // "round" | "oval" | "square" | "heart" | "long"
  eyes: string;             // "big" | "small" | "narrow" | "round" | "wink" | "happy" | "angry"
  eyebrows: string;         // "thick" | "thin" | "arched" | "angry" | "none"
  mouth: string;            // "smile" | "frown" | "open" | "flat" | "teeth" | "smirk"
  nose: string;             // "small" | "pointy" | "wide" | "button"
  ears: string;             // "small" | "big" | "pointed" | "none"
  hair: string;             // "short" | "long" | "curly" | "mohawk" | "bald" | "ponytail" | "spiky"
  accessories?: string;     // "glasses" | "sunglasses" | "hat" | "none"
  skinColor?: string;       // hex or preset: "light" | "medium" | "tan" | "brown" | "dark"
  hairColor?: string;       // hex or preset: "black" | "brown" | "blonde" | "red" | "gray" | "white"
  eyeColor?: string;        // hex or preset: "brown" | "blue" | "green" | "gray"
  backgroundColor?: string; // hex color, default "#87CEEB"
}
```

The renderer's public entry point:
```ts
// renderer/index.ts
function generateFace(config: FaceConfig): string  // returns SVG string
function getAvailableParts(): Record<string, string[]>  // lists all part names per category
function getPartThumbnail(category: string, name: string): string  // SVG thumbnail of a single part
```

## Renderer Module Details

### Part Definition (pixel patterns)
- Each variant is a small pixel grid (e.g., eyes are ~6×3, hair covers ~12×6)
- Uses integer-coded arrays: `0` = transparent, `1+` = color slot reference
- A `slotMap` maps integers to color roles: `{ 1: "skin", 2: "skinShadow", 3: "eyes" }`
- Parts are placed at fixed offsets on the 16×16 canvas

### Generator (assembles parts)
- Looks up each part from `FaceConfig` by name in the registry
- Creates a 16×16 pixel grid
- Stamps parts in layer order: **background → face shape → ears → nose → mouth → eyes → eyebrows → hair → accessories**
- Each part's color slots are resolved using the config's color values

### SVG output
- Each pixel = a `<rect>` in SVG
- `shape-rendering="crispEdges"` for sharp pixel art at any zoom
- `viewBox="0 0 16 16"` — CSS scales it up
- Export mode merges adjacent same-color rects to reduce file size

## UI Layer Details

### Thumbnail Selector (`part-selector.ts`)
- For each part category, renders a grid of small thumbnail previews
- Each thumbnail is a mini SVG showing just that part on a neutral background
- Click a thumbnail to select it → updates the `FaceConfig` → re-renders main preview
- Selected thumbnail gets a highlight border
- Uses `getPartThumbnail()` from renderer to generate each thumbnail

### Color Pickers (`color-picker.ts`)
- Skin tone: row of circular color swatches (6-8 presets)
- Hair color: row of circular swatches
- Eye color: row of circular swatches
- Click to select, highlight border on active

### Preview (`preview.ts`)
- Large SVG display (scales up to ~512px with `image-rendering: pixelated`)
- Updates live whenever `FaceConfig` changes

### Toolbar (`toolbar.ts`)
- **Randomize** button — generates random valid `FaceConfig`
- **Download SVG** button
- **Copy SVG** button (clipboard)

### Layout
- **Top**: Header with title
- **Left/Center**: Large face preview
- **Right/Below**: Part selectors organized by category (face, eyes, eyebrows, mouth, nose, ears, hair, accessories), then color pickers, then toolbar

## Implementation Order

1. **Scaffold** — `npm create vite@latest` with vanilla-ts template, clean boilerplate
2. **types.ts** — `FaceConfig`, `PixelGrid`, `PartPattern` types
3. **palette.ts** — Skin tone, hair, eye color presets
4. **parts/face-shapes.ts + parts/index.ts** — First part category + registry
5. **generator.ts + svg.ts** — Assemble grid + render SVG string
6. **renderer/index.ts** — Wire up `generateFace()` public API
7. **Minimal main.ts + index.html** — Display a hardcoded face to verify pipeline works
8. **Remaining parts** — eyes, eyebrows, mouth, nose, ears, hair, accessories (~5-8 variants each)
9. **ui/preview.ts** — SVG preview panel
10. **ui/part-selector.ts** — Thumbnail grid selectors for each category
11. **ui/color-picker.ts** — Skin/hair/eye color swatches
12. **ui/toolbar.ts + ui/export.ts** — Randomize + export buttons
13. **ui/app.ts + main.ts** — Wire everything together with state management
14. **style.css** — Dark theme, responsive grid, polish

## Verification

1. `npm run dev` → app loads with a default face
2. Click different eye thumbnails → only eyes change in preview
3. Click different hair thumbnails → hair changes, doesn't hide eyes
4. Change skin color swatch → face + ears update color
5. Click Randomize → completely new random face
6. Download SVG → file opens correctly in browser/editor
7. Call `generateFace({...})` from console → returns valid SVG string
8. All part names in FaceConfig map correctly to visual patterns
