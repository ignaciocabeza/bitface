# bitface

**Tiny pixel art avatars that pack a punch.**

Generate unique 16x16 pixel art faces as clean SVGs — no dependencies, no canvas, no nonsense. Works everywhere: browsers, servers, React, Vue, Svelte, or just plain JavaScript.

```
   +--+--+--+--+--+--+
   |  |##|##|##|##|  |
   +--+--+--+--+--+--+
   |##|  |##|##|  |##|    <-- that's a face
   +--+--+--+--+--+--+
   |  |  | >  < |  |  |
   +--+--+--+--+--+--+
   |  |  | \_/  |  |  |
   +--+--+--+--+--+--+
```

## Why bitface?

- **Zero dependencies** — just your code and some math
- **Tiny output** — SVGs are a handful of `<rect>` elements, optimized by merging adjacent pixels
- **Deterministic** — same config = same face, every time
- **Framework agnostic** — first-class React, Vue, and Svelte support, but works without any of them
- **Animations** — idle, blink, talk, and emote presets built in
- **9 customizable features** — face shape, eyes, eyebrows, mouth, nose, ears, hair, beard, and accessories
- **Color presets** — 6 skin tones, 13 hair colors, 4 eye colors, or use any hex color

## Install

```bash
npm install bitface
```

## Quick start

```js
import { generateFace, generateRandomConfig } from 'bitface'

// Generate a random avatar
const svg = generateFace()

// Generate with a specific config
const config = generateRandomConfig()
config.hair = 'mohawk'
config.accessories = 'sunglasses'
const coolAvatar = generateFace(config)
```

That's it. `coolAvatar` is an SVG string you can drop into any `innerHTML`, save to a file, or send over an API.

## Framework usage

### React

```jsx
import { Avatar } from 'bitface/react'

function Profile() {
  return (
    <Avatar
      config={{
        faceShape: 'round',
        eyes: 'big',
        eyebrows: 'arched',
        mouth: 'smile',
        nose: 'button',
        ears: 'small',
        hair: 'curly',
        hairColor: 'auburn',
        skinColor: 'medium',
        accessories: 'glasses',
      }}
      size={128}
      animation="idle"
    />
  )
}
```

**Hooks:**

```jsx
import { useAvatar, useAnimatedAvatar } from 'bitface/react'

// Static avatar
const svg = useAvatar(config)

// Animated avatar
const svg = useAnimatedAvatar(config, 'blink')
```

### Vue

```vue
<script setup>
import { Avatar } from 'bitface/vue'

const config = {
  faceShape: 'oval',
  eyes: 'round',
  eyebrows: 'thick',
  mouth: 'grin',
  nose: 'pointy',
  ears: 'pointed',
  hair: 'spiky',
  hairColor: 'blue',
  beard: 'goatee',
}
</script>

<template>
  <Avatar :config="config" :size="128" animation="talk" />
</template>
```

**Composables:**

```js
import { useAvatar, useAnimatedAvatar } from 'bitface/vue'

const svg = useAvatar(() => config)
const animatedSvg = useAnimatedAvatar(() => config, () => 'emote')
```

### Svelte

```svelte
<script>
  import Avatar from 'bitface/svelte'

  const config = {
    faceShape: 'heart',
    eyes: 'wink',
    eyebrows: 'thin',
    mouth: 'smirk',
    nose: 'small',
    ears: 'elf',
    hair: 'ponytail',
    hairColor: 'pink',
    accessories: 'earrings',
  }
</script>

<Avatar {config} size={128} animation="idle" />
```

### Node.js / server-side

```js
import { generateFace } from 'bitface'
import { writeFileSync } from 'fs'

const svg = generateFace({
  faceShape: 'square',
  eyes: 'angry',
  eyebrows: 'angry',
  mouth: 'frown',
  nose: 'wide',
  ears: 'big',
  hair: 'mohawk',
  hairColor: 'red',
  beard: 'full',
  backgroundColor: 'transparent',
})

writeFileSync('avatar.svg', svg)
```

## API

### `generateFace(config?)`

Returns an SVG string. Pass a `FaceConfig` for a specific face, or call with no arguments for a random one.

### `generateRandomConfig()`

Returns a random `FaceConfig` object with all fields populated.

### `getAvailableParts()`

Returns all part variants grouped by category:

