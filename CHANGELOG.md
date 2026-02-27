# Changelog

## [1.1.0] - 2025-05-28

### Added

- **Suffering as a prop**: `animation="suffering"` now works directly via the `intensity` prop across React, Vue, and Svelte — no need to call `generateSufferingAnimation()` manually. The `intensity` prop (0–100) controls both the suffering percentage and animation speed for all other animations.
- **Animation intensity**: new `intensity` prop (0–100) on all framework components and hooks. For standard animations it controls speed (50 = normal, 100 = 5× faster, 0 = 5× slower). For `"suffering"` it controls the suffering percentage. Also available as `applyIntensity(sequence, intensity)` for programmatic use.
- **Sleepy animation**: new `sleepy` animation preset — drowsy eyes, slow blinks, and yawns.
- **Suffering animation generator**: `generateSufferingAnimation(percentage, skinColor?)` for programmatic use — creates a dynamic animation that scales from mild discomfort to maximum suffering (0–100%) with progressive skin flush.
- **Partial config support**: `generateRandomConfig(overrides?)` now accepts an optional `Partial<FaceConfig>` to pin specific fields while randomizing the rest. All framework components (`<Avatar>`, `useAvatar`, `useAnimatedAvatar`) across React, Vue, and Svelte now accept `Partial<FaceConfig>` — missing fields are filled randomly once on mount.
- **Docs: Animations demo section**: interactive cards showcasing all animation presets with per-card intensity sliders and framework code snippets (React, Vue, Svelte, Node.js) that update live.
- **Docs: Navigation menu**: card-style nav with random avatars linking to Quick Start, Reference, Animations, and Playground sections.
- **Docs: Playground improvements**: unified intensity slider for all animations, suffering "Play Demo" auto-ramp, selective randomization with dice buttons on part selectors and color pickers.

### Changed

- **Playground**: replaced separate "Speed" and "Suffering %" sliders with a single "Intensity" slider that controls all animations uniformly.
- **Docs CSS**: migrated custom CSS classes to Tailwind v4 utility classes.

## [1.0.1] - 2025-02-21

### Fixed

- Hardcoded favicon path resolved.
- Install badge corrected.

## [1.0.0] - 2026-02-21

### Added

- Initial release.
- 16x16 pixel art SVG avatar generator with zero dependencies.
- 9 customizable face part categories: face shape, eyes, eyebrows, mouth, nose, ears, hair, beard, accessories.
- Color presets for skin, hair, and eyes.
- Animation system with idle, talk, blink, and emote presets.
- Framework integrations: React, Vue, and Svelte components and hooks.
- Interactive playground demo site.
