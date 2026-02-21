import type { FaceConfig, PixelGrid, PartPattern } from '../types.ts';
import { getPart } from './parts/index.ts';
import {
  resolveSkinColor,
  resolveSkinShadow,
  resolveHairColor,
  resolveEyeColor,
} from './palette.ts';

const BASE_SIZE = 16;

/** Build a color lookup from role names to actual hex colors. */
function buildColorMap(config: FaceConfig): Record<string, string> {
  const skin = resolveSkinColor(config.skinColor);
  const skinShadow = resolveSkinShadow(skin);
  const hairColor = resolveHairColor(config.hairColor);
  const eyeColor = resolveEyeColor(config.eyeColor);

  return {
    skin,
    skinShadow,
    hair: hairColor,
    hairShadow: darkenColor(hairColor, 25),
    eyes: eyeColor,
    pupil: '#111111',
    white: '#FFFFFF',
    mouth: '#C75050',
    accessoryPrimary: '#333333',
    accessorySecondary: '#1A1A1A',
    lens: '#87CEEB',
  };
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/** Stamp a part pattern onto the 16×16 pixel grid using the color map. */
function stampPart(
  grid: PixelGrid,
  part: PartPattern,
  colorMap: Record<string, string>
): void {
  for (let py = 0; py < part.pixels.length; py++) {
    const row = part.pixels[py];
    for (let px = 0; px < row.length; px++) {
      const slot = row[px];
      if (slot === 0) continue;

      const role = part.slotMap[slot];
      if (!role) continue;

      const color = colorMap[role];
      if (!color) continue;

      const gx = part.offsetX + px;
      const gy = part.offsetY + py;
      if (gx >= 0 && gx < BASE_SIZE && gy >= 0 && gy < BASE_SIZE) {
        grid[gy][gx] = color;
      }
    }
  }
}

/** Layer order for stamping parts onto the grid. */
const LAYER_ORDER: { category: string; configKey: keyof FaceConfig }[] = [
  { category: 'faceShape', configKey: 'faceShape' },
  { category: 'ears', configKey: 'ears' },
  { category: 'nose', configKey: 'nose' },
  { category: 'mouth', configKey: 'mouth' },
  { category: 'eyes', configKey: 'eyes' },
  { category: 'eyebrows', configKey: 'eyebrows' },
  { category: 'hair', configKey: 'hair' },
  { category: 'beard', configKey: 'beard' },
  { category: 'accessories', configKey: 'accessories' },
];

/** Generate a 16×16 pixel grid from a FaceConfig. */
export function generateGrid(config: FaceConfig): PixelGrid {
  const grid: PixelGrid = Array.from({ length: BASE_SIZE }, () =>
    Array.from({ length: BASE_SIZE }, () => null)
  );

  const colorMap = buildColorMap(config);

  for (const layer of LAYER_ORDER) {
    const name = config[layer.configKey] as string | undefined;
    if (!name || name === 'none') continue;

    const part = getPart(layer.category, name);
    if (!part) continue;

    stampPart(grid, part, colorMap);
  }

  return grid;
}

/** Generate a thumbnail grid showing a single part on a neutral background. */
export function generatePartThumbnail(
  category: string,
  name: string,
  skinColor?: string,
  hairColor?: string,
  eyeColor?: string
): PixelGrid {
  const grid: PixelGrid = Array.from({ length: BASE_SIZE }, () =>
    Array.from({ length: BASE_SIZE }, () => null)
  );

  const skin = resolveSkinColor(skinColor);
  const colorMap: Record<string, string> = {
    skin,
    skinShadow: resolveSkinShadow(skin),
    hair: resolveHairColor(hairColor),
    hairShadow: darkenColor(resolveHairColor(hairColor), 25),
    eyes: resolveEyeColor(eyeColor),
    pupil: '#111111',
    white: '#FFFFFF',
    mouth: '#C75050',
    accessoryPrimary: '#333333',
    accessorySecondary: '#1A1A1A',
    lens: '#87CEEB',
  };

  const part = getPart(category, name);
  if (part) {
    stampPart(grid, part, colorMap);
  }

  return grid;
}
