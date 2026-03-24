import { useNavigate } from "react-router";
import { useEnrollment } from "./enrollment-context";
import { Check, Sparkles, ArrowRight, MessageCircle, Info, Landmark, HelpCircle } from "lucide-react";
import { useState } from "react";

export function PlanSelection() {
  const navigate = useNavigate();
  const { data, updateData, setCurrentStep } = useEnrollment();
  const [showAI, setShowAI] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"traditional" | "roth" | null>(data.plan);
  const [showTooltip, setShowTooltip] = useState(false);

  const confirmPlan = (plan: "traditional" | "roth") => {
    updateData({ plan });
    setCurrentStep(2);
    navigate("/contribution");
  };

  const handleCardClick = (plan: "traditional" | "roth") => {
    setSelectedPlan(plan);
  };

  const hasTwoPlans = data.companyPlans.length >= 2;

  // ─── Single plan case ───
  if (!hasTwoPlans) {
    const onlyPlan = data.companyPlans[0] || "traditional";
    const planLabel = onlyPlan === "traditional" ? "Traditional 401(k)" : "Roth 401(k)";

    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-8 max-w-md w-full text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto">
            <Landmark className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h2 className="text-gray-900">Your employer offers a {planLabel} retirement plan</h2>
            <p className="text-gray-500 mt-2" style={{ fontSize: "0.85rem" }}>
              {onlyPlan === "traditional"
                ? "This plan allows tax-deferred retirement savings. Your contributions reduce your taxable income today."
                : "This plan allows you to contribute after-tax dollars and withdraw tax-free in retirement."}
            </p>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-green-600 shrink-0" />
            <p className="text-green-700 text-left" style={{ fontSize: "0.8rem" }}>
              Your employer matches contributions up to 6%.
            </p>
          </div>

          <button
            onClick={() => confirmPlan(onlyPlan)}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Continue to Contributions <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>
            You can change this plan later from your account settings.
          </p>
        </div>
      </div>
    );
  }

  // ─── Two plans case ───
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-gray-900">Choose Your Retirement Plan</h1>
        <p className="text-gray-500 mt-1" style={{ fontSize: "0.9rem" }}>
          Select the retirement plan that fits your tax strategy.
        </p>
      </div>

      {/* Employer match context banner — lighter, smaller */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
        <Info className="w-4 h-4 text-gray-400 shrink-0" />
        <p className="text-gray-600" style={{ fontSize: "0.8rem" }}>
          Your employer matches contributions up to <strong>6%</strong> of your salary — that's free money toward your retirement.
        </p>
      </div>

      {/* Plan cards — equal height via flex */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* ─── Traditional 401(k) ─── */}
        <div
          onClick={() => handleCardClick("traditional")}
          className={`rounded-2xl p-5 text-left transition-all cursor-pointer flex flex-col ${
            selectedPlan === "traditional"
              ? "border-2 border-blue-500 bg-blue-50/40 shadow-md ring-2 ring-blue-100"
              : "border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-blue-200"
          }`}
        >
          {/* Badge — inside card header */}
          <div className="relative mb-1">
            <span
              className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full"
              style={{ fontSize: "0.7rem", fontWeight: 600 }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              Most Common Choice
              <HelpCircle className="w-3 h-3 opacity-70" />
            </span>

            {showTooltip && (
              <div
                className="absolute top-full left-0 mt-1 z-10 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap"
                style={{ fontSize: "0.75rem" }}
              >
                Chosen by most employees because it reduces taxable income today.
                <div className="absolute top-0 left-6 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
              </div>
            )}
          </div>

          {/* Plan title */}
          <h3 className="text-gray-900">Traditional 401(k)</h3>

          {/* Short description */}
          <p className="text-gray-500 mt-1" style={{ fontSize: "0.85rem" }}>
            Lower taxes today and grow savings tax-deferred.
          </p>

          {/* Benefits list */}
          <ul className="mt-4 space-y-2 flex-1">
            {["Lower taxable income today", "Employer match eligible", "Tax-deferred growth"].map((b) => (
              <li key={b} className="flex items-start gap-2 text-gray-700" style={{ fontSize: "0.85rem" }}>
                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          {/* Primary CTA — at bottom */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              confirmPlan("traditional");
            }}
            className="w-full mt-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-blue-600 text-white hover:bg-blue-700"
          >
            Continue with Traditional 401(k) <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ─── Roth 401(k) ─── */}
        <div
          onClick={() => handleCardClick("roth")}
          className={`rounded-2xl p-5 text-left transition-all cursor-pointer flex flex-col ${
            selectedPlan === "roth"
              ? "border-2 border-blue-500 bg-blue-50/40 shadow-md ring-2 ring-blue-100"
              : "border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-blue-200"
          }`}
        >
          {/* Plan title */}
          <h3 className="text-gray-900">Roth 401(k)</h3>

          {/* Short description */}
          <p className="text-gray-500 mt-1" style={{ fontSize: "0.85rem" }}>
            Pay taxes now and withdraw tax-free in retirement.
          </p>

          {/* Benefits list */}
          <ul className="mt-4 space-y-2 flex-1">
            {["Tax-free withdrawals in retirement", "Flexible retirement income", "No required minimum distributions"].map((b) => (
              <li key={b} className="flex items-start gap-2 text-gray-700" style={{ fontSize: "0.85rem" }}>
                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          {/* Primary CTA — at bottom */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              confirmPlan("roth");
            }}
            className={`w-full mt-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              selectedPlan === "roth"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
            }`}
          >
            Choose Roth 401(k) <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reassurance message */}
      <p className="text-center text-gray-400" style={{ fontSize: "0.8rem" }}>
        You can change this plan later from your account settings.
      </p>

      {/* Divider */}
      <div className="border-t border-gray-100 pt-2" />

      {/* ─── AI Help Section ─── */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
        <p className="text-gray-700" style={{ fontWeight: 500 }}>Not sure which plan is right for you?</p>
        <p className="text-gray-500 mt-1" style={{ fontSize: "0.8rem" }}>
          Our AI assistant can help explain the differences.
        </p>
        <div className="flex gap-3 mt-3">
          <button
            onClick={() => { setShowAI(!showAI); setShowCompare(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
              showAI
                ? "bg-purple-200 text-purple-800"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100"
            }`}
            style={{ fontSize: "0.85rem" }}
          >
            <Sparkles className="w-4 h-4" /> Ask AI
          </button>
          <button
            onClick={() => { setShowCompare(!showCompare); setShowAI(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
              showCompare
                ? "bg-gray-300 text-gray-800"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
            }`}
            style={{ fontSize: "0.85rem" }}
          >
            <MessageCircle className="w-4 h-4" /> Compare Plans
          </button>
        </div>

        {showAI && (
          <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
              <div style={{ fontSize: "0.85rem" }}>
                <p className="text-purple-800" style={{ fontWeight: 600 }}>AI Recommendation</p>
                <p className="text-purple-700 mt-1">
                  <strong>Traditional 401(k)</strong> is ideal if you expect to be in a lower tax
                  bracket in retirement — your contributions reduce your taxable income now.{" "}
                  <strong>Roth 401(k)</strong> is better if you expect higher income later — you
                  pay taxes now but withdraw tax-free. Most employees benefit from the Traditional
                  plan due to the immediate tax savings and employer match.
                </p>
              </div>
            </div>
          </div>
        )}

        {showCompare && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full" style={{ fontSize: "0.85rem" }}>
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-500" style={{ fontWeight: 500 }}>Feature</th>
                  <th className="text-left py-2 text-gray-900" style={{ fontWeight: 600 }}>Traditional</th>
                  <th className="text-left py-2 text-gray-900" style={{ fontWeight: 600 }}>Roth</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500">Contributions</td>
                  <td className="py-2">Pre-tax</td>
                  <td className="py-2">After-tax</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500">Withdrawals</td>
                  <td className="py-2">Taxed</td>
                  <td className="py-2">Tax-free</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500">Tax benefit</td>
                  <td className="py-2">Now</td>
                  <td className="py-2">In retirement</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500">RMDs</td>
                  <td className="py-2">Required</td>
                  <td className="py-2">None</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-500">Best for</td>
                  <td className="py-2">Higher tax bracket now</td>
                  <td className="py-2">Higher tax bracket later</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
