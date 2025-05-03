/* TimeScaleControl.tsx */

type TimeScaleControlProps = {
  value: number;
  onChange: (value: number) => void;
};

export function TimeScaleControl({ value, onChange }: TimeScaleControlProps) {
  return (
    <div className="control">
      <label>Time Scale: {value.toFixed(1)}x</label>
      <input
        type="range"
        min={0.1}
        max={10}
        step={0.1}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
