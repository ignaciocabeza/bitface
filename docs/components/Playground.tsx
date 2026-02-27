import { useState, useCallback, useRef, useEffect } from 'react';
import type { FaceConfig } from '../../src/types.ts';
import { getAvailableParts } from '../../src/renderer/index.ts';
import { getAnimationNames } from '../../src/renderer/animations.ts';
import { SKIN_PRESETS, HAIR_PRESETS, EYE_PRESETS } from '../../src/renderer/palette.ts';
import { Preview } from './Preview.tsx';
import { PartSelector } from './PartSelector.tsx';
import { ColorPicker } from './ColorPicker.tsx';

const ANIMATION_OPTIONS = ['none', ...getAnimationNames(), 'suffering'];

const CATEGORY_LABELS: Record<string, string> = {
  faceShape: 'Face Shape',
  eyes: 'Eyes',
  eyebrows: 'Eyebrows',
  mouth: 'Mouth',
  nose: 'Nose',
  ears: 'Ears',
  hair: 'Hair',
  beard: 'Beard',
  accessories: 'Accessories',
};

const PART_CATEGORIES = ['faceShape', 'eyes', 'eyebrows', 'mouth', 'nose', 'ears', 'hair', 'beard', 'accessories'] as const;

const BG_PRESETS: Record<string, string> = {
  sky: '#87CEEB',
  white: '#FFFFFF',
  gray: '#888888',
  dark: '#1A1A2E',
  green: '#4CAF50',
  transparent: 'transparent',
};

