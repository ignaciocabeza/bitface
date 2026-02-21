import { useState } from 'react';
import { getAvailableParts } from '../../src/renderer/index.ts';
import { SKIN_PRESETS, HAIR_PRESETS, EYE_PRESETS } from '../../src/renderer/palette.ts';
import { getAnimationNames } from '../../src/renderer/animations.ts';
import { CodeBlock } from './CodeBlock.tsx';

const FRAMEWORK_EXAMPLES: Record<string, { code: string; language: string }> = {
  React: {
    language: 'tsx',
    code: `import { Avatar } from 'bitface/react';

function MyComponent() {
  return (
    <Avatar
      config={{
        faceShape: 'round',
        eyes: 'big',
        eyebrows: 'thick',
        mouth: 'smile',
        nose: 'small',
        ears: 'small',
        hair: 'short',
      }}
      size={128}
      animation="blink"
    />
  );
}`,
  },
  Vue: {
    language: 'vue',
    code: `<template>
  <Avatar
    :config="{
      faceShape: 'round',
      eyes: 'big',
      eyebrows: 'thick',
      mouth: 'smile',
      nose: 'small',
      ears: 'small',
      hair: 'short',
    }"
    :size="128"
    animation="blink"
  />
</template>

<script setup>
import { Avatar } from 'bitface/vue';
</script>`,
  },
  Svelte: {
    language: 'svelte',
    code: `<script>
  import Avatar from 'bitface/svelte';
</script>

<Avatar
  config={{
    faceShape: 'round',
    eyes: 'big',
    eyebrows: 'thick',
    mouth: 'smile',
    nose: 'small',
    ears: 'small',
    hair: 'short',
  }}
  size={128}
  animation="blink"
/>`,
  },
  'Node.js': {
    language: 'ts',
    code: `import { generateFace } from 'bitface';
import { writeFileSync } from 'fs';

const svg = generateFace({
  faceShape: 'round',
  eyes: 'big',
  eyebrows: 'thick',
  mouth: 'smile',
  nose: 'small',
  ears: 'small',
  hair: 'short',
});

writeFileSync('avatar.svg', svg);`,
  },
};

const API_ITEMS = [
  { name: 'generateFace(config)', desc: 'Returns an SVG string from a FaceConfig object.' },
  { name: 'getAvailableParts()', desc: 'Returns all part categories and their variant names.' },
  { name: 'getPartThumbnail(category, name, ...colors)', desc: 'Returns an SVG thumbnail for a single part variant.' },
  { name: 'getAnimationNames()', desc: 'Returns available animation preset names.' },
  { name: 'ANIMATIONS', desc: 'Animation sequence definitions (frames + durations).' },
  { name: 'SKIN_PRESETS / HAIR_PRESETS / EYE_PRESETS', desc: 'Color preset name-to-hex mappings.' },
];

const REACT_API_ITEMS = [
  { name: '<Avatar config={...} size={128} animation="blink" />', desc: 'React component with optional animation.' },
  { name: 'useAvatar(config)', desc: 'Hook that returns a memoized SVG string.' },
  { name: 'useAnimatedAvatar(config, animation)', desc: 'Hook that cycles through animation frames.' },
];

const VUE_API_ITEMS = [
  { name: '<Avatar :config="..." :size="128" animation="blink" />', desc: 'Vue component with optional animation.' },
  { name: 'useAvatar(() => config)', desc: 'Composable that returns a computed SVG ref.' },
  { name: 'useAnimatedAvatar(() => config, () => anim)', desc: 'Composable that cycles through animation frames.' },
];

const SVELTE_API_ITEMS = [
  { name: '<Avatar config={...} size={128} animation="blink" />', desc: 'Svelte component with optional animation.' },
];

const CONFIG_FIELDS: { name: string; type: string; required: boolean; defaultVal: string }[] = [
  { name: 'faceShape', type: 'string', required: true, defaultVal: '—' },
  { name: 'eyes', type: 'string', required: true, defaultVal: '—' },
  { name: 'eyebrows', type: 'string', required: true, defaultVal: '—' },
  { name: 'mouth', type: 'string', required: true, defaultVal: '—' },
  { name: 'nose', type: 'string', required: true, defaultVal: '—' },
  { name: 'ears', type: 'string', required: true, defaultVal: '—' },
  { name: 'hair', type: 'string', required: true, defaultVal: '—' },
  { name: 'beard', type: 'string', required: false, defaultVal: '"none"' },
  { name: 'accessories', type: 'string', required: false, defaultVal: '"none"' },
  { name: 'skinColor', type: 'string', required: false, defaultVal: '"medium"' },
  { name: 'hairColor', type: 'string', required: false, defaultVal: '"black"' },
  { name: 'eyeColor', type: 'string', required: false, defaultVal: '"brown"' },
  { name: 'backgroundColor', type: 'string', required: false, defaultVal: '"#87CEEB"' },
];

