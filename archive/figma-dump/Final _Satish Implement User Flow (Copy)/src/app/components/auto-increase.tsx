import { useNavigate } from "react-router";
import { useEnrollment } from "./enrollment-context";
import { ArrowRight, ArrowLeft, TrendingUp, Minus } from "lucide-react";

export function AutoIncrease() {
  const navigate = useNavigate();
  const { data, updateData, setCurrentStep } = useEnrollment();

  const fixedProjection = 124621;
  const autoProjection = 185943;
  const difference = autoProjection - fixedProjection;

  const handleSelect = (autoIncrease: boolean) => {
    updateData({ autoIncrease });
    if (autoIncrease) {
      // Navigate to setup screen to configure increase details
      navigate("/auto-increase-setup");
    } else {
      navigate("/auto-increase-skip");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <button onClick={() => { setCurrentStep(3); navigate("/contribution-source"); }} className="flex items-center gap-1 text-gray-500 mb-3 hover:text-gray-700" style={{ fontSize: "0.85rem" }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-gray-900">Increase your savings automatically</h1>
        <p className="text-gray-500 mt-1" style={{ fontSize: "0.9rem" }}>
          Small increases today can grow your retirement savings over time.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Fixed */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Minus className="w-5 h-5 text-gray-500" />
            </div>
            <h3 className="text-gray-900">Keep Contributions Fixed</h3>
          </div>
          <p className="text-gray-500" style={{ fontSize: "0.85rem" }}>
            Your contribution stays at {data.contributionPercent}% throughout.
          </p>
          <div className="mt-4 flex-1">
            <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>Projected in 10 years</p>
            <p className="text-gray-900" style={{ fontSize: "2rem", fontWeight: 700 }}>
              ${fixedProjection.toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => handleSelect(false)}
            className="w-full mt-5 bg-white text-gray-700 border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            Skip Auto Increase
          </button>
        </div>

        {/* Auto Increase - Recommended */}
        <div className="bg-white rounded-2xl border-2 border-green-500 shadow-sm p-5 flex flex-col relative">
          <span className="absolute -top-3 left-4 bg-green-600 text-white px-3 py-0.5 rounded-full" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
            Recommended
          </span>
          <div className="flex items-center gap-2 mb-3 mt-1">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-gray-900">Enable Auto Increase</h3>
          </div>
          <p className="text-gray-500" style={{ fontSize: "0.85rem" }}>
            Increase by 1% each year up to 15%.
          </p>
          <div className="mt-4 flex-1">
            <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>Projected in 10 years</p>
            <p className="text-green-700" style={{ fontSize: "2rem", fontWeight: 700 }}>
              ${autoProjection.toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => handleSelect(true)}
            className="w-full mt-5 bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 active:scale-[0.98] transition-all"
          >
            Enable Auto Increase <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Impact Banner */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
        <p className="text-green-800" style={{ fontSize: "0.9rem", fontWeight: 500 }}>
          Automatic increases could add <span style={{ fontWeight: 700 }}>+${difference.toLocaleString()}</span> over 10 years.
        </p>
      </div>
    </div>
  );
}