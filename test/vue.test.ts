// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { Avatar } from '../src/vue.ts';
import { generateFace } from '../src/renderer/index.ts';
import type { FaceConfig } from '../src/types.ts';

const CONFIG: FaceConfig = {
  faceShape: 'round',
  eyes: 'big',
  eyebrows: 'thick',
  mouth: 'smile',
  nose: 'small',
  ears: 'small',
  hair: 'short',
  beard: 'none',
  accessories: 'none',
  skinColor: 'medium',
  hairColor: 'black',
  eyeColor: 'brown',
};

describe('Vue Avatar component', () => {
  it('renders a div with SVG content', () => {
    const wrapper = mount(Avatar, { props: { config: CONFIG } });
    expect(wrapper.html()).toContain('<svg');
    expect(wrapper.html()).toContain('</svg>');
  });

  it('renders deterministic SVG for a given config', () => {
    const wrapper = mount(Avatar, { props: { config: CONFIG } });
    // jsdom expands self-closing tags, so compare text content via includes
    const expected = generateFace(CONFIG);
    const innerHTML = wrapper.element.innerHTML;
    // Both should contain the same fill colors and viewBox
    expect(innerHTML).toContain('viewBox="0 0 16 16"');
    expect(innerHTML).toContain('shape-rendering="crispEdges"');
    // Check that the fill colors from the expected SVG appear in the rendered output
    const fills = [...expected.matchAll(/fill="([^"]+)"/g)].map((m) => m[1]);
    for (const fill of fills) {
      expect(innerHTML).toContain(fill);
    }
  });

  it('applies size to style', () => {
    const wrapper = mount(Avatar, { props: { config: CONFIG, size: 64 } });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.width).toBe('64px');
    expect(style.height).toBe('64px');
  });

  it('uses default size of 128', () => {
    const wrapper = mount(Avatar, { props: { config: CONFIG } });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.width).toBe('128px');
    expect(style.height).toBe('128px');
  });

  it('sets pixelated image rendering', () => {
    const wrapper = mount(Avatar, { props: { config: CONFIG } });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.imageRendering).toBe('pixelated');
  });

  it('renders random face when no config is provided', () => {
    const wrapper = mount(Avatar);
    expect(wrapper.html()).toContain('<svg');
  });
});
