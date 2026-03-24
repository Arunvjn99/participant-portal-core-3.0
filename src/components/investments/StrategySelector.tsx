import type { InvestmentStrategy } from "@/types/investment";

interface StrategySelectorProps {
  selectedStrategy: InvestmentStrategy;
  onStrategyChange: (strategy: InvestmentStrategy) => void;
}

/**
 * StrategySelector - Segmented control for selecting investment strategy
 */
export const StrategySelector = ({ selectedStrategy, onStrategyChange }: StrategySelectorProps) => {
  const strategies: { value: InvestmentStrategy; label: string; description: string }[] = [
    {
      value: "planDefault",
      label: "Plan Default",
      description: "Use recommended portfolio",
    },
    {
      value: "manual",
      label: "Manual",
      description: "Build your own allocation",
    },
    {
      value: "advisor",
      label: "Advisor",
      description: "Managed by advisor",
    },
  ];

  return (
    <div className="strategy-selector" role="radiogroup" aria-label="Investment strategy">
      <div className="strategy-selector__options">
        {strategies.map((strategy) => (
          <label
            key={strategy.value}
            className={`strategy-selector__option ${
              selectedStrategy === strategy.value ? "strategy-selector__option--active" : ""
            }`}
          >
            <input
              type="radio"
              name="investment-strategy"
              value={strategy.value}
              checked={selectedStrategy === strategy.value}
              onChange={() => onStrategyChange(strategy.value)}
              className="strategy-selector__radio"
            />
            <div className="strategy-selector__option-content">
              <span className="strategy-selector__option-label">{strategy.label}</span>
              <span className="strategy-selector__option-description">{strategy.description}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
