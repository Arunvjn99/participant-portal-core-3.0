import type { ContributionPreset } from "@/enrollment/logic/types";

interface PresetPillsProps {
  presets: ContributionPreset[];
  selectedPresetId?: string;
  onPresetSelect: (preset: ContributionPreset) => void;
}

export const PresetPills = ({
  presets,
  selectedPresetId,
  onPresetSelect,
}: PresetPillsProps) => {
  return (
    <div className="preset-pills" role="group" aria-label="Contribution presets">
      {presets.map((preset) => (
        <button
          key={preset.id}
          type="button"
          className={`preset-pills__pill ${selectedPresetId === preset.id ? "preset-pills__pill--selected" : ""}`}
          onClick={() => onPresetSelect(preset)}
          aria-pressed={selectedPresetId === preset.id}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
};
