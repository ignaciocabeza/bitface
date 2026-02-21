import type { FaceConfig } from '../types.ts';

export interface AnimationFrame {
  duration: number; // milliseconds
  overrides: Partial<FaceConfig>;
}

export interface AnimationSequence {
  name: string;
  frames: AnimationFrame[];
}

export const ANIMATIONS: Record<string, AnimationSequence> = {
  idle: {
    name: 'idle',
    frames: [
      { duration: 3000, overrides: {} },
      { duration: 150, overrides: { eyes: 'happy' } },
      { duration: 150, overrides: {} },
    ],
  },
  talk: {
    name: 'talk',
    frames: [
      { duration: 200, overrides: { mouth: 'smile' } },
      { duration: 200, overrides: { mouth: 'open' } },
      { duration: 200, overrides: { mouth: 'flat' } },
      { duration: 200, overrides: { mouth: 'open' } },
      { duration: 300, overrides: { mouth: 'smile' } },
    ],
  },
  blink: {
    name: 'blink',
    frames: [
      { duration: 2500, overrides: {} },
      { duration: 100, overrides: { eyes: 'narrow' } },
      { duration: 100, overrides: { eyes: 'happy' } },
      { duration: 100, overrides: { eyes: 'narrow' } },
      { duration: 200, overrides: {} },
    ],
  },
  emote: {
    name: 'emote',
    frames: [
      { duration: 500, overrides: {} },
      { duration: 400, overrides: { eyebrows: 'arched', mouth: 'open' } },
      { duration: 400, overrides: { eyebrows: 'arched', mouth: 'smile' } },
      { duration: 300, overrides: {} },
    ],
  },
};

export function getAnimationNames(): string[] {
  return Object.keys(ANIMATIONS);
}