export function DocsSection() {
  const [activeTab, setActiveTab] = useState('React');
  const parts = getAvailableParts();
  const animationNames = getAnimationNames();

  return (
    <section className="docs-section">
      <div className="docs-block">
        <h2>Installation</h2>
        <CodeBlock code="npm install bitface" language="bash" />
      </div>

      <div className="docs-block">
        <h2>Quick Start</h2>
        <div className="tabs">
          {Object.keys(FRAMEWORK_EXAMPLES).map((tab) => (
            <button
              key={tab}
              className={'tab-btn' + (activeTab === tab ? ' active' : '')}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <CodeBlock
          code={FRAMEWORK_EXAMPLES[activeTab].code}
          language={FRAMEWORK_EXAMPLES[activeTab].language}
        />
      </div>

      <div className="docs-block">
        <h2>API Reference</h2>
        <h3>Core <code>bitface</code></h3>
        <table className="api-table">
          <thead>
            <tr><th>Export</th><th>Description</th></tr>
          </thead>
          <tbody>
            {API_ITEMS.map((item) => (
              <tr key={item.name}>
                <td><code>{item.name}</code></td>
                <td>{item.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>React <code>bitface/react</code></h3>
        <table className="api-table">
          <thead>
            <tr><th>Export</th><th>Description</th></tr>
          </thead>
          <tbody>
            {REACT_API_ITEMS.map((item) => (
              <tr key={item.name}>
                <td><code>{item.name}</code></td>
                <td>{item.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Vue <code>bitface/vue</code></h3>
        <table className="api-table">
          <thead>
            <tr><th>Export</th><th>Description</th></tr>
          </thead>
          <tbody>
            {VUE_API_ITEMS.map((item) => (
              <tr key={item.name}>
                <td><code>{item.name}</code></td>
                <td>{item.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Svelte <code>bitface/svelte</code></h3>
        <table className="api-table">
          <thead>
            <tr><th>Export</th><th>Description</th></tr>
          </thead>
          <tbody>
            {SVELTE_API_ITEMS.map((item) => (
              <tr key={item.name}>
                <td><code>{item.name}</code></td>
                <td>{item.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="docs-block">
        <h2>FaceConfig Options</h2>
        <table className="api-table">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Required</th><th>Default</th><th>Values</th></tr>
          </thead>
          <tbody>
            {CONFIG_FIELDS.map((field) => (
              <tr key={field.name}>
                <td><code>{field.name}</code></td>
                <td><code>{field.type}</code></td>
                <td>{field.required ? 'Yes' : 'No'}</td>
                <td><code>{field.defaultVal}</code></td>
                <td>{parts[field.name]?.join(', ') ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="docs-block">
        <h2>Color Presets</h2>
        <div className="preset-grid">
          <div>
            <h3>Skin</h3>
            <div className="preset-swatches">
              {Object.entries(SKIN_PRESETS).map(([name, hex]) => (
                <span key={name} className="preset-swatch" title={name}>
                  <span className="preset-color" style={{ backgroundColor: hex }} />
                  <span className="preset-name">{name}</span>
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3>Hair</h3>
            <div className="preset-swatches">
              {Object.entries(HAIR_PRESETS).map(([name, hex]) => (
                <span key={name} className="preset-swatch" title={name}>
                  <span className="preset-color" style={{ backgroundColor: hex }} />
                  <span className="preset-name">{name}</span>
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3>Eye</h3>
            <div className="preset-swatches">
              {Object.entries(EYE_PRESETS).map(([name, hex]) => (
                <span key={name} className="preset-swatch" title={name}>
                  <span className="preset-color" style={{ backgroundColor: hex }} />
                  <span className="preset-name">{name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="docs-block">
        <h2>Animations</h2>
        <p>Available presets: <code>{animationNames.join(', ')}</code></p>
      </div>
    </section>
  );
}
