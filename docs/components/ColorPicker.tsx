export function ColorPicker({
  label,
  presets,
  selected,
  onChange,
  onRandomize,
  isRandomized,
}: {
  label: string;
  presets: Record<string, string>;
  selected: string;
  onChange: (name: string) => void;
  onRandomize?: () => void;
  isRandomized?: boolean;
}) {
  return (
    <div>
      <h3 className="text-sm uppercase tracking-wide text-muted-light mb-2">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {Object.entries(presets).map(([name, hex]) => {
          const isTransparent = hex === 'transparent';
          return (
            <button
              key={name}
              className={
                'w-8 h-8 rounded-full border-2 cursor-pointer transition-all duration-150' +
                (!isRandomized && name === selected
                  ? ' border-accent scale-115 shadow-[0_0_8px_rgba(123,104,238,0.4)]'
                  : ' border-border hover:border-hover-border hover:scale-110') +
                (isTransparent ? ' swatch-transparent' : '')
              }
              title={name}
              style={isTransparent ? undefined : { backgroundColor: hex }}
              onClick={() => onChange(name)}
            />
          );
        })}
        {onRandomize && (
          <button
            className={
              'w-8 h-8 rounded-full border-2 border-dashed cursor-pointer flex items-center justify-center transition-all duration-150' +
              (isRandomized
                ? ' border-accent bg-selected-bg text-accent scale-115'
                : ' bg-card border-border hover:border-accent hover:text-accent hover:scale-110 text-muted')
            }
            title="Randomize"
            onClick={onRandomize}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="16" cy="8" r="1.5" />
              <circle cx="8" cy="16" r="1.5" />
              <circle cx="16" cy="16" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
