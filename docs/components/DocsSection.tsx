import { useState } from 'react';
import { getAvailableParts } from '../../src/renderer/index.ts';
import { SKIN_PRESETS, HAIR_PRESETS, EYE_PRESETS } from '../../src/renderer/palette.ts';
import { getAnimationNames } from '../../src/renderer/animations.ts';
import { CodeBlock } from './CodeBlock.tsx';

const FRAMEWORK_EXAMPLES: Record<string, { code: string; language: string }> = {
  React: {
    language: 'tsx',
    code: `import { Avatar } from '@ignaciocabeza/bitface/react';

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
      intensity={80}
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
    :intensity="80"
  />
</template>

<script setup>
import { Avatar } from '@ignaciocabeza/bitface/vue';
</script>`,
  },
  Svelte: {
    language: 'svelte',
    code: `<script>
  import Avatar from '@ignaciocabeza/bitface/svelte';
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
  intensity={80}
/>`,
  },
  'Node.js': {
    language: 'ts',
    code: `import { generateFace } from '@ignaciocabeza/bitface';
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
  { name: 'generateRandomConfig(overrides?)', desc: 'Generates a random FaceConfig. Pass a Partial<FaceConfig> to pin specific fields while randomizing the rest.' },
  { name: 'getAvailableParts()', desc: 'Returns all part categories and their variant names.' },
  { name: 'getPartThumbnail(category, name, ...colors)', desc: 'Returns an SVG thumbnail for a single part variant.' },
  { name: 'getAnimationNames()', desc: 'Returns available animation preset names.' },
  { name: 'generateSufferingAnimation(pct, skinColor?)', desc: 'Generates a suffering AnimationSequence scaled by percentage (0\u2013100%). Controls expression intensity, twitch speed, and skin flush.' },
  { name: 'applyIntensity(sequence, intensity)', desc: 'Scales animation frame durations by intensity (0\u2013100). 50 = normal speed, 100 = 5\u00d7 faster, 0 = 5\u00d7 slower.' },
  { name: 'ANIMATIONS', desc: 'Animation sequence definitions (frames + durations).' },
  { name: 'SKIN_PRESETS / HAIR_PRESETS / EYE_PRESETS', desc: 'Color preset name-to-hex mappings.' },
];

const REACT_API_ITEMS = [
  { name: '<Avatar config={...} animation="blink" intensity={80} />', desc: 'React component. Config accepts Partial<FaceConfig> \u2014 missing fields are randomized once. Intensity (0\u2013100) controls animation speed.' },
  { name: 'useAvatar(config?)', desc: 'Hook that returns a memoized SVG string. Accepts full or partial config.' },
  { name: 'useAnimatedAvatar(config?, animation?, intensity?)', desc: 'Hook that cycles through animation frames. Accepts full or partial config. Intensity (0\u2013100, default 50) controls speed.' },
];

const VUE_API_ITEMS = [
  { name: '<Avatar :config="..." animation="blink" :intensity="80" />', desc: 'Vue component. Config accepts Partial<FaceConfig> \u2014 missing fields are randomized once. Intensity (0\u2013100) controls animation speed.' },
  { name: 'useAvatar(() => config)', desc: 'Composable that returns a computed SVG ref. Accepts full or partial config.' },
  { name: 'useAnimatedAvatar(() => config, () => anim, () => intensity?)', desc: 'Composable that cycles through animation frames. Accepts full or partial config. Intensity (0\u2013100, default 50) controls speed.' },
];

const SVELTE_API_ITEMS = [
  { name: '<Avatar config={...} animation="blink" intensity={80} />', desc: 'Svelte component. Config accepts Partial<FaceConfig> \u2014 missing fields are randomized once. Intensity (0\u2013100) controls animation speed.' },
];

const CONFIG_FIELDS: { name: string; type: string; defaultVal: string }[] = [
  { name: 'faceShape', type: 'string', defaultVal: 'random' },
  { name: 'eyes', type: 'string', defaultVal: 'random' },
  { name: 'eyebrows', type: 'string', defaultVal: 'random' },
  { name: 'mouth', type: 'string', defaultVal: 'random' },
  { name: 'nose', type: 'string', defaultVal: 'random' },
  { name: 'ears', type: 'string', defaultVal: 'random' },
  { name: 'hair', type: 'string', defaultVal: 'random' },
  { name: 'beard', type: 'string', defaultVal: 'random' },
  { name: 'accessories', type: 'string', defaultVal: 'random' },
  { name: 'skinColor', type: 'string', defaultVal: 'random' },
  { name: 'hairColor', type: 'string', defaultVal: 'random' },
  { name: 'eyeColor', type: 'string', defaultVal: 'random' },
  { name: 'backgroundColor', type: 'string', defaultVal: 'none' },
];

function ApiTable({ items }: { items: { name: string; desc: string }[] }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th className="text-left px-3 py-2 border-b-2 border-border text-muted-light text-xs uppercase tracking-wide">Export</th>
          <th className="text-left px-3 py-2 border-b-2 border-border text-muted-light text-xs uppercase tracking-wide">Description</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.name}>
            <td className="px-3 py-2 border-b border-table-border align-top"><code className="text-green text-[0.8rem]">{item.name}</code></td>
            <td className="px-3 py-2 border-b border-table-border align-top">{item.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function DocsSection() {
  const [activeTab, setActiveTab] = useState('React');
  const parts = getAvailableParts();
  const animationNames = getAnimationNames();

  return (
    <section id="docs" className="flex flex-col gap-8 py-8 max-sm:py-4 max-sm:gap-6">
      <div id="installation">
        <h2 className="text-xl text-white mb-3">Installation</h2>
        <CodeBlock code="npm install @ignaciocabeza/bitface" language="bash" />
      </div>

      <div id="quick-start">
        <h2 className="text-xl text-white mb-3">Quick Start</h2>
        <div className="flex gap-1 mb-2">
          {Object.keys(FRAMEWORK_EXAMPLES).map((tab) => (
            <button
              key={tab}
              className={
                'px-3.5 py-1.5 border border-border rounded-t-md cursor-pointer text-[0.8rem] transition-colors duration-150' +
                (activeTab === tab
                  ? ' bg-code text-green border-b-code'
                  : ' bg-card text-muted hover:text-[#ccc]')
              }
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

      <div id="reference">
        <h2 className="text-xl text-white mb-3">API Reference</h2>
        <h3 className="text-base text-[#ccc] mt-4 mb-2">Core <code className="text-green">@ignaciocabeza/bitface</code></h3>
        <ApiTable items={API_ITEMS} />

        <h3 className="text-base text-[#ccc] mt-4 mb-2">React <code className="text-green">@ignaciocabeza/bitface/react</code></h3>
        <ApiTable items={REACT_API_ITEMS} />

        <h3 className="text-base text-[#ccc] mt-4 mb-2">Vue <code className="text-green">@ignaciocabeza/bitface/vue</code></h3>
        <ApiTable items={VUE_API_ITEMS} />

        <h3 className="text-base text-[#ccc] mt-4 mb-2">Svelte <code className="text-green">@ignaciocabeza/bitface/svelte</code></h3>
        <ApiTable items={SVELTE_API_ITEMS} />
      </div>

      <div>
        <h2 className="text-xl text-white mb-3">FaceConfig Options</h2>
        <p className="text-muted-light text-sm mb-3">All fields are optional. Missing fields are filled randomly when using components or <code className="text-green">generateRandomConfig()</code>.</p>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="text-left px-3 py-2 border-b-2 border-border text-muted-light text-xs uppercase tracking-wide">Property</th>
              <th className="text-left px-3 py-2 border-b-2 border-border text-muted-light text-xs uppercase tracking-wide">Type</th>
              <th className="text-left px-3 py-2 border-b-2 border-border text-muted-light text-xs uppercase tracking-wide">Default</th>
              <th className="text-left px-3 py-2 border-b-2 border-border text-muted-light text-xs uppercase tracking-wide">Values</th>
            </tr>
          </thead>
          <tbody>
            {CONFIG_FIELDS.map((field) => (
              <tr key={field.name}>
                <td className="px-3 py-2 border-b border-table-border align-top"><code className="text-green text-[0.8rem]">{field.name}</code></td>
                <td className="px-3 py-2 border-b border-table-border align-top"><code className="text-green text-[0.8rem]">{field.type}</code></td>
                <td className="px-3 py-2 border-b border-table-border align-top"><code className="text-green text-[0.8rem]">{field.defaultVal}</code></td>
                <td className="px-3 py-2 border-b border-table-border align-top">{parts[field.name]?.join(', ') ?? '\u2014'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-xl text-white mb-3">Color Presets</h2>
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-base text-[#ccc] mt-4 mb-2">Skin</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SKIN_PRESETS).map(([name, hex]) => (
                <span key={name} className="flex items-center gap-1.5 text-xs text-muted-light" title={name}>
                  <span className="inline-block w-4.5 h-4.5 rounded-full border border-swatch-border" style={{ backgroundColor: hex }} />
                  <span>{name}</span>
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-base text-[#ccc] mt-4 mb-2">Hair</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(HAIR_PRESETS).map(([name, hex]) => (
                <span key={name} className="flex items-center gap-1.5 text-xs text-muted-light" title={name}>
                  <span className="inline-block w-4.5 h-4.5 rounded-full border border-swatch-border" style={{ backgroundColor: hex }} />
                  <span>{name}</span>
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-base text-[#ccc] mt-4 mb-2">Eye</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(EYE_PRESETS).map(([name, hex]) => (
                <span key={name} className="flex items-center gap-1.5 text-xs text-muted-light" title={name}>
                  <span className="inline-block w-4.5 h-4.5 rounded-full border border-swatch-border" style={{ backgroundColor: hex }} />
                  <span>{name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl text-white mb-3">Animations</h2>
        <p className="mb-3">Available presets: <code className="text-green">{animationNames.join(', ')}</code></p>
        <p className="mb-3">Pass an animation name as a string or a custom <code className="text-green">AnimationSequence</code> object to any component or hook.</p>
        <h3 className="text-base text-[#ccc] mt-4 mb-2">Intensity</h3>
        <p className="mb-2">All components and hooks accept an optional <code className="text-green">intensity</code> prop (0{'\u2013'}100) that controls animation speed:</p>
        <ul className="list-disc list-inside text-sm text-muted-light space-y-1 mb-3">
          <li><strong>0</strong> {'\u2014'} 5{'\u00d7'} slower than designed speed</li>
          <li><strong>50</strong> {'\u2014'} normal speed (default)</li>
          <li><strong>100</strong> {'\u2014'} 5{'\u00d7'} faster than designed speed</li>
        </ul>
        <p className="text-sm text-muted-light mb-3">Use <code className="text-green">applyIntensity(sequence, intensity)</code> to scale any <code className="text-green">AnimationSequence</code> programmatically.</p>
        <h3 className="text-base text-[#ccc] mt-4 mb-2">Suffering Generator</h3>
        <p className="mb-2"><code className="text-green">generateSufferingAnimation(percentage, skinColor?)</code> creates a dynamic animation scaled by intensity (0{'\u2013'}100%):</p>
        <ul className="list-disc list-inside text-sm text-muted-light space-y-1 mb-3">
          <li><strong>0{'\u2013'}19%</strong> Mild discomfort {'\u2014'} worried brows, flat mouth</li>
          <li><strong>20{'\u2013'}39%</strong> Uncomfortable {'\u2014'} frown, narrow-eye twitches</li>
          <li><strong>40{'\u2013'}59%</strong> Pain {'\u2014'} angry brows, alternating expressions</li>
          <li><strong>60{'\u2013'}79%</strong> Intense {'\u2014'} cross eyes, open mouth</li>
          <li><strong>80{'\u2013'}100%</strong> Maximum {'\u2014'} rapid twitching, deep red flush</li>
        </ul>
        <p className="text-sm text-muted-light">Pass an optional <code className="text-green">skinColor</code> to get progressive skin reddening that blends from the base skin tone.</p>
      </div>
    </section>
  );
}
