import type { PartCategory } from '../../types.ts';

// Eyes are placed relative to face center.
// Slot map: 1 = white (sclera), 2 = eyeColor (iris), 3 = pupil (black)

const eyes: PartCategory = {
  big: {
    pixels: [
      [1,1,0,0,0,0,1,1],
      [1,2,1,0,0,1,2,1],
      [1,2,3,0,0,1,2,3],
      [1,1,0,0,0,0,1,1],
    ],
    slotMap: { 1: 'white', 2: 'eyes', 3: 'pupil' },
    offsetX: 4,
    offsetY: 7,
  },
  small: {
    pixels: [
      [0,2,0,0,0,0,2,0],
      [0,3,0,0,0,0,3,0],
    ],
    slotMap: { 2: 'eyes', 3: 'pupil' },
    offsetX: 4,
    offsetY: 8,
  },
  narrow: {
    pixels: [
      [1,2,3,0,0,1,2,3],
    ],
    slotMap: { 1: 'white', 2: 'eyes', 3: 'pupil' },
    offsetX: 4,
    offsetY: 8,
  },
  round: {
    pixels: [
      [0,1,0,0,0,0,1,0],
      [1,2,1,0,0,1,2,1],
      [1,2,3,0,0,1,2,3],
      [0,1,0,0,0,0,1,0],
    ],
    slotMap: { 1: 'white', 2: 'eyes', 3: 'pupil' },
    offsetX: 4,
    offsetY: 7,
  },
  wink: {
    pixels: [
      [1,1,0,0,0,0,0,0],
      [1,2,1,0,0,0,0,0],
      [1,2,3,0,0,3,3,3],
      [1,1,0,0,0,0,0,0],
    ],
    slotMap: { 1: 'white', 2: 'eyes', 3: 'pupil' },
    offsetX: 4,
    offsetY: 7,
  },
  happy: {
    pixels: [
      [0,3,3,0,0,0,3,3],
      [3,0,0,0,0,3,0,0],
    ],
    slotMap: { 3: 'pupil' },
    offsetX: 4,
    offsetY: 8,
  },
  angry: {
    pixels: [
      [1,1,0,0,0,0,1,1],
      [1,2,3,0,0,3,2,1],
      [0,1,1,0,0,1,1,0],
    ],
    slotMap: { 1: 'white', 2: 'eyes', 3: 'pupil' },
    offsetX: 4,
    offsetY: 7,
  },
  dots: {
    pixels: [
      [0,0,3,0,0,0,0,3],
    ],
    slotMap: { 3: 'pupil' },
    offsetX: 4,
    offsetY: 9,
  },
  sleepy: {
    pixels: [
      [1,1,0,0,0,0,1,1],
      [3,3,0,0,0,0,3,3],
    ],
    slotMap: { 1: 'white', 3: 'pupil' },
    offsetX: 4,
    offsetY: 8,
  },
  cross: {
    pixels: [
      [3,0,3,0,0,3,0,3],
      [0,3,0,0,0,0,3,0],
      [3,0,3,0,0,3,0,3],
    ],
    slotMap: { 3: 'pupil' },
    offsetX: 4,
    offsetY: 7,
  },
  heart: {
    pixels: [
      [2,0,2,0,0,2,0,2],
      [2,2,2,0,0,2,2,2],
      [0,2,0,0,0,0,2,0],
    ],
    slotMap: { 2: 'eyes' },
    offsetX: 4,
    offsetY: 7,
  },
};

export default eyes;
