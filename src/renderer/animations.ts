import type { FaceConfig } from '../types.ts';
import { resolveSkinColor } from './palette.ts';

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
  sleepy: {
    name: 'sleepy',
    frames: [
      { duration: 2000, overrides: { eyes: 'sleepy' } },
      { duration: 400, overrides: { eyes: 'narrow' } },
      { duration: 800, overrides: { eyes: 'happy' } },
      { duration: 400, overrides: { eyes: 'narrow' } },
      { duration: 1500, overrides: { eyes: 'sleepy' } },
      { duration: 300, overrides: { eyes: 'narrow' } },
      { duration: 1200, overrides: { eyes: 'happy', mouth: 'open' } },
      { duration: 300, overrides: { eyes: 'narrow' } },
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

/** Scale animation frame durations by intensity (0–100). 50 = normal speed, 100 = 5× faster, 0 = 5× slower. */
export function applyIntensity(sequence: AnimationSequence, intensity: number): AnimationSequence {
  const clamped = Math.max(0, Math.min(100, intensity));
  if (clamped === 50) return sequence;
  // Exponential scale: 0 → 5× slower, 50 → 1×, 100 → 5× faster
  const factor = Math.pow(0.2, (clamped - 50) / 50);
  return {
    name: sequence.name,
    frames: sequence.frames.map((f) => ({
      ...f,
      duration: Math.max(50, Math.round(f.duration * factor)),
    })),
  };
}

function blendToRed(skinColor: string | undefined, intensity: number): string {
  const hex = resolveSkinColor(skinColor);
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 0xFF;
  const g = (num >> 8) & 0xFF;
  const b = num & 0xFF;
  const t = intensity / 100;
  // Exponential curve: subtle at low %, aggressive at high %
  const curve = t * t;
  // Push red up hard, crush green/blue
  const nr = Math.min(255, Math.round(r + (255 - r) * curve * 0.85));
  const ng = Math.max(0, Math.round(g * (1 - curve * 0.75)));
  const nb = Math.max(0, Math.round(b * (1 - curve * 0.85)));
  return `#${((nr << 16) | (ng << 8) | nb).toString(16).padStart(6, '0').toUpperCase()}`;
}

/** Generate a suffering animation whose intensity scales with percentage (0–100). */
export function generateSufferingAnimation(percentage: number, skinColor?: string): AnimationSequence {
  const p = Math.max(0, Math.min(100, percentage));
  const flush = blendToRed(skinColor, p);

  // Twitch speed: slower at low %, frantic at high %
  const baseDuration = Math.round(800 - p * 6); // 800ms → 200ms
  const holdDuration = Math.round(1200 - p * 10); // 1200ms → 200ms

  const frames: AnimationFrame[] = [];

  if (p < 20) {
    // Mild discomfort — worried look, occasional twitch
    frames.push(
      { duration: holdDuration, overrides: { eyebrows: 'worried', mouth: 'flat', skinColor: flush } },
      { duration: baseDuration, overrides: { eyebrows: 'worried', mouth: 'frown', skinColor: flush } },
    );
  } else if (p < 40) {
    // Uncomfortable — frown with narrow-eye twitches
    frames.push(
      { duration: holdDuration, overrides: { eyebrows: 'worried', mouth: 'frown', skinColor: flush } },
      { duration: baseDuration, overrides: { eyebrows: 'worried', eyes: 'narrow', mouth: 'frown', skinColor: flush } },
      { duration: baseDuration, overrides: { eyebrows: 'worried', mouth: 'flat', skinColor: flush } },
    );
  } else if (p < 60) {
    // Pain — angry brows, alternating expressions
    frames.push(
      { duration: holdDuration, overrides: { eyebrows: 'angry', eyes: 'narrow', mouth: 'frown', skinColor: flush } },
      { duration: baseDuration, overrides: { eyebrows: 'angry', eyes: 'angry', mouth: 'open', skinColor: flush } },
      { duration: baseDuration, overrides: { eyebrows: 'angry', eyes: 'narrow', mouth: 'frown', skinColor: flush } },
    );
  } else if (p < 80) {
    // Intense pain — cross eyes, open mouth
    frames.push(
      { duration: holdDuration, overrides: { eyebrows: 'angry', eyes: 'cross', mouth: 'open', skinColor: flush } },
      { duration: baseDuration, overrides: { eyebrows: 'angry', eyes: 'narrow', mouth: 'frown', skinColor: flush } },
      { duration: baseDuration, overrides: { eyebrows: 'angry', eyes: 'cross', mouth: 'oh', skinColor: flush } },
      { duration: baseDuration, overrides: { eyebrows: 'angry', eyes: 'angry', mouth: 'open', skinColor: flush } },
    );
  } else {
    // Maximum suffering — rapid twitching
    frames.push(
      { duration: baseDuration, overrides: { eyebrows: 'angry', eyes: 'cross', mouth: 'oh', skinColor: flush } },
      { duration: baseDuration, overrides: { eyebrows: 'angry', eyes: 'narrow', mouth: 'open', skinColor: flush } },
      { duration: baseDuration, overrides: { eyebrows: 'angry', eyes: 'cross', mouth: 'frown', skinColor: flush } },
      { duration: baseDuration, overrides: { eyebrows: 'angry', eyes: 'angry', mouth: 'oh', skinColor: flush } },
      { duration: baseDuration, overrides: { eyebrows: 'angry', eyes: 'cross', mouth: 'open', skinColor: flush } },
    );
  }

  return { name: `suffering-${p}`, frames };
}
