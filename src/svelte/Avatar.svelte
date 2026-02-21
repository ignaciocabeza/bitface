<script>
  import { generateFace, generateRandomConfig } from '../renderer/index.ts';
  import { ANIMATIONS } from '../renderer/animations.ts';

  /** @type {import('../../src/types.ts').FaceConfig | undefined} */
  export let config = undefined;
  /** @type {number} */
  export let size = 128;
  /** @type {string | import('../renderer/animations.ts').AnimationSequence | undefined} */
  export let animation = undefined;

  const fallbackConfig = config ? undefined : generateRandomConfig();

  let frameIndex = 0;
  let timer;

  $: resolvedConfig = config ?? fallbackConfig;

  $: sequence =
    !animation
      ? undefined
      : typeof animation === 'string'
        ? ANIMATIONS[animation]
        : animation;

  $: mergedConfig =
    sequence && sequence.frames[frameIndex]
      ? { ...resolvedConfig, ...sequence.frames[frameIndex].overrides }
      : resolvedConfig;

  $: svg = generateFace(mergedConfig);

  // Reset and start animation loop when sequence changes
  $: if (sequence) {
    clearTimeout(timer);
    frameIndex = 0;
    tick();
  }

  function tick() {
    if (!sequence) return;
    const frame = sequence.frames[frameIndex];
    if (!frame) return;
    timer = setTimeout(() => {
      frameIndex = (frameIndex + 1) % sequence.frames.length;
      tick();
    }, frame.duration);
  }

  import { onDestroy } from 'svelte';
  onDestroy(() => clearTimeout(timer));
</script>

<div
  class={$$props.class}
  style="width: {size}px; height: {size}px; image-rendering: pixelated;"
>
  {@html svg}
</div>
