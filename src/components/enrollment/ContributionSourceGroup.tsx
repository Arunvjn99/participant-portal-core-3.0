import type { ContributionSource } from "@/enrollment/logic/types";

interface ContributionSourceGroupProps {
  sources: ContributionSource[];
  onSourcesChange: (sources: ContributionSource[]) => void;
}

export const ContributionSourceGroup = ({
  sources,
  onSourcesChange,
}: ContributionSourceGroupProps) => {
  const allSources: { value: ContributionSource; label: string }[] = [
    { value: "preTax", label: "Pre-tax" },
    { value: "afterTax", label: "After-tax" },
    { value: "roth", label: "Roth" },
  ];

  const handleSourceToggle = (source: ContributionSource) => {
    if (sources.includes(source)) {
      // Remove if already selected
      onSourcesChange(sources.filter((s) => s !== source));
    } else {
      // Add if not selected
      onSourcesChange([...sources, source]);
    }
  };

  return (
    <div className="contribution-source-group" role="group" aria-label="Contribution source">
      {allSources.map((option) => (
        <label key={option.value} className="contribution-source-group__option">
          <input
            type="checkbox"
            checked={sources.includes(option.value)}
            onChange={() => handleSourceToggle(option.value)}
            className="contribution-source-group__checkbox"
            aria-label={option.label}
          />
          <span className="contribution-source-group__label">{option.label}</span>
        </label>
      ))}
    </div>
  );
};
