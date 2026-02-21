import { useMemo, useState, useEffect, useRef } from 'react';
import { generateFace, generateRandomConfig } from './renderer/index.ts';
import { ANIMATIONS } from './renderer/animations.ts';
import type { FaceConfig } from './types.ts';
import type { AnimationSequence } from './renderer/animations.ts';

export type { FaceConfig } from './types.ts';
export type { AnimationSequence } from './renderer/animations.ts';
export { generateRandomConfig } from './renderer/index.ts';

/** Hook: returns SVG string, memoized on config changes. If no config is provided, a random face is generated once. */
export function useAvatar(config?: FaceConfig): string {
  const stableConfig = useRef<FaceConfig | undefined>(undefined);
  if (!config && !stableConfig.current) {
    stableConfig.current = generateRandomConfig();
  }
  const resolved = config ?? stableConfig.current!;

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

/** Hook: cycles through animation frames, returns the current SVG string. */
export function useAnimatedAvatar(
  config: FaceConfig | undefined,
  animation: string | AnimationSequence | undefined,
): string {
  const stableConfig = useRef<FaceConfig | undefined>(undefined);
  if (!config && !stableConfig.current) {
    stableConfig.current = generateRandomConfig();
  }
  const resolved = config ?? stableConfig.current!;

  const sequence = useMemo(() => {
    if (!animation) return undefined;
    if (typeof animation === 'string') return ANIMATIONS[animation];
    return animation;
  }, [animation]);

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

/** Component: renders the avatar SVG inline, with optional animation. If no config is provided, a random face is generated. */
export function Avatar({
  config,
  size = 128,
  className,
  animation,
}: {
  config?: FaceConfig;
  size?: number;
  className?: string;
  animation?: string | AnimationSequence;
}) {
  const svg = useAnimatedAvatar(config, animation);
  return (
    <div
      className={className}
      style={{ width: size, height: size, imageRendering: 'pixelated' as const }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
