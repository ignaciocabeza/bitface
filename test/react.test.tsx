// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, render, act } from '@testing-library/react';
import { useAvatar, useAnimatedAvatar, Avatar } from '../src/react.tsx';
import { generateFace } from '../src/renderer/index.ts';
import type { FaceConfig } from '../src/types.ts';

const CONFIG: FaceConfig = {
  faceShape: 'round',
  eyes: 'big',
  eyebrows: 'thick',
  mouth: 'smile',
  nose: 'small',
  ears: 'small',
  hair: 'short',
  beard: 'none',
  accessories: 'none',
  skinColor: 'medium',
  hairColor: 'black',
  eyeColor: 'brown',
};

describe('useAvatar', () => {
  it('returns SVG matching generateFace for a given config', () => {
    const { result } = renderHook(() => useAvatar(CONFIG));
    expect(result.current).toBe(generateFace(CONFIG));
  });

  it('returns stable SVG when no config is provided (random)', () => {
    const { result, rerender } = renderHook(() => useAvatar());
    const first = result.current;
    expect(first).toMatch(/^<svg/);
    rerender();
    expect(result.current).toBe(first);
  });
});

describe('useAnimatedAvatar', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns static SVG when animation is undefined', () => {
    const { result } = renderHook(() => useAnimatedAvatar(CONFIG, undefined));
    expect(result.current).toBe(generateFace(CONFIG));
  });

  it('cycles through frames with blink animation', () => {
    const { result } = renderHook(() => useAnimatedAvatar(CONFIG, 'blink'));
    const frame0 = result.current;

    // blink: frame 0 has duration 2500ms, frame 1 overrides eyes: 'narrow'
    act(() => { vi.advanceTimersByTime(2500); });
    const frame1 = result.current;

    expect(frame0).not.toBe(frame1);
  });
});

describe('Avatar component', () => {
  it('renders a div with SVG content', () => {
    const { container } = render(<Avatar config={CONFIG} />);
    const div = container.firstElementChild as HTMLElement;
    expect(div.tagName).toBe('DIV');
    expect(div.innerHTML).toMatch(/^<svg/);
  });

  it('applies size to style', () => {
    const { container } = render(<Avatar config={CONFIG} size={64} />);
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.width).toBe('64px');
    expect(div.style.height).toBe('64px');
  });

  it('applies className', () => {
    const { container } = render(<Avatar config={CONFIG} className="my-avatar" />);
    const div = container.firstElementChild as HTMLElement;
    expect(div.className).toBe('my-avatar');
  });

  it('sets pixelated image rendering', () => {
    const { container } = render(<Avatar config={CONFIG} />);
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.imageRendering).toBe('pixelated');
  });

  it('renders random face when no config is provided', () => {
    const { container } = render(<Avatar />);
    const div = container.firstElementChild as HTMLElement;
    expect(div.innerHTML).toMatch(/^<svg/);
  });
});
