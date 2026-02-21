import type { PartCategory } from '../../types.ts';

// Accessories layer on top of everything.
// Slot map: 1 = accessoryPrimary, 2 = accessorySecondary, 3 = lens (semi-transparent)

const accessories: PartCategory = {
  glasses: {
    pixels: [
      [0,0,1,1,1,1,0,0,1,1,1,1,0,0],
      [1,1,1,3,3,1,1,1,1,3,3,1,1,1],
      [0,0,1,1,1,1,0,0,1,1,1,1,0,0],
    ],
    slotMap: { 1: 'accessoryPrimary', 3: 'lens' },
    offsetX: 1,
    offsetY: 7,
  },
  sunglasses: {
    pixels: [
      [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
      [1,1,1,2,2,1,1,1,1,2,2,1,1,1],
      [0,0,1,1,1,1,0,0,1,1,1,1,0,0],
    ],
    slotMap: { 1: 'accessoryPrimary', 2: 'accessorySecondary' },
    offsetX: 1,
    offsetY: 7,
  },
  hat: {
    pixels: [
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
    ],
    slotMap: { 1: 'accessoryPrimary', 2: 'accessorySecondary' },
    offsetX: 0,
    offsetY: 0,
  },
  headband: {
    pixels: [
      [0,0,1,1,1,1,1,2,1,1,1,1,1,1,0,0],
    ],
    slotMap: { 1: 'accessoryPrimary', 2: 'accessorySecondary' },
    offsetX: 0,
    offsetY: 5,
  },
  earrings: {
    pixels: [
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    ],
    slotMap: { 1: 'accessoryPrimary' },
    offsetX: 0,
    offsetY: 11,
  },
  none: {
    pixels: [],
    slotMap: {},
    offsetX: 0,
    offsetY: 0,
  },
};

export default accessories;
