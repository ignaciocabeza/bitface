export interface FaceConfig {
  faceShape: string;
  eyes: string;
  eyebrows: string;
  mouth: string;
  nose: string;
  ears: string;
  hair: string;
  beard?: string;
  accessories?: string;
  skinColor?: string;
  hairColor?: string;
  eyeColor?: string;
  backgroundColor?: string;
}

/** 16×16 grid. Each cell is a hex color string or null (transparent). */
export type PixelGrid = (string | null)[][];

/**
 * A part pattern definition.
 * - `pixels`: 2D array of integers. 0 = transparent, 1+ = color slot reference.
 * - `slotMap`: maps integer keys to color role names (e.g. "skin", "hair", "eyes").
 * - `offsetX`, `offsetY`: where this part is placed on the 16×16 canvas.
 */
export interface PartPattern {
  pixels: number[][];
  slotMap: Record<number, string>;
  offsetX: number;
  offsetY: number;
}

/** A named collection of part variants for one category. */
export type PartCategory = Record<string, PartPattern>;
