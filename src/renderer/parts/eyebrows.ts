import type { PartCategory } from '../../types.ts';

// Eyebrows sit above the eyes.
// Slot map: 1 = hairColor (eyebrows match hair)

const eyebrows: PartCategory = {
  thick: {
    pixels: [
      [1,1,1,0,0,1,1,1],
      [1,1,1,0,0,1,1,1],
    ],
    slotMap: { 1: 'hair' },
    offsetX: 4,
    offsetY: 6,
  },
  thin: {
    pixels: [
      [1,1,1,0,0,1,1,1],
    ],
    slotMap: { 1: 'hair' },
    offsetX: 4,
    offsetY: 6,
  },
  arched: {
    pixels: [
      [0,1,1,0,0,0,1,1],
      [1,0,0,0,0,1,0,0],
    ],
    slotMap: { 1: 'hair' },
    offsetX: 4,
    offsetY: 5,
  },
  angry: {
    pixels: [
      [1,0,0,0,0,0,0,1],
      [0,1,1,0,0,1,1,0],
    ],
    slotMap: { 1: 'hair' },
    offsetX: 4,
    offsetY: 5,
  },
  worried: {
    pixels: [
      [0,0,1,0,0,1,0,0],
      [0,1,0,0,0,0,1,0],
    ],
    slotMap: { 1: 'hair' },
    offsetX: 4,
    offsetY: 5,
  },
  unibrow: {
    pixels: [
      [1,1,1,1,1,1,1,1],
      [1,1,0,0,0,0,1,1],
    ],
    slotMap: { 1: 'hair' },
    offsetX: 4,
    offsetY: 5,
  },
  none: {
    pixels: [],
    slotMap: {},
    offsetX: 0,
    offsetY: 0,
  },
};

export default eyebrows;
