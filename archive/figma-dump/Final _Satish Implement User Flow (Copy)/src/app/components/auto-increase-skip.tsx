import { useNavigate } from "react-router";
import { useEnrollment } from "./enrollment-context";
import { ArrowLeft, ArrowRight, TrendingUp, Minus, AlertTriangle } from "lucide-react";

export function AutoIncreaseSkip() {
  const navigate = useNavigate();
  const { updateData, setCurrentStep } = useEnrollment();

  const withAutoProjection = 185943;
  const withoutAutoProjection = 124621;
  const difference = withAutoProjection - withoutAutoProjection;

  const handleEnable = () => {
    updateData({ autoIncrease: true });
    navigate("/auto-increase-setup");
  };

  const handleSkip = () => {
    updateData({ autoIncrease: false });
    setCurrentStep(5);
    navigate("/investment");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/auto-increase")}
          className="flex items-center gap-1 text-gray-500 mb-3 hover:text-gray-700"
          style={{ fontSize: "0.85rem" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <h1 className="text-gray-900">Skip automatic increases?</h1>
        </div>
        <p className="text-gray-500 mt-1" style={{ fontSize: "0.9rem" }}>
          Automatic increases help grow your retirement savings gradually over
          time without requiring large changes today.
        </p>
        <p className="text-gray-400 mt-2" style={{ fontSize: "0.82rem" }}>
          Automatic increases usually align with salary raises, so your take-home pay typically remains comfortable.
        </p>
      </div>

      {/* Comparison Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* With Auto Increase */}
        <div className="bg-white rounded-2xl border-2 border-green-500 shadow-sm p-5 flex flex-col relative">
          <span
            className="absolute -top-3 left-4 bg-green-600 text-white px-3 py-0.5 rounded-full"
            style={{ fontSize: "0.75rem", fontWeight: 600 }}
          >
            Recommended
          </span>
          <div className="flex items-center gap-2 mb-3 mt-1">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-gray-900">With Auto Increase</h3>
          </div>
          <p
            className="text-gray-400"
            style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em" }}
          >
            Estimated savings in 10 years
          </p>
          <p
            className="text-green-700 mt-1"
            style={{ fontSize: "2rem", fontWeight: 700 }}
          >
            ${withAutoProjection.toLocaleString()}
          </p>
        </div>

        {/* Without Auto Increase */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 flex flex-col opacity-75">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Minus className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-gray-500">Without Auto Increase</h3>
          </div>
          <p
            className="text-gray-400"
            style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em" }}
          >
            Estimated savings in 10 years
          </p>
          <p
            className="text-gray-500 mt-1"
            style={{ fontSize: "2rem", fontWeight: 700 }}
          >
            ${withoutAutoProjection.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Highlight Banner */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
        <p
          className="text-green-800"
          style={{ fontSize: "0.9rem", fontWeight: 500 }}
        >
          Automatic increases could add approximately{" "}
          <span style={{ fontWeight: 700 }}>
            ${difference.toLocaleString()}
          </span>{" "}
          to your savings.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleEnable}
          className="flex-1 bg-green-600 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 active:scale-[0.98] transition-all shadow-sm"
        >
          Enable Auto Increase <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={handleSkip}
          className="flex-1 bg-white text-gray-600 border border-gray-300 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
}