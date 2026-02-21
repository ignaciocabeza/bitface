import type { SvelteComponent } from 'svelte';
import type { FaceConfig } from '../types.ts';
import type { AnimationSequence } from '../renderer/animations.ts';

export type { FaceConfig } from '../types.ts';
export type { AnimationSequence } from '../renderer/animations.ts';

interface AvatarProps {
  config?: FaceConfig;
  size?: number;
  animation?: string | AnimationSequence;
  class?: string;
}

export default class Avatar extends SvelteComponent<AvatarProps> {}
