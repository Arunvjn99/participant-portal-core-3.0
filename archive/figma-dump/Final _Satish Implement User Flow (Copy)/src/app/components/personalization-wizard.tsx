import { useState } from "react";
import { useNavigate } from "react-router";
import { useEnrollment } from "./enrollment-context";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Zap,
  Search,
  Sparkles,
} from "lucide-react";

const TOTAL_STEPS = 4;
const stepLabels = ["Age", "Location", "Savings", "Comfort"];

function WizardProgress({ step }: { step: number }) {
  return (
    <div className="mb-6">
      <p className="text-gray-500 mb-2" style={{ fontSize: "0.75rem" }}>
        Step {step} of {TOTAL_STEPS}
      </p>
      <div className="flex items-center gap-1.5">
        {stepLabels.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < step;
          const isCurrent = stepNum === step;
          return (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full h-1.5 rounded-full transition-colors ${
                  isCompleted
                    ? "bg-blue-600"
                    : isCurrent
                    ? "bg-blue-400"
                    : "bg-gray-200"
                }`}
              />
              <span
                className={`transition-colors ${
                  isCurrent ? "text-blue-600" : isCompleted ? "text-gray-700" : "text-gray-400"
                }`}
                style={{ fontSize: "0.7rem", fontWeight: isCurrent ? 600 : 400 }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 1: Retirement Age ─── */
function StepRetirementAge() {
  const { personalization, updatePersonalization } = useEnrollment();
  const retirementYear = new Date().getFullYear() + (personalization.retirementAge - personalization.currentAge);
  const yearsUntil = personalization.retirementAge - personalization.currentAge;
  const quickAges = [60, 65, 67];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-gray-900">When would you like to retire?</h2>
        <p className="text-gray-500 mt-1" style={{ fontSize: "0.85rem" }}>
          You're currently {personalization.currentAge} years old.
        </p>
      </div>

      {/* Large age display */}
      <div className="text-center py-4">
        <p className="text-blue-600" style={{ fontSize: "3rem", fontWeight: 700 }}>
          {personalization.retirementAge}
        </p>
        <p className="text-gray-500" style={{ fontSize: "0.85rem" }}>years old</p>
      </div>

      {/* Slider */}
      <div className="px-2">
        <input
          type="range"
          min={50}
          max={75}
          value={personalization.retirementAge}
          onChange={(e) => updatePersonalization({ retirementAge: Number(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-gray-400 mt-1" style={{ fontSize: "0.7rem" }}>
          <span>50</span>
          <span>75</span>
        </div>
      </div>

      {/* Quick select */}
      <div className="flex gap-2 justify-center">
        {quickAges.map((age) => (
          <button
            key={age}
            onClick={() => updatePersonalization({ retirementAge: age })}
            className={`px-5 py-2.5 rounded-xl transition-colors ${
              personalization.retirementAge === age
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{ fontSize: "0.9rem" }}
          >
            {age}
          </button>
        ))}
      </div>

      {/* Timeline preview */}
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-blue-800" style={{ fontSize: "0.75rem" }}>Now</p>
            <p className="text-blue-700" style={{ fontWeight: 600, fontSize: "0.9rem" }}>{new Date().getFullYear()}</p>
          </div>
          <div className="flex-1 mx-3 border-t-2 border-dashed border-blue-300 relative">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-50 px-2 text-blue-600" style={{ fontSize: "0.7rem" }}>
              {yearsUntil} years
            </span>
          </div>
          <div className="text-center">
            <p className="text-blue-800" style={{ fontSize: "0.75rem" }}>Retirement</p>
            <p className="text-blue-700" style={{ fontWeight: 600, fontSize: "0.9rem" }}>{retirementYear}</p>
          </div>
        </div>
      </div>

      {/* Suggestion chip */}
      <div className="flex items-center gap-2 justify-center">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-gray-500" style={{ fontSize: "0.8rem" }}>
          Most people retire at 65
        </span>
      </div>
    </div>
  );
}

