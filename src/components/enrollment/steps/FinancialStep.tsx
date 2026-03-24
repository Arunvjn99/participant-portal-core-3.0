import { useState } from "react";
import { Input } from "@/components/ui/Input";

interface FinancialStepProps {
  salary?: number;
  currentSavings?: number;
  onSalaryChange?: (salary: number) => void;
  onCurrentSavingsChange?: (savings: number) => void;
}

export const FinancialStep = ({
  salary: initialSalary,
  currentSavings: initialCurrentSavings,
  onSalaryChange,
  onCurrentSavingsChange,
}: FinancialStepProps) => {
  const [salary, setSalary] = useState(initialSalary?.toString() || "");
  const [currentSavings, setCurrentSavings] = useState(initialCurrentSavings?.toString() || "");

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSalary(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && onSalaryChange) {
      onSalaryChange(numValue);
    }
  };

  const handleCurrentSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentSavings(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && onCurrentSavingsChange) {
      onCurrentSavingsChange(numValue);
    }
  };

  return (
    <div className="financial-step">
      <h3 className="financial-step__title">Financial Information</h3>
      <p className="financial-step__description">
        Provide your financial details to help us calculate your retirement readiness.
      </p>
      <div className="financial-step__fields">
        <Input
          label="Annual Salary"
          type="number"
          name="salary"
          value={salary}
          onChange={handleSalaryChange}
          placeholder="Enter your annual salary"
          min="0"
          step="1000"
        />
        <Input
          label="Current Retirement Savings"
          type="number"
          name="currentSavings"
          value={currentSavings}
          onChange={handleCurrentSavingsChange}
          placeholder="Enter your current retirement savings"
          min="0"
          step="1000"
        />
      </div>
    </div>
  );
};
