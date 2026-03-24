import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { InsightCard } from "@/components/ui/InsightCard";
import { getAgeInsight } from "@/utils/enrollmentInsights";

interface AgeStepProps {
  age?: number;
  retirementAge?: number;
  onAgeChange?: (age: number) => void;
  onRetirementAgeChange?: (age: number) => void;
}

export const AgeStep = ({ age: initialAge, retirementAge: initialRetirementAge, onAgeChange, onRetirementAgeChange }: AgeStepProps) => {
  const [age, setAge] = useState(initialAge?.toString() || "");
  const [retirementAge, setRetirementAge] = useState(initialRetirementAge?.toString() || "");

  const ageNum = parseInt(age) || 0;
  const retirementAgeNum = parseInt(retirementAge) || 0;
  const yearsUntilRetirement = retirementAgeNum > ageNum ? retirementAgeNum - ageNum : 0;

  const insight = getAgeInsight({
    currentAge: ageNum || undefined,
    retirementAge: retirementAgeNum || undefined,
  });

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAge(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && onAgeChange) {
      onAgeChange(numValue);
    }
  };

  const handleRetirementAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRetirementAge(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && onRetirementAgeChange) {
      onRetirementAgeChange(numValue);
    }
  };

  return (
    <div className="age-step">
      <h3 className="age-step__title">Age & Retirement Planning</h3>
      <p className="age-step__description">
        Help us understand your retirement timeline so we can provide personalized recommendations.
      </p>
      <div className="age-step__fields">
        <Input
          label="Current Age"
          type="number"
          name="age"
          value={age}
          onChange={handleAgeChange}
          placeholder="Enter your current age"
          min="18"
          max="100"
        />
        <Input
          label="Planned Retirement Age"
          type="number"
          name="retirementAge"
          value={retirementAge}
          onChange={handleRetirementAgeChange}
          placeholder="Enter your planned retirement age"
          min="18"
          max="100"
        />
        {yearsUntilRetirement > 0 && (
          <div className="age-step__calculation">
            <p className="age-step__calculation-label">Years until retirement:</p>
            <p className="age-step__calculation-value">{yearsUntilRetirement} years</p>
          </div>
        )}
        {insight && (
          <InsightCard
            message={insight.message}
            tone={insight.tone}
          />
        )}
      </div>
    </div>
  );
};
