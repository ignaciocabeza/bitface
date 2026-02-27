import { useMemo, useState, useEffect, useRef } from 'react';
import { generateFace, generateRandomConfig } from './renderer/index.ts';
import { ANIMATIONS, applyIntensity, generateSufferingAnimation } from './renderer/animations.ts';
import type { FaceConfig } from './types.ts';
import type { AnimationSequence } from './renderer/animations.ts';

export type { FaceConfig } from './types.ts';
export type { AnimationSequence } from './renderer/animations.ts';
export { generateRandomConfig } from './renderer/index.ts';

/** Hook: returns SVG string, memoized on config changes. Accepts a full or partial config — missing fields are filled randomly once. */
export function useAvatar(config?: Partial<FaceConfig>): string {
  const stableConfig = useRef<FaceConfig | undefined>(undefined);
  if (!stableConfig.current) {
    stableConfig.current = generateRandomConfig(config);
  }
  const resolved = config ? { ...stableConfig.current, ...config } : stableConfig.current;

  return useMemo(() => generateFace(resolved), [
    resolved.faceShape,
    resolved.eyes,
    resolved.eyebrows,
    resolved.mouth,
    resolved.nose,
    resolved.ears,
    resolved.hair,
    resolved.beard,
    resolved.accessories,
    resolved.skinColor,
    resolved.hairColor,
    resolved.eyeColor,
    resolved.backgroundColor,
  ]);
}

/** Hook: cycles through animation frames, returns the current SVG string. Accepts a full or partial config. Intensity (0–100, default 50) controls animation speed. */
export function useAnimatedAvatar(
  config: Partial<FaceConfig> | undefined,
  animation: string | AnimationSequence | undefined,
  intensity?: number,
): string {
  const stableConfig = useRef<FaceConfig | undefined>(undefined);
  if (!stableConfig.current) {
    stableConfig.current = generateRandomConfig(config);
  }
  const resolved = config ? { ...stableConfig.current, ...config } : stableConfig.current;

  const sequence = useMemo(() => {
    if (!animation) return undefined;
    if (animation === 'suffering') return generateSufferingAnimation(intensity ?? 50, resolved.skinColor);
    const seq = typeof animation === 'string' ? ANIMATIONS[animation] : animation;
    if (!seq) return undefined;
    return intensity !== undefined ? applyIntensity(seq, intensity) : seq;
  }, [animation, intensity, resolved.skinColor]);

  const [frameIndex, setFrameIndex] = useState(0);

  // Reset frame when animation changes
  useEffect(() => {
    setFrameIndex(0);
  }, [sequence]);

  // Advance frames based on duration
  useEffect(() => {
    if (!sequence) return;
    const frame = sequence.frames[frameIndex];
    if (!frame) return;

    const timer = setTimeout(() => {
      setFrameIndex((i) => (i + 1) % sequence.frames.length);
    }, frame.duration);

    return () => clearTimeout(timer);
  }, [sequence, frameIndex]);

  const mergedConfig = useMemo(() => {
    if (!sequence) return resolved;
    const frame = sequence.frames[frameIndex];
    if (!frame) return resolved;
    return { ...resolved, ...frame.overrides };
  }, [resolved, sequence, frameIndex]);

  return useAvatar(mergedConfig);
}

/** Component: renders the avatar SVG inline, with optional animation. Accepts a full or partial config — missing fields are filled randomly once. */
export function Avatar({
  config,
  size = 128,
  className,
  animation,
  intensity,
}: {
  config?: Partial<FaceConfig>;
  size?: number;
  className?: string;
  animation?: string | AnimationSequence;
  intensity?: number;
}) {
  const svg = useAnimatedAvatar(config, animation, intensity);
  return (
    <div
      className={className}
      style={{ width: size, height: size, imageRendering: 'pixelated' as const }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