/* ─── Step 2: Retirement Location ─── */
function StepLocation() {
  const { personalization, updatePersonalization } = useEnrollment();
  const [searchQuery, setSearchQuery] = useState("");

  const popularLocations = [
    { name: "Florida", emoji: "☀️" },
    { name: "Arizona", emoji: "🌵" },
    { name: "North Carolina", emoji: "🏔️" },
    { name: "South Carolina", emoji: "🌴" },
  ];

  const filteredLocations = searchQuery
    ? popularLocations.filter((loc) =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularLocations;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-gray-900">Where do you imagine retiring?</h2>
        <p className="text-gray-500 mt-1" style={{ fontSize: "0.85rem" }}>
          Location helps estimate cost of living.
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search city or state..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          style={{ fontSize: "0.9rem" }}
        />
      </div>

      {/* Popular locations */}
      <div>
        <p className="text-gray-500 mb-3" style={{ fontSize: "0.8rem" }}>Popular retirement destinations</p>
        <div className="grid grid-cols-2 gap-3">
          {filteredLocations.map((loc) => (
            <button
              key={loc.name}
              onClick={() => updatePersonalization({ retirementLocation: loc.name })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                personalization.retirementLocation === loc.name
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className="block mb-1" style={{ fontSize: "1.3rem" }}>{loc.emoji}</span>
              <span
                className={personalization.retirementLocation === loc.name ? "text-blue-700" : "text-gray-900"}
                style={{ fontWeight: 500, fontSize: "0.9rem" }}
              >
                {loc.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Not sure option */}
      <button
        onClick={() => updatePersonalization({ retirementLocation: "Not sure yet" })}
        className={`w-full p-3 rounded-xl border-2 text-center transition-all ${
          personalization.retirementLocation === "Not sure yet"
            ? "border-blue-500 bg-blue-50 text-blue-700"
            : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
        }`}
        style={{ fontSize: "0.85rem" }}
      >
        Not sure yet
      </button>
    </div>
  );
}

/* ─── Step 3: Current Savings ─── */
function StepSavings() {
  const { personalization, updatePersonalization } = useEnrollment();

  const quickAmounts = [
    { label: "$0", value: 0 },
    { label: "$5K", value: 5000 },
    { label: "$10K", value: 10000 },
    { label: "$50K+", value: 50000 },
  ];

  const formatCurrency = (val: number) => {
    if (val === 0) return "$0";
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-gray-900">What are your current personal savings?</h2>
        <p className="text-gray-500 mt-1" style={{ fontSize: "0.85rem" }}>
          Include personal savings or investments outside your employer plan.
        </p>
      </div>

      {/* Currency input */}
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="number"
          value={personalization.currentSavings || ""}
          onChange={(e) => updatePersonalization({ currentSavings: Number(e.target.value) })}
          placeholder="0"
          className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          style={{ fontSize: "1.5rem", fontWeight: 600 }}
        />
      </div>

      {/* Quick options */}
      <div className="flex gap-2 flex-wrap">
        {quickAmounts.map((opt) => (
          <button
            key={opt.label}
            onClick={() => updatePersonalization({ currentSavings: opt.value })}
            className={`px-4 py-2.5 rounded-xl transition-colors ${
              personalization.currentSavings === opt.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{ fontSize: "0.85rem" }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Encouraging insight */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
        <p className="text-green-700" style={{ fontSize: "0.85rem" }}>
          Every dollar saved today grows through compound interest. Starting early is the most powerful advantage you have.
        </p>
      </div>
    </div>
  );
}

/* ─── Step 4: Investment Comfort ─── */
function StepComfort() {
  const { personalization, updatePersonalization } = useEnrollment();

  const comfortLevels: {
    key: "conservative" | "balanced" | "growth" | "aggressive";
    label: string;
    desc: string;
    icon: typeof ShieldCheck;
    popular?: boolean;
  }[] = [
    { key: "conservative", label: "Conservative", desc: "Low risk, stable growth.", icon: ShieldCheck },
    { key: "balanced", label: "Balanced", desc: "Moderate growth and moderate risk.", icon: Zap, popular: true },
    { key: "growth", label: "Growth", desc: "Higher growth potential with market fluctuations.", icon: TrendingUp },
    { key: "aggressive", label: "Aggressive", desc: "Highest growth potential with higher volatility.", icon: TrendingUp },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-gray-900">How comfortable are you with investment risk?</h2>
        <p className="text-gray-500 mt-1" style={{ fontSize: "0.85rem" }}>
          This helps us recommend a portfolio that matches your style.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {comfortLevels.map((level) => (
          <button
            key={level.key}
            onClick={() => updatePersonalization({ investmentComfort: level.key })}
            className={`p-4 rounded-xl border-2 text-left transition-all relative ${
              personalization.investmentComfort === level.key
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            {level.popular && (
              <span
                className="absolute -top-2.5 right-3 bg-amber-500 text-white px-2 py-0.5 rounded-full"
                style={{ fontSize: "0.65rem", fontWeight: 600 }}
              >
                Most common
              </span>
            )}
            <div className="flex items-center gap-2 mb-1">
              <level.icon
                className={`w-4 h-4 ${
                  personalization.investmentComfort === level.key ? "text-blue-600" : "text-gray-400"
                }`}
              />
              <span
                className={personalization.investmentComfort === level.key ? "text-blue-700" : "text-gray-900"}
                style={{ fontWeight: 600, fontSize: "0.9rem" }}
              >
                {level.label}
              </span>
            </div>
            <p className="text-gray-500" style={{ fontSize: "0.8rem" }}>
              {level.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Wizard Component ─── */
export function PersonalizationWizard() {
  const [wizardStep, setWizardStep] = useState(1);
  const navigate = useNavigate();
  const { updatePersonalization, updateData, personalization } = useEnrollment();

  const canProceed = () => {
    switch (wizardStep) {
      case 1:
        return true;
      case 2:
        return personalization.retirementLocation !== "";
      case 3:
        return true;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (wizardStep < TOTAL_STEPS) {
      setWizardStep(wizardStep + 1);
    } else {
      // Complete wizard, sync comfort → riskLevel
      updatePersonalization({ wizardCompleted: true });
      updateData({ riskLevel: personalization.investmentComfort });
      navigate("/plan");
    }
  };

  const handleBack = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  const renderStep = () => {
    switch (wizardStep) {
      case 1:
        return <StepRetirementAge />;
      case 2:
        return <StepLocation />;
      case 3:
        return <StepSavings />;
      case 4:
        return <StepComfort />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-8 max-w-lg w-full">
        <WizardProgress step={wizardStep} />

        {renderStep()}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {wizardStep > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
              style={{ fontSize: "0.85rem" }}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] ${
              canProceed()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            style={{ fontSize: "0.9rem" }}
          >
            {wizardStep === TOTAL_STEPS ? "Start Enrollment" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
