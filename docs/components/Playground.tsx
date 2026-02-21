import { useState, useCallback } from 'react';
import type { FaceConfig } from '../../src/types.ts';
import { getAvailableParts } from '../../src/renderer/index.ts';
import { SKIN_PRESETS, HAIR_PRESETS, EYE_PRESETS } from '../../src/renderer/palette.ts';
import { Preview } from './Preview.tsx';
import { PartSelector } from './PartSelector.tsx';
import { ColorPicker } from './ColorPicker.tsx';

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
  const parts = getAvailableParts();

  const updateField = useCallback((key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleBgChange = useCallback((name: string) => {
    setBgPreset(name);
    setConfig((prev) => ({ ...prev, backgroundColor: BG_PRESETS[name] ?? name }));
  }, []);

  return (
    <div className="app-layout">
      <div className="preview-col">
        <Preview config={config} />
      </div>

      <div className="controls-col">
        <div className="toolbar">
          <button className="toolbar-btn" onClick={() => setConfig(randomConfig())}>
            Randomize
          </button>
        </div>

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
            />
          );
        })}

        <div className="color-section">
          <ColorPicker
            label="Skin Color"
            presets={SKIN_PRESETS}
            selected={config.skinColor ?? 'medium'}
            onChange={(v) => updateField('skinColor', v)}
          />
          <ColorPicker
            label="Hair Color"
            presets={HAIR_PRESETS}
            selected={config.hairColor ?? 'black'}
            onChange={(v) => updateField('hairColor', v)}
          />
          <ColorPicker
            label="Eye Color"
            presets={EYE_PRESETS}
            selected={config.eyeColor ?? 'brown'}
            onChange={(v) => updateField('eyeColor', v)}
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
