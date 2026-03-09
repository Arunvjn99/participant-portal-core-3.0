import { Check } from "lucide-react";

interface Step {
  id: string;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex items-center flex-1 gap-3">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 flex-shrink-0 ${
                  index < currentStep
                    ? "bg-blue-600"
                    : index === currentStep
                    ? "bg-blue-600"
                    : "bg-gray-400"
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Step Label */}
              <span
                className={`text-base font-medium transition-colors duration-300 whitespace-nowrap ${
                  index <= currentStep
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-px bg-gray-300 min-w-8" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}