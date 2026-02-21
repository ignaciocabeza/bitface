import { describe, it, expect } from 'vitest';
import { sanitizeColor, resolveSkinColor, resolveHairColor, resolveEyeColor, SKIN_PRESETS, HAIR_PRESETS, EYE_PRESETS } from '../src/renderer/palette.ts';
import { generateFace } from '../src/renderer/index.ts';

const FALLBACK = '#000000';

const VALID_CONFIG = {
  faceShape: 'round',
  eyes: 'big',
  eyebrows: 'thick',
  mouth: 'smile',
  nose: 'small',
  ears: 'small',
  hair: 'short',
} as const;

describe('sanitizeColor', () => {
  describe('accepts valid hex colors', () => {
    const valid = ['#abc', '#ABCD', '#aabbcc', '#AABBCC', '#aabbccdd', '#AbCdEf'];
    for (const color of valid) {
      it(`accepts ${color}`, () => {
        expect(sanitizeColor(color, FALLBACK)).toBe(color);
      });
    }
  });

  describe('rejects invalid values and returns fallback', () => {
    const invalid = [
      '',
      'red',
      'rgb(255,0,0)',
      '#ab',
      '#abcde',
      '#abcdefghi',
      '"><script>alert(1)</script>',
      '" onload="alert(1)',
      'javascript:alert(1)',
      '#abc"><img src=x onerror=alert(1)>',
      '#abc;"<script>',
      'url(data:image/svg+xml,...)',
      '#abc\n"><script>alert(1)</script>',
    ];
    for (const value of invalid) {
      it(`rejects ${JSON.stringify(value)}`, () => {
        expect(sanitizeColor(value, FALLBACK)).toBe(FALLBACK);
      });
    }
  });
});

describe('resolveSkinColor', () => {
  it('returns default for undefined', () => {
    expect(resolveSkinColor(undefined)).toBe(SKIN_PRESETS.medium);
  });

  it('resolves preset names', () => {
    expect(resolveSkinColor('light')).toBe(SKIN_PRESETS.light);
  });

  it('passes through valid hex', () => {
    expect(resolveSkinColor('#FF0000')).toBe('#FF0000');
  });

  it('falls back to default for XSS payload', () => {
    expect(resolveSkinColor('" onload="alert(1)')).toBe(SKIN_PRESETS.medium);
  });
});

describe('resolveHairColor', () => {
  it('returns default for undefined', () => {
    expect(resolveHairColor(undefined)).toBe(HAIR_PRESETS.black);
  });

  it('resolves preset names', () => {
    expect(resolveHairColor('blonde')).toBe(HAIR_PRESETS.blonde);
  });

  it('falls back to default for XSS payload', () => {
    expect(resolveHairColor('"><script>')).toBe(HAIR_PRESETS.black);
  });
});

describe('resolveEyeColor', () => {
  it('returns default for undefined', () => {
    expect(resolveEyeColor(undefined)).toBe(EYE_PRESETS.brown);
  });

  it('resolves preset names', () => {
    expect(resolveEyeColor('blue')).toBe(EYE_PRESETS.blue);
  });

  it('falls back to default for XSS payload', () => {
    expect(resolveEyeColor('" style="x')).toBe(EYE_PRESETS.brown);
  });
});

describe('SVG injection prevention', () => {
  const XSS_PAYLOADS = [
    '"><script>alert(1)</script>',
    '" onload="alert(1)',
    '" onclick="fetch(x)',
    '" style="background:url(javascript:void)',
  ];

  it('blocks XSS via skinColor', () => {
    for (const payload of XSS_PAYLOADS) {
      const svg = generateFace({ ...VALID_CONFIG, skinColor: payload });
      expect(svg).not.toContain('script');
      expect(svg).not.toContain('onload');
      expect(svg).not.toContain('onclick');
      expect(svg).not.toContain('javascript');
    }
  });

  it('blocks XSS via hairColor', () => {
    for (const payload of XSS_PAYLOADS) {
      const svg = generateFace({ ...VALID_CONFIG, hairColor: payload });
      expect(svg).not.toContain('script');
      expect(svg).not.toContain('onload');
    }
  });

  it('blocks XSS via eyeColor', () => {
    for (const payload of XSS_PAYLOADS) {
      const svg = generateFace({ ...VALID_CONFIG, eyeColor: payload });
      expect(svg).not.toContain('script');
      expect(svg).not.toContain('onload');
    }
  });

  it('blocks XSS via backgroundColor', () => {
    for (const payload of XSS_PAYLOADS) {
      const svg = generateFace({ ...VALID_CONFIG, backgroundColor: payload });
      expect(svg).not.toContain('script');
      expect(svg).not.toContain('onload');
      expect(svg).not.toContain('onclick');
      expect(svg).not.toContain('javascript');
    }
  });

  it('blocks XSS when all color fields are malicious', () => {
    const svg = generateFace({
      ...VALID_CONFIG,
      skinColor: '"><script>alert(1)</script>',
      hairColor: '" onload="alert(2)',
      eyeColor: '" onclick="fetch(x)',
      backgroundColor: '"><img src=x onerror=alert(3)>',
    });
    expect(svg).not.toContain('<script>');
    expect(svg).not.toContain('onload');
    expect(svg).not.toContain('onclick');
    expect(svg).not.toContain('onerror');
    // Must still be valid SVG
    expect(svg).toMatch(/^<svg/);
    expect(svg).toMatch(/<\/svg>$/);
  });

  it('allows transparent backgroundColor', () => {
    const svg = generateFace({ ...VALID_CONFIG, backgroundColor: 'transparent' });
    expect(svg).not.toContain('#87CEEB');
    expect(svg).toMatch(/^<svg/);
  });
});
