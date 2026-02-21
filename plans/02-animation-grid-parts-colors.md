# Plan: Animation, Variable Grid Size, More Parts & Hair Colors

## Context

Four enhancements to the existing pixel art face generator:
1. **Frame-based animation** — blink, talk, idle animations using frame cycling
2. **Variable grid size** — allow 16×16, 32×32, or 48×48 pixel density
3. **More part variants** — expand every face category with additional options
4. **More hair colors** — add more presets to the palette

## 1. Frame-Based Animation

### New file: `src/renderer/animations.ts`
Define animation sequences as named presets. Each animation is a timed sequence of partial FaceConfig overrides (e.g., swap `eyes` to different variants across frames).

```
Animations:
- "idle"  → blink every ~3s (eyes: big → happy → big), subtle cycle
- "talk"  → mouth cycles: smile → open → flat → open → smile
- "blink" → eyes only: current → happy → current (fast, 3 frames)
- "emote" → eyebrows + mouth shift for 1s then return
```

Each animation = array of `{ duration: ms, overrides: Partial<FaceConfig> }` frames. The renderer doesn't change — we just call `generateFace()` with a modified config each frame.

### Changes to `src/ui/preview.ts`
- Add a `setInterval`-based frame loop (not `requestAnimationFrame` — pixel art doesn't need 60fps)
- Tick through the current animation's frames, applying overrides to config snapshot
- Re-render SVG on each frame tick

### Changes to `src/ui/app.ts`
- Add animation selector dropdown (idle, talk, blink, none) in toolbar area
- Pass play/stop controls to preview
- "none" stops the animation loop and shows static face

## 2. Variable Grid Size (Pixel Density)

### Approach: Scale at generation time
Keep all part definitions authored at 16×16 base resolution. When a higher grid size is requested (32 or 48), **upscale each pixel** by a multiplier during grid generation:
- 16×16 → scale=1 (1 pixel = 1 cell)
- 32×32 → scale=2 (1 pixel = 2×2 cells)
- 48×48 → scale=3 (1 pixel = 3×3 cells)

This avoids rewriting all part patterns. The upscale happens in `generator.ts` during `stampPart`, producing a genuinely larger grid. `svg.ts` infers dimensions from the grid array.

### Changes to `src/types.ts`
- Add `gridSize?: number` to `FaceConfig` (default 16)

### Changes to `src/renderer/generator.ts`
- Accept `gridSize` from config, compute `scale = gridSize / 16`
- Create grid at `gridSize × gridSize`
- In `stampPart`, expand each source pixel into a `scale × scale` block

### Changes to `src/renderer/svg.ts`
- Infer grid dimensions from the array (no hardcoded 16)
- Remove scaling logic — just render the grid as-is

### Changes to `src/renderer/index.ts`
- Pass `config.backgroundColor` only (grid size is handled by generator)

### UI: `src/ui/app.ts`
- Add a "Pixel Density" selector (16, 32, 48) in the controls

## 3. More Part Variants

Add new variants to each existing part file. All patterns stay at 16×16 base grid.

### `src/renderer/parts/face-shapes.ts` — add:
- **diamond**: narrow at top/bottom, wide in middle
- **wide**: broader than round

### `src/renderer/parts/eyes.ts` — add:
- **dots**: single-pixel dot eyes
- **sleepy**: half-closed, droopy
- **cross**: X-shaped (cartoon dizzy)
- **heart**: tiny heart-shaped pupils

### `src/renderer/parts/eyebrows.ts` — add:
- **worried**: inner ends raised
- **unibrow**: connected across

### `src/renderer/parts/mouth.ts` — add:
- **grin**: wide smile showing teeth
- **tongue**: sticking out tongue
- **oh**: small circle O shape

### `src/renderer/parts/nose.ts` — add:
- **long**: vertical 3-pixel line
- **snub**: tiny upturned

### `src/renderer/parts/ears.ts` — add:
- **elf**: long pointed ears extending outward

### `src/renderer/parts/hair.ts` — add:
- **bob**: chin-length straight
- **afro**: large rounded top
- **bangs**: fringe covering forehead

### `src/renderer/parts/accessories.ts` — add:
- **headband**: thin band across forehead
- **earrings**: small dots at ear level

## 4. More Hair Colors

### `src/renderer/palette.ts`
Add to `HAIR_PRESETS`:
- **auburn**: dark reddish-brown
- **strawberry**: light orange-red
- **platinum**: near-white blonde
- **pink**: bright pink
- **blue**: vibrant blue
- **purple**: deep purple
- **teal**: blue-green

## Implementation Order

1. More hair colors (`palette.ts`) — smallest change, immediate impact
2. More part variants (all `parts/*.ts` files) — expand content
3. Variable grid size (`types.ts`, `generator.ts`, `svg.ts`, `renderer/index.ts`, `app.ts`) — add density selector
4. Frame-based animation (`animations.ts`, `preview.ts`, `app.ts`, `style.css`) — add animation system and UI

## Files Modified

| File | Changes |
|------|---------|
| `src/renderer/palette.ts` | Add 7 hair color presets |
| `src/renderer/parts/face-shapes.ts` | Add 2 variants |
| `src/renderer/parts/eyes.ts` | Add 4 variants |
| `src/renderer/parts/eyebrows.ts` | Add 2 variants |
| `src/renderer/parts/mouth.ts` | Add 3 variants |
| `src/renderer/parts/nose.ts` | Add 2 variants |
| `src/renderer/parts/ears.ts` | Add 1 variant |
| `src/renderer/parts/hair.ts` | Add 3 variants |
| `src/renderer/parts/accessories.ts` | Add 2 variants |
| `src/types.ts` | Add `gridSize?` to FaceConfig |
| `src/renderer/generator.ts` | Scale grid generation to requested size |
| `src/renderer/svg.ts` | Infer grid dimensions from array |
| `src/renderer/index.ts` | Simplified — grid size handled by generator |
| **New:** `src/renderer/animations.ts` | Animation sequence definitions |
| `src/ui/preview.ts` | Frame loop, animation playback |
| `src/ui/app.ts` | Animation selector, grid size selector |
| `src/style.css` | Styles for new dropdown controls |

## Verification

1. `npm run dev` — app loads, new parts appear in selectors
2. New hair colors visible in hair color picker
3. Select grid size 32 → SVG output is 32×32 viewBox with 4× more rects
4. Select grid size 48 → 48×48 viewBox with 9× more rects
5. Select "idle" animation → face blinks periodically
6. Select "talk" → mouth cycles
7. Change parts while animation plays → animation applies to new selection
8. Download SVG while animated → exports static current frame
9. JSON viewer shows `gridSize` field when non-default
