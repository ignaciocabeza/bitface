import type { PixelGrid } from '../types.ts';
import { sanitizeColor } from './palette.ts';

/** Convert a pixel grid to an SVG string. Grid dimensions are inferred from the array. */
export function gridToSvg(grid: PixelGrid, backgroundColor?: string): string {
  const height = grid.length;
  const width = height > 0 ? grid[0].length : 0;
  const raw = backgroundColor ?? '#87CEEB';
  const bg = raw === 'transparent' ? 'transparent' : sanitizeColor(raw, '#87CEEB');
  const rects: string[] = [];

  // Background (skip only when explicitly transparent)
  if (bg !== 'transparent') {
    rects.push(`<rect width="${width}" height="${height}" fill="${bg}"/>`);
  }

  // Merge adjacent same-color pixels horizontally for smaller SVG output.
  for (let y = 0; y < height; y++) {
    let x = 0;
    while (x < width) {
      const color = grid[y][x];
      if (color === null) {
        x++;
        continue;
      }
      // Find run of same color
      let runLen = 1;
      while (x + runLen < width && grid[y][x + runLen] === color) {
        runLen++;
      }
      rects.push(`<rect x="${x}" y="${y}" width="${runLen}" height="1" fill="${color}"/>`);
      x += runLen;
    }
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">`,
    ...rects,
    '</svg>',
  ].join('');
}
