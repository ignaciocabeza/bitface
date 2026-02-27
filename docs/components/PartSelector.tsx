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
  onRandomize,
  isRandomized,
}: {
  category: string;
  label: string;
  variants: string[];
  selected: string;
  skinColor?: string;
  hairColor?: string;
  eyeColor?: string;
  onChange: (variant: string) => void;
  onRandomize: () => void;
  isRandomized?: boolean;
}) {
  return (
    <div>
      <h3 className="text-sm uppercase tracking-wide text-muted-light mb-2">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant}
            className={
              'thumbnail-btn w-12 h-12 bg-card border-2 rounded-lg cursor-pointer p-1 transition-colors duration-150' +
              (!isRandomized && variant === selected
                ? ' border-accent bg-selected-bg'
                : ' border-border hover:border-hover-border')
            }
            title={variant}
            onClick={() => onChange(variant)}
            dangerouslySetInnerHTML={{
              __html: getPartThumbnail(category, variant, skinColor, hairColor, eyeColor),
            }}
          />
        ))}
        <button
          className={
            'w-12 h-12 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center transition-colors duration-150' +
            (isRandomized
              ? ' border-accent bg-selected-bg text-accent'
              : ' bg-card border-border hover:border-accent hover:text-accent text-muted')
          }
          title="Randomize"
          onClick={onRandomize}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="16" cy="8" r="1.5" />
            <circle cx="8" cy="16" r="1.5" />
            <circle cx="16" cy="16" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
