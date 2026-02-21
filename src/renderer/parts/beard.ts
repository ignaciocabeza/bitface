import type { PartCategory } from '../../types.ts';

// Beard/facial hair is drawn on the lower face area.
// Slot map: 1 = hair
// Beards are positioned at the jaw/chin edge (y=13-14) to avoid covering the mouth.
// Mustache variants sit just above the mouth (y=11).

const beard: PartCategory = {
  stubble: {
    // Sparse dots at chin/jaw edge
    pixels: [
      [0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0],
      [0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0],
    ],
    slotMap: { 1: 'hair' },
    offsetX: 0,
    offsetY: 13,
  },
  goatee: {
    // Small chin patch below the mouth
    pixels: [
      [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
    ],
    slotMap: { 1: 'hair' },
    offsetX: 0,
    offsetY: 13,
  },
  full: {
    // Jaw outline: sideburns at edges + solid chin, hollow center so mouth shows
    pixels: [
      [0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0],
      [0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
    ],
    slotMap: { 1: 'hair' },
    offsetX: 0,
    offsetY: 11,
  },
  mustache: {
    // Sits just above the mouth line
    pixels: [
      [0,0,1,1,0,0,1,1,0,0],
      [0,1,0,0,1,1,0,0,1,0],
    ],
    slotMap: { 1: 'hair' },
    offsetX: 3,
    offsetY: 11,
  },
  handlebar: {
    // Wide curling mustache
    pixels: [
      [0,0,1,1,0,0,0,0,1,1,0,0],
      [0,1,0,0,1,1,1,1,0,0,1,0],
      [1,0,0,0,0,0,0,0,0,0,0,1],
    ],
    slotMap: { 1: 'hair' },
    offsetX: 2,
    offsetY: 11,
  },
  none: {
    pixels: [],
    slotMap: {},
    offsetX: 0,
    offsetY: 0,
  },
};

export default beard;
