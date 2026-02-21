import { describe, it, expect } from 'vitest';
import {
  generateFace,
  generateRandomConfig,
  getAvailableParts,
  getPartThumbnail,
  getAnimationNames,
  ANIMATIONS,
  SKIN_PRESETS,
  HAIR_PRESETS,
  EYE_PRESETS,
} from '../src/index.ts';

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

const VALID_CONFIG = {
  faceShape: 'round',
  eyes: 'big',
  eyebrows: 'thick',
  mouth: 'smile',
  nose: 'small',
  ears: 'small',
  hair: 'short',
} as const;

function isValidSvg(svg: string) {
  expect(svg).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  expect(svg).toMatch(/<\/svg>$/);
  expect(svg).toContain('viewBox="0 0 16 16"');
  expect(svg).toContain('shape-rendering="crispEdges"');
}

describe('generateFace', () => {
  it('returns valid SVG with no arguments', () => {
    isValidSvg(generateFace());
  });

  it('returns valid SVG with a config', () => {
    isValidSvg(generateFace(VALID_CONFIG));
  });

  it('is deterministic for the same config', () => {
    const a = generateFace(VALID_CONFIG);
    const b = generateFace(VALID_CONFIG);
    expect(a).toBe(b);
  });

  it('produces different output for different configs', () => {
    const a = generateFace({ ...VALID_CONFIG, eyes: 'big' });
    const b = generateFace({ ...VALID_CONFIG, eyes: 'narrow' });
    expect(a).not.toBe(b);
  });

  it('works with only required fields (no optional)', () => {
    const svg = generateFace(VALID_CONFIG);
    isValidSvg(svg);
  });

  it('works with custom hex colors', () => {
    const svg = generateFace({ ...VALID_CONFIG, skinColor: '#FF0000', backgroundColor: '#00FF00' });
    isValidSvg(svg);
    expect(svg).toContain('#FF0000');
    expect(svg).toContain('#00FF00');
  });

  it('supports transparent background', () => {
    const svg = generateFace({ ...VALID_CONFIG, backgroundColor: 'transparent' });
    isValidSvg(svg);
    expect(svg).not.toContain('#87CEEB');
  });
});

describe('generateRandomConfig', () => {
  it('returns config with all required fields', () => {
    const config = generateRandomConfig();
    expect(config.faceShape).toBeTypeOf('string');
    expect(config.eyes).toBeTypeOf('string');
    expect(config.eyebrows).toBeTypeOf('string');
    expect(config.mouth).toBeTypeOf('string');
    expect(config.nose).toBeTypeOf('string');
    expect(config.ears).toBeTypeOf('string');
    expect(config.hair).toBeTypeOf('string');
  });

  it('uses valid part variant names', () => {
    const parts = getAvailableParts();
    const config = generateRandomConfig();
    expect(parts.faceShape).toContain(config.faceShape);
    expect(parts.eyes).toContain(config.eyes);
    expect(parts.eyebrows).toContain(config.eyebrows);
    expect(parts.mouth).toContain(config.mouth);
    expect(parts.nose).toContain(config.nose);
    expect(parts.ears).toContain(config.ears);
    expect(parts.hair).toContain(config.hair);
  });

  it('uses valid preset names for colors', () => {
    const config = generateRandomConfig();
    expect(Object.keys(SKIN_PRESETS)).toContain(config.skinColor);
    expect(Object.keys(HAIR_PRESETS)).toContain(config.hairColor);
    expect(Object.keys(EYE_PRESETS)).toContain(config.eyeColor);
  });

  it('produces varied results across calls', () => {
    const configs = Array.from({ length: 10 }, () => JSON.stringify(generateRandomConfig()));
    const unique = new Set(configs);
    expect(unique.size).toBeGreaterThan(1);
  });
});

describe('getAvailableParts', () => {
  it('returns all expected categories', () => {
    const parts = getAvailableParts();
    const categories = ['faceShape', 'eyes', 'eyebrows', 'mouth', 'nose', 'ears', 'hair', 'beard', 'accessories'];
    for (const cat of categories) {
      expect(parts[cat]).toBeDefined();
      expect(parts[cat].length).toBeGreaterThan(0);
    }
  });
});

describe('getPartThumbnail', () => {
  it('returns valid SVG for every part variant', () => {
    const parts = getAvailableParts();
    for (const [category, variants] of Object.entries(parts)) {
      for (const variant of variants) {
        const svg = getPartThumbnail(category, variant);
        expect(svg).toMatch(/^<svg/);
        expect(svg).toMatch(/<\/svg>$/);
      }
    }
  });

  it('returns SVG (empty face) for unknown parts', () => {
    const svg = getPartThumbnail('faceShape', 'nonexistent');
    expect(svg).toMatch(/^<svg/);
  });
});

describe('color presets', () => {
  it('SKIN_PRESETS has valid hex values', () => {
    expect(Object.keys(SKIN_PRESETS).length).toBeGreaterThan(0);
    for (const hex of Object.values(SKIN_PRESETS)) {
      expect(hex).toMatch(HEX_RE);
    }
  });

  it('HAIR_PRESETS has valid hex values', () => {
    expect(Object.keys(HAIR_PRESETS).length).toBeGreaterThan(0);
    for (const hex of Object.values(HAIR_PRESETS)) {
      expect(hex).toMatch(HEX_RE);
    }
  });

  it('EYE_PRESETS has valid hex values', () => {
    expect(Object.keys(EYE_PRESETS).length).toBeGreaterThan(0);
    for (const hex of Object.values(EYE_PRESETS)) {
      expect(hex).toMatch(HEX_RE);
    }
  });
});

describe('animations', () => {
  it('getAnimationNames returns expected presets', () => {
    const names = getAnimationNames();
    expect(names).toContain('idle');
    expect(names).toContain('talk');
    expect(names).toContain('blink');
    expect(names).toContain('emote');
  });

  it('ANIMATIONS entries have valid structure', () => {
    for (const [key, seq] of Object.entries(ANIMATIONS)) {
      expect(seq.name).toBe(key);
      expect(seq.frames.length).toBeGreaterThan(0);
      for (const frame of seq.frames) {
        expect(frame.duration).toBeGreaterThan(0);
        expect(frame.overrides).toBeTypeOf('object');
      }
    }
  });
});
