import type { PartCategory } from '../../types.ts';

// Nose sits between eyes and mouth.
// Slot map: 1 = skinShadow (nose is a subtle shadow on skin)

const nose: PartCategory = {
  small: {
    pixels: [
      [0,1,0],
      [1,0,1],
    ],
    slotMap: { 1: 'skinShadow' },
    offsetX: 7,
    offsetY: 10,
  },
  pointy: {
    pixels: [
      [0,1,0],
      [0,1,0],
      [1,0,1],
    ],
    slotMap: { 1: 'skinShadow' },
    offsetX: 7,
    offsetY: 9,
  },
  wide: {
    pixels: [
      [0,1,1,0],
      [1,0,0,1],
      [1,0,0,1],
    ],
    slotMap: { 1: 'skinShadow' },
    offsetX: 6,
    offsetY: 9,
  },
  button: {
    pixels: [
      [1,1],
    ],
    slotMap: { 1: 'skinShadow' },
    offsetX: 7,
    offsetY: 10,
  },
  long: {
    pixels: [
      [0,1,0],
      [0,1,0],
      [0,1,0],
      [1,0,1],
    ],
    slotMap: { 1: 'skinShadow' },
    offsetX: 7,
    offsetY: 8,
  },
  snub: {
    pixels: [
      [0,1],
      [1,1],
    ],
    slotMap: { 1: 'skinShadow' },
    offsetX: 7,
    offsetY: 10,
  },
};

export default nose;
