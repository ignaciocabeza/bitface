import type { FaceConfig } from '../types.ts';
import { generateGrid, generatePartThumbnail } from './generator.ts';
import { gridToSvg } from './svg.ts';
import { getVariantNames, getAllCategories } from './parts/index.ts';
import { SKIN_PRESETS, HAIR_PRESETS, EYE_PRESETS } from './palette.ts';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generate a random FaceConfig. Pass a partial config to pin specific fields while randomizing the rest. */
export function generateRandomConfig(overrides?: Partial<FaceConfig>): FaceConfig {
  return {
    faceShape: pickRandom(getVariantNames('faceShape')),
    eyes: pickRandom(getVariantNames('eyes')),
    eyebrows: pickRandom(getVariantNames('eyebrows')),
    mouth: pickRandom(getVariantNames('mouth')),
    nose: pickRandom(getVariantNames('nose')),
    ears: pickRandom(getVariantNames('ears')),
    hair: pickRandom(getVariantNames('hair')),
    beard: pickRandom(getVariantNames('beard')),
    accessories: pickRandom(getVariantNames('accessories')),
    skinColor: pickRandom(Object.keys(SKIN_PRESETS)),
    hairColor: pickRandom(Object.keys(HAIR_PRESETS)),
    eyeColor: pickRandom(Object.keys(EYE_PRESETS)),
    ...overrides,
  };
}

/** Generate a complete face SVG string. If no config is provided, a random face is generated. */
export function generateFace(config?: FaceConfig): string {
  const resolved = config ?? generateRandomConfig();
  const grid = generateGrid(resolved);
  return gridToSvg(grid, resolved.backgroundColor);
}

/** Get all available part variant names, keyed by category. */
export function getAvailableParts(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const category of getAllCategories()) {
    result[category] = getVariantNames(category);
  }
  return result;
}

/** Generate a thumbnail SVG string showing a single part variant. */
export function getPartThumbnail(
  category: string,
  name: string,
  skinColor?: string,
  hairColor?: string,
  eyeColor?: string
): string {
  const grid = generatePartThumbnail(category, name, skinColor, hairColor, eyeColor);
  return gridToSvg(grid);
}
