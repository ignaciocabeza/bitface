export function ColorPicker({
  label,
  presets,
  selected,
  onChange,
}: {
  label: string;
  presets: Record<string, string>;
  selected: string;
  onChange: (name: string) => void;
}) {
  return (
    <div className="color-picker">
      <h3>{label}</h3>
      <div className="swatch-row">
        {Object.entries(presets).map(([name, hex]) => {
          const isTransparent = hex === 'transparent';
          return (
            <button
              key={name}
              className={
                'swatch' +
                (name === selected ? ' selected' : '') +
                (isTransparent ? ' swatch-transparent' : '')
              }
              title={name}
              style={isTransparent ? undefined : { backgroundColor: hex }}
              onClick={() => onChange(name)}
            />
          );
        })}
      </div>
    </div>
  );
}
