import type { PartCategory, PartPattern } from '../../types.ts';
import faceShapes from './face-shapes.ts';
import eyes from './eyes.ts';
import eyebrows from './eyebrows.ts';
import mouth from './mouth.ts';
import nose from './nose.ts';
import ears from './ears.ts';
import hair from './hair.ts';
import beard from './beard.ts';
import accessories from './accessories.ts';

const registry: Record<string, PartCategory> = {
  faceShape: faceShapes,
  eyes,
  eyebrows,
  mouth,
  nose,
  ears,
  hair,
  beard,
  accessories,
};

export function getPart(category: string, name: string): PartPattern | undefined {
  return registry[category]?.[name];
}

export function getVariantNames(category: string): string[] {
  const cat = registry[category];
  return cat ? Object.keys(cat) : [];
}

export function getAllCategories(): string[] {
  return Object.keys(registry);
}

export { registry };
