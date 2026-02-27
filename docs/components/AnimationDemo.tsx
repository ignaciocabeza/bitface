import { useMemo, useState, useCallback } from 'react';
import { generateRandomConfig } from '../../src/renderer/index.ts';
import { getAnimationNames } from '../../src/renderer/animations.ts';
import { useAnimatedAvatar } from '../../src/react.tsx';
import type { FaceConfig } from '../../src/types.ts';
import { CodeBlock } from './CodeBlock.tsx';

const DESCRIPTIONS: Record<string, string> = {
  idle: 'Subtle eye movement',
  blink: 'Natural blinking cycle',
  talk: 'Mouth animation loop',
  sleepy: 'Drowsy, heavy-lidded eyes',
  emote: 'Expressive eyebrow raise',
  suffering: 'Dynamic pain expression',
};

function getSnippets(name: string, intensity: number): { label: string; language: string; code: string }[] {
  const intensityProp = intensity !== 50;

  if (name === 'suffering') {
    return [
      {
        label: 'React',
        language: 'tsx',
        code: `import { Avatar } from '@ignaciocabeza/bitface/react';

<Avatar config={config} animation="suffering" intensity={${intensity}} />`,
      },
      {
        label: 'Vue',
        language: 'vue',
        code: `<script setup>
import { Avatar } from '@ignaciocabeza/bitface/vue';
</script>

<Avatar :config="config" animation="suffering" :intensity="${intensity}" />`,
      },
      {
        label: 'Svelte',
        language: 'svelte',
        code: `<script>
import Avatar from '@ignaciocabeza/bitface/svelte';
</script>

<Avatar config={config} animation="suffering" intensity={${intensity}} />`,
      },
      {
        label: 'Node.js',
        language: 'ts',
        code: `import { generateSufferingAnimation } from '@ignaciocabeza/bitface';

const anim = generateSufferingAnimation(${intensity}, 'medium');
// anim.frames → array of { duration, overrides }`,
      },
    ];
  }

  const reactIntensity = intensityProp ? ` intensity={${intensity}}` : '';
  const vueIntensity = intensityProp ? ` :intensity="${intensity}"` : '';
  const svelteIntensity = intensityProp ? ` intensity={${intensity}}` : '';
  const nodeIntensity = intensityProp
    ? `\nimport { applyIntensity } from '@ignaciocabeza/bitface';\n\nconst adjusted = applyIntensity(sequence, ${intensity});`
    : '';

  return [
    {
      label: 'React',
      language: 'tsx',
      code: `import { Avatar } from '@ignaciocabeza/bitface/react';

<Avatar config={config} animation="${name}"${reactIntensity} />`,
    },
    {
      label: 'Vue',
      language: 'vue',
      code: `<script setup>
import { Avatar } from '@ignaciocabeza/bitface/vue';
</script>

<Avatar :config="config" animation="${name}"${vueIntensity} />`,
    },
    {
      label: 'Svelte',
      language: 'svelte',
      code: `<script>
import Avatar from '@ignaciocabeza/bitface/svelte';
</script>

<Avatar config={config} animation="${name}"${svelteIntensity} />`,
    },
    {
      label: 'Node.js',
      language: 'ts',
      code: `import { ANIMATIONS } from '@ignaciocabeza/bitface';

const sequence = ANIMATIONS['${name}'];
// sequence.frames → array of { duration, overrides }${nodeIntensity}`,
    },
  ];
}

function AnimationCard({
  name,
  config,
  intensity,
  onIntensityChange,
  isSelected,
  onClick,
}: {
  name: string;
  config: Partial<FaceConfig>;
  intensity: number;
  onIntensityChange: (v: number) => void;
  isSelected: boolean;
  onClick: () => void;
}) {
  const svg = useAnimatedAvatar(config, name, intensity);

  return (
    <div
      className={
        'flex flex-col items-center gap-2 bg-card border rounded-xl p-4 transition-all duration-150 cursor-pointer' +
        (isSelected
          ? ' border-accent scale-[1.03]'
          : ' border-border hover:border-accent hover:scale-[1.03]')
      }
      onClick={onClick}
    >
      <div
        className="w-20 h-20 [image-rendering:pixelated]"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div className="text-sm font-semibold text-white">{name}</div>
      <div className="text-xs text-muted text-center">{DESCRIPTIONS[name] ?? ''}</div>
      <div
        className="w-full flex items-center gap-2 mt-1"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="range"
          className="slider flex-1 h-1.5 bg-border rounded-sm outline-none"
          min={0}
          max={100}
          value={intensity}
          onChange={(e) => onIntensityChange(Number(e.target.value))}
        />
        <span className="text-[0.65rem] text-muted-light w-8 text-right">{intensity}%</span>
      </div>
    </div>
  );
}

function SnippetPanel({ snippets }: { snippets: { label: string; language: string; code: string }[] }) {
  const [tab, setTab] = useState(snippets[0].label);
  const active = snippets.find((s) => s.label === tab) ?? snippets[0];

  return (
    <div>
      <div className="flex gap-1 mb-2">
        {snippets.map((s) => (
          <button
            key={s.label}
            className={
              'px-3.5 py-1.5 border border-border rounded-t-md cursor-pointer text-[0.8rem] transition-colors duration-150' +
              (tab === s.label
                ? ' bg-code text-green border-b-code'
                : ' bg-card text-muted hover:text-[#ccc]')
            }
            onClick={() => setTab(s.label)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <CodeBlock code={active.code} language={active.language} />
    </div>
  );
}

export function AnimationDemo() {
  const animationNames = getAnimationNames();
  const allNames = useMemo(() => [...animationNames, 'suffering'], [animationNames]);
  const [selected, setSelected] = useState<string | null>(null);
  const [intensities, setIntensities] = useState<Record<string, number>>({});

  const configs = useMemo(
    () =>
      allNames.map(() =>
        generateRandomConfig({ backgroundColor: 'transparent' }),
      ),
    [],
  );

  const toggle = useCallback((name: string) => {
    setSelected((prev) => (prev === name ? null : name));
  }, []);

  const setIntensity = useCallback((name: string, value: number) => {
    setIntensities((prev) => ({ ...prev, [name]: value }));
    setSelected(name);
  }, []);

  const selectedIntensity = selected ? (intensities[selected] ?? 50) : 50;

  return (
    <section id="animations" className="py-8 max-sm:py-4">
      <h2 className="text-2xl text-white mb-5 text-center">Animations</h2>
      <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-2">
        {allNames.map((name, i) => (
          <AnimationCard
            key={name}
            name={name}
            config={configs[i]}
            intensity={intensities[name] ?? 50}
            onIntensityChange={(v) => setIntensity(name, v)}
            isSelected={selected === name}
            onClick={() => toggle(name)}
          />
        ))}
      </div>
      {selected && (
        <div className="mt-4">
          <SnippetPanel snippets={getSnippets(selected, selectedIntensity)} />
        </div>
      )}
    </section>
  );
}