function defaultConfig(): FaceConfig {
  return {
    faceShape: 'round',
    eyes: 'big',
    eyebrows: 'thin',
    mouth: 'smile',
    nose: 'small',
    ears: 'small',
    hair: 'short',
    beard: 'none',
    accessories: 'none',
    skinColor: 'medium',
    hairColor: 'black',
    eyeColor: 'brown',
    backgroundColor: '#87CEEB',
  };
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomConfig(): FaceConfig {
  const parts = getAvailableParts();
  return {
    faceShape: randomChoice(parts.faceShape),
    eyes: randomChoice(parts.eyes),
    eyebrows: randomChoice(parts.eyebrows),
    mouth: randomChoice(parts.mouth),
    nose: randomChoice(parts.nose),
    ears: randomChoice(parts.ears),
    hair: randomChoice(parts.hair),
    beard: randomChoice(parts.beard),
    accessories: randomChoice(parts.accessories),
    skinColor: randomChoice(Object.keys(SKIN_PRESETS)),
    hairColor: randomChoice(Object.keys(HAIR_PRESETS)),
    eyeColor: randomChoice(Object.keys(EYE_PRESETS)),
    backgroundColor: '#87CEEB',
  };
}

export function Playground() {
  const [config, setConfig] = useState<FaceConfig>(defaultConfig);
  const [bgPreset, setBgPreset] = useState('sky');
  const [animation, setAnimation] = useState('none');
  const [intensity, setIntensity] = useState(50);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [randomizedParts, setRandomizedParts] = useState<Set<string>>(new Set([...PART_CATEGORIES, 'skinColor', 'hairColor', 'eyeColor']));
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const parts = getAvailableParts();

  const resolvedAnimation = animation === 'none' ? undefined : animation;

  const stopDemo = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setDemoPlaying(false);
  }, []);

  const tickDemo = useCallback((now: number) => {
    const progress = Math.min((now - startRef.current) / 5000, 1);
    setIntensity(Math.round(progress * 100));
    if (progress < 1) {
      rafRef.current = requestAnimationFrame(tickDemo);
    } else {
      rafRef.current = null;
      setDemoPlaying(false);
    }
  }, []);

  const playDemo = useCallback(() => {
    stopDemo();
    setIntensity(0);
    setDemoPlaying(true);
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tickDemo);
  }, [stopDemo, tickDemo]);

  useEffect(() => stopDemo, [stopDemo]);

  const updateField = useCallback((key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setRandomizedParts((prev) => { const next = new Set(prev); next.delete(key); return next; });
  }, []);

  const randomizeField = useCallback((key: string, variants: string[]) => {
    setConfig((prev) => ({ ...prev, [key]: randomChoice(variants) }));
    setRandomizedParts((prev) => new Set(prev).add(key));
  }, []);

  const handleBgChange = useCallback((name: string) => {
    setBgPreset(name);
    setConfig((prev) => ({ ...prev, backgroundColor: BG_PRESETS[name] ?? name }));
  }, []);

  return (
    <div className="grid grid-cols-2 gap-8 items-start max-sm:grid-cols-1">
      <div className="sticky top-4 max-sm:static">
        <Preview config={config} animation={resolvedAnimation} intensity={resolvedAnimation ? intensity : undefined} />
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex gap-3 flex-wrap">
          <button
            className="flex-1 min-w-30 px-4 py-2.5 bg-accent text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-150 hover:bg-accent-hover active:bg-accent-active"
            onClick={() => {
              setConfig((prev) => {
                const next = { ...prev };
                for (const cat of PART_CATEGORIES) {
                  if (randomizedParts.has(cat)) {
                    const variants = parts[cat];
                    if (variants) (next as Record<string, string>)[cat] = randomChoice(variants);
                  }
                }
                const colorFields: Record<string, Record<string, string>> = {
                  skinColor: SKIN_PRESETS,
                  hairColor: HAIR_PRESETS,
                  eyeColor: EYE_PRESETS,
                };
                for (const [key, presets] of Object.entries(colorFields)) {
                  if (randomizedParts.has(key)) {
                    (next as Record<string, string>)[key] = randomChoice(Object.keys(presets));
                  }
                }
                return next;
              });
            }}
          >
            Randomize
          </button>
          <select
            className="toolbar-select flex-1 min-w-30 px-4 py-2.5 pr-8 bg-card text-[#e0e0e0] border-2 border-border rounded-lg text-sm font-semibold font-[inherit] cursor-pointer transition-colors duration-150 hover:border-hover-border focus:border-accent focus:outline-none"
            value={animation}
            onChange={(e) => setAnimation(e.target.value)}
          >
            {ANIMATION_OPTIONS.map((name) => (
              <option key={name} value={name}>
                {name === 'none' ? 'No Animation' : name.charAt(0).toUpperCase() + name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {animation !== 'none' && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <label className="text-sm text-muted-light whitespace-nowrap min-w-[110px]">Intensity: {intensity}%</label>
              <input
                type="range"
                className="slider flex-1 h-1.5 bg-border rounded-sm outline-none"
                min={0}
                max={100}
                value={intensity}
                onChange={(e) => { stopDemo(); setIntensity(Number(e.target.value)); }}
              />
            </div>
            {animation === 'suffering' && (
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-border rounded overflow-hidden">
                  <div className="suffering-bar-fill h-full rounded" style={{ width: `${intensity}%` }} />
                </div>
                <span className="text-sm text-muted-light min-w-9 text-right">{intensity}%</span>
                <button
                  className="flex-none min-w-25 px-4 py-2.5 bg-accent text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-150 hover:bg-accent-hover disabled:opacity-60 disabled:cursor-default"
                  onClick={playDemo}
                  disabled={demoPlaying}
                >
                  {demoPlaying ? 'Playing...' : 'Play Demo'}
                </button>
              </div>
            )}
          </div>
        )}

        {PART_CATEGORIES.map((category) => {
          const variants = parts[category];
          if (!variants) return null;
          return (
            <PartSelector
              key={category}
              category={category}
              label={CATEGORY_LABELS[category] ?? category}
              variants={variants}
              selected={(config[category as keyof FaceConfig] as string) ?? 'none'}
              skinColor={config.skinColor}
              hairColor={config.hairColor}
              eyeColor={config.eyeColor}
              onChange={(v) => updateField(category, v)}
              onRandomize={() => randomizeField(category, variants)}
              isRandomized={randomizedParts.has(category)}
            />
          );
        })}

        <div className="flex flex-col gap-4">
          <ColorPicker
            label="Skin Color"
            presets={SKIN_PRESETS}
            selected={config.skinColor ?? 'medium'}
            onChange={(v) => updateField('skinColor', v)}
            onRandomize={() => randomizeField('skinColor', Object.keys(SKIN_PRESETS))}
            isRandomized={randomizedParts.has('skinColor')}
          />
          <ColorPicker
            label="Hair Color"
            presets={HAIR_PRESETS}
            selected={config.hairColor ?? 'black'}
            onChange={(v) => updateField('hairColor', v)}
            onRandomize={() => randomizeField('hairColor', Object.keys(HAIR_PRESETS))}
            isRandomized={randomizedParts.has('hairColor')}
          />
          <ColorPicker
            label="Eye Color"
            presets={EYE_PRESETS}
            selected={config.eyeColor ?? 'brown'}
            onChange={(v) => updateField('eyeColor', v)}
            onRandomize={() => randomizeField('eyeColor', Object.keys(EYE_PRESETS))}
            isRandomized={randomizedParts.has('eyeColor')}
          />
          <ColorPicker
            label="Background"
            presets={BG_PRESETS}
            selected={bgPreset}
            onChange={handleBgChange}
          />
        </div>
      </div>
    </div>
  );
}
