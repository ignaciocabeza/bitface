<script>
  import { generateFace, generateRandomConfig } from '../renderer/index.ts';
  import { ANIMATIONS, applyIntensity, generateSufferingAnimation } from '../renderer/animations.ts';

  /** @type {Partial<import('../../src/types.ts').FaceConfig> | undefined} */
  export let config = undefined;
  /** @type {number} */
  export let size = 128;
  /** @type {string | import('../renderer/animations.ts').AnimationSequence | undefined} */
  export let animation = undefined;
  /** @type {number | undefined} */
  export let intensity = undefined;

  const fallbackConfig = generateRandomConfig(config);

  let frameIndex = 0;
  let timer;

  $: resolvedConfig = config ? { ...fallbackConfig, ...config } : fallbackConfig;

  $: rawSequence =
    !animation
      ? undefined
      : animation === 'suffering'
        ? generateSufferingAnimation(intensity ?? 50, resolvedConfig.skinColor)
        : typeof animation === 'string'
          ? ANIMATIONS[animation]
          : animation;

  $: sequence = rawSequence && animation !== 'suffering' && intensity !== undefined
    ? applyIntensity(rawSequence, intensity)
    : rawSequence;

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
