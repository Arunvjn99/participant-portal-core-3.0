export type SliderInputProps = {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (n: number) => void;
  formatValue?: (n: number) => string;
  id: string;
};

export function SliderInput({ label, min, max, value, onChange, formatValue, id }: SliderInputProps) {
  const display = formatValue ? formatValue(value) : String(value);

  return (
    <div className="card-soft">
      <label className="text-sm font-medium text-foreground" htmlFor={id}>
        {label}
      </label>
      <p className="mt-2 text-2xl font-bold tabular-nums text-primary">{display}</p>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="tx-slider-input mt-4 w-full"
      />
    </div>
  );
}
