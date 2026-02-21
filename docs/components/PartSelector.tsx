import { getPartThumbnail } from '../../src/renderer/index.ts';

export function PartSelector({
  category,
  label,
  variants,
  selected,
  skinColor,
  hairColor,
  eyeColor,
  onChange,
}: {
  category: string;
  label: string;
  variants: string[];
  selected: string;
  skinColor?: string;
  hairColor?: string;
  eyeColor?: string;
  onChange: (variant: string) => void;
}) {
  return (
    <div className="part-selector">
      <h3>{label}</h3>
      <div className="thumbnail-grid">
        {variants.map((variant) => (
          <button
            key={variant}
            className={'thumbnail-btn' + (variant === selected ? ' selected' : '')}
            title={variant}
            onClick={() => onChange(variant)}
            dangerouslySetInnerHTML={{
              __html: getPartThumbnail(category, variant, skinColor, hairColor, eyeColor),
            }}
          />
        ))}
      </div>
    </div>
  );
}