```js
{
  faceShape: ['round', 'oval', 'square', 'heart', 'long', 'diamond', 'wide'],
  eyes: ['big', 'small', 'narrow', 'round', 'wink', 'happy', 'angry', 'dots', 'sleepy', 'cross', 'heart'],
  eyebrows: ['thick', 'thin', 'arched', 'angry', 'worried', 'unibrow', 'none'],
  mouth: ['smile', 'frown', 'open', 'flat', 'teeth', 'smirk', 'grin', 'tongue', 'oh'],
  nose: ['small', 'pointy', 'wide', 'button', 'long', 'snub'],
  ears: ['small', 'big', 'pointed', 'elf', 'none'],
  hair: ['short', 'long', 'curly', 'mohawk', 'bald', 'ponytail', 'spiky', 'bob', 'afro', 'bangs'],
  beard: ['stubble', 'goatee', 'full', 'mustache', 'handlebar', 'none'],
  accessories: ['glasses', 'sunglasses', 'hat', 'headband', 'earrings', 'none'],
}
```

### `getPartThumbnail(category, name, skinColor?, hairColor?, eyeColor?)`

Returns an SVG string for a single part preview. Useful for building part pickers.

### `getAnimationNames()`

Returns `['idle', 'talk', 'blink', 'emote']`.

## FaceConfig

| Property | Required | Values | Default |
|---|---|---|---|
| `faceShape` | Yes | `round` `oval` `square` `heart` `long` `diamond` `wide` | — |
| `eyes` | Yes | `big` `small` `narrow` `round` `wink` `happy` `angry` `dots` `sleepy` `cross` `heart` | — |
| `eyebrows` | Yes | `thick` `thin` `arched` `angry` `worried` `unibrow` `none` | — |
| `mouth` | Yes | `smile` `frown` `open` `flat` `teeth` `smirk` `grin` `tongue` `oh` | — |
| `nose` | Yes | `small` `pointy` `wide` `button` `long` `snub` | — |
| `ears` | Yes | `small` `big` `pointed` `elf` `none` | — |
| `hair` | Yes | `short` `long` `curly` `mohawk` `bald` `ponytail` `spiky` `bob` `afro` `bangs` | — |
| `beard` | No | `stubble` `goatee` `full` `mustache` `handlebar` `none` | `none` |
| `accessories` | No | `glasses` `sunglasses` `hat` `headband` `earrings` `none` | `none` |
| `skinColor` | No | Preset name or hex color | `medium` |
| `hairColor` | No | Preset name or hex color | `black` |
| `eyeColor` | No | Preset name or hex color | `brown` |
| `backgroundColor` | No | Hex color or `transparent` | `#87CEEB` |

## Color presets

### Skin

| Preset | Color |
|---|---|
| `light` | `#FDDCB5` |
| `medium` | `#E8B88A` |
| `tan` | `#C8956C` |
| `brown` | `#8D5E3C` |
| `dark` | `#5C3A1E` |
| `pale` | `#FFF0E0` |

### Hair

`black` `brown` `blonde` `red` `gray` `white` `auburn` `strawberry` `platinum` `pink` `blue` `purple` `teal`

### Eyes

`brown` `blue` `green` `gray`

You can also pass any valid hex color (e.g. `#FF6600`) for any color property.

## Animations

Built-in animation presets that cycle through face variations:

| Name | Duration | What it does |
|---|---|---|
| `idle` | 3.3s | Rests, then does a quick happy-eyes blink |
| `blink` | 3s | Natural eye blink cycle |
| `talk` | 1s | Mouth shape variations |
| `emote` | 1.6s | Eyebrow raise + mouth reaction |

Pass them as strings to any framework component:

```jsx
<Avatar config={config} animation="blink" />
```

Or use the hooks/composables for more control:

```js
const svg = useAnimatedAvatar(config, 'talk')
```

You can also define custom animation sequences:

```js
const myAnimation = {
  name: 'custom',
  frames: [
    { duration: 500, overrides: {} },
    { duration: 200, overrides: { eyes: 'wink', mouth: 'smirk' } },
    { duration: 300, overrides: { eyes: 'big', mouth: 'grin' } },
  ],
}
```

## How it works

Each avatar is a 16x16 pixel grid. Parts (face, eyes, hair, etc.) are stamped onto the grid in layers, bottom to top:

```
Layer 0: Face shape (base)
Layer 1: Ears
Layer 2: Nose
Layer 3: Mouth
Layer 4: Eyes
Layer 5: Eyebrows
Layer 6: Hair
Layer 7: Beard
Layer 8: Accessories
```

Each part is defined as a small pixel array where numbers map to color roles (`1` = skin, `2` = shadow, etc.). The renderer resolves colors, stamps parts onto the grid, then converts the grid to an optimized SVG by merging horizontally adjacent same-color pixels into wider `<rect>` elements.

The result is a clean, scalable SVG with crisp pixel-art rendering — no blurry edges, no canvas required.

## License

[MIT](LICENSE) — do whatever you want with it.
