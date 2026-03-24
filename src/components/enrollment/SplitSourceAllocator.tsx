import { useState, useEffect } from "react";
import { DashboardCard } from "../dashboard/DashboardCard";
import { Input } from "../ui/Input";
import type { ContributionSource } from "@/enrollment/logic/types";

interface SplitSourceAllocatorProps {
  allocations: Record<ContributionSource, number>;
  onAllocationsChange: (allocations: Record<ContributionSource, number>) => void;
}

/**
 * SplitSourceAllocator - Percentage allocation inputs per source (must total 100%)
 */
export const SplitSourceAllocator = ({ allocations, onAllocationsChange }: SplitSourceAllocatorProps) => {
  const [localAllocations, setLocalAllocations] = useState(allocations);
  const [error, setError] = useState<string>("");

  const sources: { value: ContributionSource; label: string }[] = [
    { value: "preTax", label: "Pre-tax" },
    { value: "roth", label: "Roth" },
    { value: "afterTax", label: "After-tax" },
  ];

  useEffect(() => {
    setLocalAllocations(allocations);
  }, [allocations]);

  const handleAllocationChange = (source: ContributionSource, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newAllocations = {
      ...localAllocations,
      [source]: Math.max(0, Math.min(100, numValue)),
    };
    setLocalAllocations(newAllocations);

    const total = Object.values(newAllocations).reduce((sum, val) => sum + val, 0);
    if (total > 100) {
      setError(`Total allocation cannot exceed 100%. Current total: ${total.toFixed(1)}%`);
    } else if (total < 100) {
      setError(`Total allocation must equal 100%. Current total: ${total.toFixed(1)}%`);
    } else {
      setError("");
      onAllocationsChange(newAllocations);
    }
  };

  const total = Object.values(localAllocations).reduce((sum, val) => sum + val, 0);

  return (
    <DashboardCard>
      <div className="split-source-allocator">
        <h4 className="split-source-allocator__title">Allocate by Percentage</h4>
        <p className="split-source-allocator__description">
          Distribute your contribution across multiple sources. Total must equal 100%.
        </p>
        <div className="split-source-allocator__inputs">
          {sources.map((source) => (
            <div key={source.value} className="split-source-allocator__input-group">
              <label htmlFor={`allocation-${source.value}`} className="split-source-allocator__input-label">
                {source.label}
              </label>
              <div className="split-source-allocator__input-wrapper">
                <Input
                  label=""
                  type="number"
                  name={`allocation-${source.value}`}
                  id={`allocation-${source.value}`}
                  value={localAllocations[source] > 0 ? localAllocations[source].toString() : ""}
                  onChange={(e) => handleAllocationChange(source.value, e.target.value)}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="split-source-allocator__input-suffix">%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="split-source-allocator__total">
          <span className="split-source-allocator__total-label">Total:</span>
          <span className={`split-source-allocator__total-value ${total === 100 ? "split-source-allocator__total-value--valid" : "split-source-allocator__total-value--invalid"}`}>
            {total.toFixed(1)}%
          </span>
        </div>
        {error && (
          <div className="split-source-allocator__error" role="alert">
            {error}
          </div>
        )}
      </div>
    </DashboardCard>
  );
};
