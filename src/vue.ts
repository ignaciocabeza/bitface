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
import { ANIMATIONS } from './renderer/animations.ts';
import type { FaceConfig } from './types.ts';
import type { AnimationSequence } from './renderer/animations.ts';

export type { FaceConfig } from './types.ts';
export type { AnimationSequence } from './renderer/animations.ts';
export { generateRandomConfig } from './renderer/index.ts';

/** Composable: returns a computed SVG string from a reactive config. If no config is provided, a random face is generated once. */
export function useAvatar(config?: () => FaceConfig | undefined) {
  let fallback: FaceConfig | undefined;
  return computed(() => {
    const c = config?.();
    if (c) return generateFace(c);
    if (!fallback) fallback = generateRandomConfig();
    return generateFace(fallback);
  });
}

/** Composable: returns a ref that cycles through animation frames. */
export function useAnimatedAvatar(
  config: () => FaceConfig | undefined,
  animation: () => string | AnimationSequence | undefined,
) {
  const frameIndex = ref(0);
  let timer: ReturnType<typeof setTimeout> | undefined;
  let fallback: FaceConfig | undefined;

  const sequence = computed(() => {
    const anim = animation();
    if (!anim) return undefined;
    if (typeof anim === 'string') return ANIMATIONS[anim];
    return anim;
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
    const base = config() ?? (fallback ??= generateRandomConfig());
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
      type: Object as PropType<FaceConfig>,
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
  },
  setup(props) {
    const svg = useAnimatedAvatar(
      () => props.config,
      () => props.animation,
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
