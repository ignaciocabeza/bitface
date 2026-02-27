import {
  computed,
  ref,
  watch,
  onUnmounted,
  defineComponent,
  h,
  type PropType,
} from 'vue';
import { generateFace, generateRandomConfig } from './renderer/index.ts';
import { ANIMATIONS, applyIntensity, generateSufferingAnimation } from './renderer/animations.ts';
import type { FaceConfig } from './types.ts';
import type { AnimationSequence } from './renderer/animations.ts';

export type { FaceConfig } from './types.ts';
export type { AnimationSequence } from './renderer/animations.ts';
export { generateRandomConfig } from './renderer/index.ts';

/** Composable: returns a computed SVG string from a reactive config. Accepts a full or partial config — missing fields are filled randomly once. */
export function useAvatar(config?: () => Partial<FaceConfig> | undefined) {
  let fallback: FaceConfig | undefined;
  return computed(() => {
    const c = config?.();
    if (!fallback) fallback = generateRandomConfig(c);
    if (c) return generateFace({ ...fallback, ...c });
    return generateFace(fallback);
  });
}

/** Composable: returns a ref that cycles through animation frames. Accepts a full or partial config. Intensity (0–100, default 50) controls speed. */
export function useAnimatedAvatar(
  config: () => Partial<FaceConfig> | undefined,
  animation: () => string | AnimationSequence | undefined,
  intensity?: () => number | undefined,
) {
  const frameIndex = ref(0);
  let timer: ReturnType<typeof setTimeout> | undefined;
  let fallback: FaceConfig | undefined;

  const sequence = computed(() => {
    const anim = animation();
    if (!anim) return undefined;
    const i = intensity?.();
    if (anim === 'suffering') {
      const c = config();
      const base = fallback ? { ...fallback, ...c } : c;
      return generateSufferingAnimation(i ?? 50, base?.skinColor);
    }
    const seq = typeof anim === 'string' ? ANIMATIONS[anim] : anim;
    if (!seq) return undefined;
    return i !== undefined ? applyIntensity(seq, i) : seq;
  });

  function scheduleNext() {
    const seq = sequence.value;
    if (!seq) return;
    const frame = seq.frames[frameIndex.value];
    if (!frame) return;

    timer = setTimeout(() => {
      frameIndex.value = (frameIndex.value + 1) % seq.frames.length;
      scheduleNext();
    }, frame.duration);
  }

  watch(
    sequence,
    () => {
      if (timer !== undefined) clearTimeout(timer);
      frameIndex.value = 0;
      scheduleNext();
    },
    { immediate: true },
  );

  onUnmounted(() => {
    if (timer !== undefined) clearTimeout(timer);
  });

  return computed(() => {
    const seq = sequence.value;
    const c = config();
    const base = { ...(fallback ??= generateRandomConfig(c)), ...c };
    if (!seq) return generateFace(base);
    const frame = seq.frames[frameIndex.value];
    if (!frame) return generateFace(base);
    return generateFace({ ...base, ...frame.overrides });
  });
}

/** Component: renders the avatar SVG inline, with optional animation. If no config is provided, a random face is generated. */
export const Avatar = defineComponent({
  name: 'Avatar',
  props: {
    config: {
      type: Object as PropType<Partial<FaceConfig>>,
      default: undefined,
    },
    size: {
      type: Number,
      default: 128,
    },
    animation: {
      type: [String, Object] as PropType<string | AnimationSequence>,
      default: undefined,
    },
    intensity: {
      type: Number,
      default: undefined,
    },
  },
  setup(props) {
    const svg = useAnimatedAvatar(
      () => props.config,
      () => props.animation,
      () => props.intensity,
    );

    return () =>
      h('div', {
        innerHTML: svg.value,
        style: {
          width: `${props.size}px`,
          height: `${props.size}px`,
          imageRendering: 'pixelated',
        },
      });
  },
});
