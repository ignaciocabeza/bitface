import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SVELTE_PATH = resolve(ROOT, 'src/svelte/Avatar.svelte');
const DTS_PATH = resolve(ROOT, 'src/svelte/Avatar.svelte.d.ts');

describe('Svelte Avatar component (structural)', () => {
  it('Avatar.svelte file exists', () => {
    expect(existsSync(SVELTE_PATH)).toBe(true);
  });

  it('Avatar.svelte.d.ts file exists', () => {
    expect(existsSync(DTS_PATH)).toBe(true);
  });

  describe('Avatar.svelte source', () => {
    const source = readFileSync(SVELTE_PATH, 'utf-8');

    it('imports generateFace from the renderer', () => {
      expect(source).toContain("generateFace");
    });

    it('imports ANIMATIONS from the renderer', () => {
      expect(source).toContain("ANIMATIONS");
    });

    it('exports config prop', () => {
      expect(source).toContain('export let config');
    });

    it('exports size prop', () => {
      expect(source).toContain('export let size');
    });

    it('exports animation prop', () => {
      expect(source).toContain('export let animation');
    });

    it('renders SVG with {@html}', () => {
      expect(source).toContain('{@html svg}');
    });

    it('calls onDestroy for cleanup', () => {
      expect(source).toContain('onDestroy');
    });
  });

  describe('Avatar.svelte.d.ts types', () => {
    const dts = readFileSync(DTS_PATH, 'utf-8');

    it('exports FaceConfig type', () => {
      expect(dts).toContain('FaceConfig');
    });

    it('exports AnimationSequence type', () => {
      expect(dts).toContain('AnimationSequence');
    });

    it('defines config prop', () => {
      expect(dts).toContain('config');
    });

    it('defines size prop', () => {
      expect(dts).toContain('size');
    });

    it('defines animation prop', () => {
      expect(dts).toContain('animation');
    });
  });
});
