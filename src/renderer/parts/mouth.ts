import type { PartCategory } from '../../types.ts';

// Mouth is placed below the nose.
// Slot map: 1 = mouthColor (dark pink/red), 2 = teeth (white)

const mouth: PartCategory = {
  smile: {
    pixels: [
      [1,0,0,0,0,1],
      [0,1,1,1,1,0],
    ],
    slotMap: { 1: 'mouth' },
    offsetX: 5,
    offsetY: 12,
  },
  frown: {
    pixels: [
      [0,1,1,1,1,0],
      [1,0,0,0,0,1],
    ],
    slotMap: { 1: 'mouth' },
    offsetX: 5,
    offsetY: 12,
  },
  open: {
    pixels: [
      [0,1,1,1,1,0],
      [1,1,1,1,1,1],
      [0,1,1,1,1,0],
    ],
    slotMap: { 1: 'mouth' },
    offsetX: 5,
    offsetY: 11,
  },
  flat: {
    pixels: [
      [1,1,1,1,1,1],
    ],
    slotMap: { 1: 'mouth' },
    offsetX: 5,
    offsetY: 12,
  },
  teeth: {
    pixels: [
      [0,1,1,1,1,0],
      [0,2,2,2,2,0],
      [0,1,1,1,1,0],
    ],
    slotMap: { 1: 'mouth', 2: 'white' },
    offsetX: 5,
    offsetY: 11,
  },
  smirk: {
    pixels: [
      [0,0,0,0,1,0],
      [0,1,1,1,0,0],
    ],
    slotMap: { 1: 'mouth' },
    offsetX: 5,
    offsetY: 12,
  },
  grin: {
    pixels: [
      [0,1,1,1,1,1,1,0],
      [0,1,2,2,2,2,1,0],
      [0,0,1,1,1,1,0,0],
    ],
    slotMap: { 1: 'mouth', 2: 'white' },
    offsetX: 4,
    offsetY: 11,
  },
  tongue: {
    pixels: [
      [0,1,1,1,1,0],
      [0,0,1,1,0,0],
      [0,0,0,1,0,0],
    ],
    slotMap: { 1: 'mouth' },
    offsetX: 5,
    offsetY: 12,
  },
  oh: {
    pixels: [
      [0,1,1,0],
      [1,0,0,1],
      [0,1,1,0],
    ],
    slotMap: { 1: 'mouth' },
    offsetX: 6,
    offsetY: 11,
  },
};

export default mouth;
