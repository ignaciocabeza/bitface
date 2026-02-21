export const SKIN_PRESETS: Record<string, string> = {
  light: '#FDDCB5',
  medium: '#E8B88A',
  tan: '#D19A6A',
  brown: '#A0673C',
  dark: '#6B4226',
  pale: '#FFF0E0',
};

export const SKIN_SHADOW_MAP: Record<string, string> = {
  '#FDDCB5': '#E5C49D',
  '#E8B88A': '#CFA072',
  '#D19A6A': '#B98252',
  '#A0673C': '#885524',
  '#6B4226': '#533010',
  '#FFF0E0': '#E7D8C8',
};

export const HAIR_PRESETS: Record<string, string> = {
  black: '#1A1A2E',
  brown: '#6B3A2A',
  blonde: '#E8C84A',
  red: '#B83A1E',
  gray: '#9E9E9E',
  white: '#E8E8E8',
  auburn: '#8B3A1A',
  strawberry: '#D4713A',
  platinum: '#E8E0D0',
  pink: '#E8559E',
  blue: '#3A6BD5',
  purple: '#6B3A8B',
  teal: '#2A9E8B',
};

export const EYE_PRESETS: Record<string, string> = {
  brown: '#5C3A1E',
  blue: '#3A7BD5',
  green: '#3A9D5C',
  gray: '#7A7A7A',
};

const HEX_COLOR_RE = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/** Validate that a string is a safe hex color. Returns the color or the fallback. */
export function sanitizeColor(value: string, fallback: string): string {
  if (HEX_COLOR_RE.test(value)) return value;
  return fallback;
}

export function resolveSkinColor(value: string | undefined): string {
  if (!value) return SKIN_PRESETS.medium;
  return SKIN_PRESETS[value] ?? sanitizeColor(value, SKIN_PRESETS.medium);
}

export function resolveSkinShadow(skinHex: string): string {
  return SKIN_SHADOW_MAP[skinHex] ?? darken(skinHex, 30);
}

export function resolveHairColor(value: string | undefined): string {
  if (!value) return HAIR_PRESETS.black;
  return HAIR_PRESETS[value] ?? sanitizeColor(value, HAIR_PRESETS.black);
}

export function resolveEyeColor(value: string | undefined): string {
  if (!value) return EYE_PRESETS.brown;
  return EYE_PRESETS[value] ?? sanitizeColor(value, EYE_PRESETS.brown);
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xFF) - amount);
  const b = Math.max(0, (num & 0xFF) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase()}`;
}
