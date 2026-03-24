import { useNavigate } from "react-router";
import { useEnrollment } from "./enrollment-context";
import { ArrowRight, ArrowLeft, Lightbulb, Wallet, Sparkles, TrendingUp, Shield, DollarSign, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function ContributionSource() {
  const navigate = useNavigate();
  const { data, updateData, setCurrentStep } = useEnrollment();

  // State for showing advanced options
  const [showAdvanced, setShowAdvanced] = useState(data.contributionSources.afterTax > 0);

  const sources = data.contributionSources;
  const salary = data.salary;
  const percent = data.contributionPercent;
  const monthlyTotal = Math.round((salary * percent) / 100 / 12);
  const matchPercent = Math.min(percent, 6);
  const monthlyMatch = Math.round((salary * matchPercent) / 100 / 12);

  const monthlyPreTax = Math.round(monthlyTotal * sources.preTax / 100);
  const monthlyRoth = Math.round(monthlyTotal * sources.roth / 100);
  const monthlyAfterTax = Math.round(monthlyTotal * sources.afterTax / 100);
  const totalMonthlyInvestment = monthlyTotal + monthlyMatch;

  // Plan defaults (60% Pre-Tax, 40% Roth, 0% After-Tax)
  const planDefault = { preTax: 60, roth: 40, afterTax: 0 };
  const planDefaultPreTax = Math.round(monthlyTotal * planDefault.preTax / 100);
  const planDefaultRoth = Math.round(monthlyTotal * planDefault.roth / 100);

  // Recommended allocation (40% Pre-Tax, 60% Roth, 0% After-Tax)
  const recommended = { preTax: 40, roth: 60, afterTax: 0 };

  // Dynamic feedback based on allocation
  const getDynamicFeedback = () => {
    if (sources.roth > sources.preTax) {
      return "More tax-free income in retirement";
    } else if (sources.preTax > sources.roth) {
      return "Lower taxes today";
    }
    return "Balanced tax strategy";
  };

  // Handle individual slider changes with normalization to ensure total = 100%
  const handlePreTaxChange = (value: number) => {
    const newPreTax = Math.min(100, Math.max(0, value));
    const remaining = 100 - newPreTax;
    
    // Proportionally distribute remaining between Roth and AfterTax
    const currentRothAfterTaxTotal = sources.roth + sources.afterTax;
    if (currentRothAfterTaxTotal > 0) {
      const rothRatio = sources.roth / currentRothAfterTaxTotal;
      updateData({
        contributionSources: {
          preTax: newPreTax,
          roth: Math.round(remaining * rothRatio),
          afterTax: Math.round(remaining * (1 - rothRatio)),
        },
      });
    } else {
      updateData({
        contributionSources: {
          preTax: newPreTax,
          roth: remaining,
          afterTax: 0,
        },
      });
    }
  };

  const handleRothChange = (value: number) => {
    const newRoth = Math.min(100, Math.max(0, value));
    const remaining = 100 - newRoth;
    
    // Proportionally distribute remaining between PreTax and AfterTax
    const currentPreTaxAfterTaxTotal = sources.preTax + sources.afterTax;
    if (currentPreTaxAfterTaxTotal > 0) {
      const preTaxRatio = sources.preTax / currentPreTaxAfterTaxTotal;
      updateData({
        contributionSources: {
          preTax: Math.round(remaining * preTaxRatio),
          roth: newRoth,
          afterTax: Math.round(remaining * (1 - preTaxRatio)),
        },
      });
    } else {
      updateData({
        contributionSources: {
          preTax: remaining,
          roth: newRoth,
          afterTax: 0,
        },
      });
    }
  };

  const handleAfterTaxChange = (value: number) => {
    const newAfterTax = Math.min(100, Math.max(0, value));
    const remaining = 100 - newAfterTax;
    
    // Proportionally distribute remaining between PreTax and Roth
    const currentPreTaxRothTotal = sources.preTax + sources.roth;
    if (currentPreTaxRothTotal > 0) {
      const preTaxRatio = sources.preTax / currentPreTaxRothTotal;
      updateData({
        contributionSources: {
          preTax: Math.round(remaining * preTaxRatio),
          roth: Math.round(remaining * (1 - preTaxRatio)),
          afterTax: newAfterTax,
        },
      });
    } else {
      updateData({
        contributionSources: {
          preTax: remaining,
          roth: 0,
          afterTax: newAfterTax,
        },
      });
    }
  };

  const applyRecommendation = () => {
    updateData({
      contributionSources: {
        preTax: recommended.preTax,
        roth: recommended.roth,
        afterTax: recommended.afterTax,
      },
    });
  };

  const applyDefaultAllocation = () => {
    updateData({
      contributionSources: {
        preTax: planDefault.preTax,
        roth: planDefault.roth,
        afterTax: planDefault.afterTax,
      },
    });
    handleNext();
  };

  const handleNext = () => {
    setCurrentStep(4);
    navigate("/auto-increase");
  };

  // Calculate total to show error if doesn't equal 100%
  const total = sources.preTax + sources.roth + sources.afterTax;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <button
          onClick={() => {
            setCurrentStep(2);
            navigate("/contribution");
          }}
          className="flex items-center gap-1 text-muted-foreground mb-3 hover:text-foreground transition-colors"
          style={{ fontSize: "0.85rem" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>How do you want to pay taxes?</h1>
            <p className="text-muted-foreground mt-2" style={{ fontSize: "1rem", lineHeight: 1.6 }}>Choose when you want to pay taxes on your savings.</p>
          </div>
          {/* Simplified Banner */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl px-5 py-3 shrink-0">
            <Wallet className="w-5 h-5 text-blue-600" />
            <p className="text-blue-900" style={{ fontSize: "0.95rem", fontWeight: 700 }}>
              You're contributing {percent}% (${monthlyTotal.toLocaleString()}/month)
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "35% 65%" }}>
        {/* LEFT: Plan Default Card - 35% (reduced emphasis) */}
        <div className="bg-card rounded-2xl border border-border p-5 space-y-4 flex flex-col opacity-90">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2.5 py-1 bg-secondary rounded-md">
                <p className="text-muted-foreground" style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Default
                </p>
              </div>
            </div>
            <h3 className="text-foreground" style={{ fontSize: "1rem", fontWeight: 700 }}>
              Plan Default
            </h3>
            <p className="text-muted-foreground mt-1" style={{ fontSize: "0.75rem" }}>
              Applied if no changes are made
            </p>
          </div>

          {/* Gradient Bar */}
          <div>
            <div className="h-2.5 rounded-full overflow-hidden flex">
              {planDefault.preTax > 0 && (
                <div 
                  className="bg-blue-600"
                  style={{ width: `${planDefault.preTax}%` }}
                />
              )}
              {planDefault.roth > 0 && (
                <div 
                  className="bg-purple-600"
                  style={{ width: `${planDefault.roth}%` }}
                />
              )}
            </div>
          </div>

          {/* Allocation Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <p className="text-foreground" style={{ fontSize: "0.8rem" }}>
                  Pre-Tax ({planDefault.preTax}%)
                </p>
              </div>
              <p className="text-foreground" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                ${planDefaultPreTax.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600" />
                <p className="text-foreground" style={{ fontSize: "0.8rem" }}>
                  Roth ({planDefault.roth}%)
                </p>
              </div>
              <p className="text-foreground" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                ${planDefaultRoth.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Helper Text */}
          <div className="pt-3 border-t border-border flex-1 flex items-end">
            <p className="text-muted-foreground text-center w-full" style={{ fontSize: "0.7rem", lineHeight: 1.5 }}>
              Your employer's default allocation balances tax benefits.
            </p>
          </div>

          {/* Apply Button - Tertiary style */}
          <button
            onClick={() => {
              updateData({
                contributionSources: {
                  preTax: planDefault.preTax,
                  roth: planDefault.roth,
                  afterTax: planDefault.afterTax,
                },
              });
              handleNext();
            }}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all shadow-md"
            style={{ fontSize: "0.85rem", fontWeight: 600 }}
          >
            Continue with Plan Default 
          </button>
        </div>

        {/* RIGHT: Your Tax Strategy Card - 65% */}
        <div className="bg-card rounded-2xl border-2 border-blue-100 shadow-lg p-6 flex gap-6">
          {/* Left Section - 70% */}
          <div className="flex-1 space-y-4 flex flex-col" style={{ width: "70%" }}>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-foreground" style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                  Your Tax Strategy
                </h3>
                <p className="text-muted-foreground mt-0.5" style={{ fontSize: "0.8rem" }}>
                  Total allocation: 100%
                </p>
              </div>
              <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <p className="text-blue-700" style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Recommended
                </p>
              </div>
            </div>

            {/* Visual Allocation Bar */}
            <div className="space-y-2">
              <div className="h-4 rounded-full overflow-hidden flex shadow-sm border border-border">
                {sources.preTax > 0 && (
                  <div 
                    className="bg-blue-600 transition-all duration-300"
                    style={{ width: `${sources.preTax}%` }}
                  />
                )}
                {sources.roth > 0 && (
                  <div 
                    className="bg-purple-600 transition-all duration-300"
                    style={{ width: `${sources.roth}%` }}
                  />
                )}
                {sources.afterTax > 0 && (
                  <div 
                    className="bg-orange-600 transition-all duration-300"
                    style={{ width: `${sources.afterTax}%` }}
                  />
                )}
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="text-muted-foreground">{sources.preTax}% Pre-Tax</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-purple-600" />
                  <span className="text-muted-foreground">{sources.roth}% Roth</span>
                </div>
                {sources.afterTax > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-orange-600" />
                    <span className="text-muted-foreground">{sources.afterTax}% After-Tax</span>
                  </div>
                )}
              </div>
            </div>

            {/* Individual Sliders */}
            <div className="space-y-4">
              {/* Pre-Tax Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-600" />
                      <p className="text-foreground" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                        Pre-Tax
                      </p>
                    </div>
                    <p className="text-muted-foreground ml-5" style={{ fontSize: "0.7rem", lineHeight: 1.4 }}>
                      Lower taxes today
                    </p>
                  </div>
                  <p className="text-blue-700" style={{ fontSize: "1.3rem", fontWeight: 800, lineHeight: 1 }}>
                    {sources.preTax}%
                  </p>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sources.preTax}
                  onChange={(e) => handlePreTaxChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${sources.preTax}%, #e5e7eb ${sources.preTax}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex items-center justify-between text-muted-foreground" style={{ fontSize: "0.7rem" }}>
                  <span>0%</span>
                  <span className="text-foreground" style={{ fontWeight: 600 }}>${monthlyPreTax.toLocaleString()}/mo</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Roth Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-600" />
                      <p className="text-foreground" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                        Roth
                      </p>
                    </div>
                    <p className="text-muted-foreground ml-5" style={{ fontSize: "0.7rem", lineHeight: 1.4 }}>
                      Tax-free withdrawals later
                    </p>
                  </div>
                  <p className="text-purple-700" style={{ fontSize: "1.3rem", fontWeight: 800, lineHeight: 1 }}>
                    {sources.roth}%
                  </p>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sources.roth}
                  onChange={(e) => handleRothChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${sources.roth}%, #e5e7eb ${sources.roth}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex items-center justify-between text-muted-foreground" style={{ fontSize: "0.7rem" }}>
                  <span>0%</span>
                  <span className="text-foreground" style={{ fontWeight: 600 }}>${monthlyRoth.toLocaleString()}/mo</span>
                  <span>100%</span>
                </div>
              </div>

              {/* After-Tax Slider (Progressive Disclosure) */}
              {showAdvanced && (
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="px-2 py-0.5 bg-orange-50 border border-orange-200 rounded">
                      <p className="text-orange-700" style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase" }}>
                        Advanced
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-600" />
                          <p className="text-foreground" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                            After-Tax
                          </p>
                        </div>
                        <p className="text-muted-foreground ml-5" style={{ fontSize: "0.7rem", lineHeight: 1.4 }}>
                          For advanced strategies (e.g., backdoor Roth)
                        </p>
                      </div>
                      <p className="text-orange-700" style={{ fontSize: "1.3rem", fontWeight: 800, lineHeight: 1 }}>
                        {sources.afterTax}%
                      </p>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={sources.afterTax}
                      onChange={(e) => handleAfterTaxChange(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #ea580c 0%, #ea580c ${sources.afterTax}%, #e5e7eb ${sources.afterTax}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex items-center justify-between text-muted-foreground" style={{ fontSize: "0.7rem" }}>
                      <span>0%</span>
                      <span className="text-foreground" style={{ fontWeight: 600 }}>${monthlyAfterTax.toLocaleString()}/mo</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Show/Hide Advanced Options */}
            {!showAdvanced && (
              <button
                onClick={() => setShowAdvanced(true)}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors self-start"
                style={{ fontSize: "0.8rem", fontWeight: 500 }}
              >
                <ChevronDown className="w-4 h-4" />
                Show advanced options
              </button>
            )}
            {showAdvanced && (
              <button
                onClick={() => {
                  setShowAdvanced(false);
                  // Reset after-tax to 0 when hiding
                  if (sources.afterTax > 0) {
                    updateData({
                      contributionSources: {
                        preTax: sources.preTax + sources.afterTax,
                        roth: sources.roth,
                        afterTax: 0,
                      },
                    });
                  }
                }}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors self-start"
                style={{ fontSize: "0.8rem", fontWeight: 500 }}
              >
                <ChevronUp className="w-4 h-4" />
                Hide advanced options
              </button>
            )}

            {/* Merged Recommendation Card - Score + Recommendation */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <p className="text-blue-900" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                    Recommended for You
                  </p>
                </div>
                <div className="px-2 py-1 bg-green-100 rounded-lg">
                  <p className="text-green-700" style={{ fontSize: "0.75rem", fontWeight: 800 }}>
                    Score: 72
                  </p>
                </div>
              </div>
              <p className="text-foreground mb-2.5" style={{ fontSize: "0.8rem", lineHeight: 1.5 }}>
                {recommended.preTax}% Pre-Tax / {recommended.roth}% Roth — optimized for your profile
              </p>
            </div>

            {/* Smart Insight - Shortened */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <div className="flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-blue-900" style={{ fontSize: "0.75rem", fontWeight: 600, lineHeight: 1.5 }}>
                    Roth may be better — tax-free income later
                  </p>
                </div>
              </div>
              <button
                onClick={handleNext}
                disabled={total !== 100}
                className="w-full mt-3 bg-white text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-all border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontSize: "0.75rem", fontWeight: 600 }}
              >
                Continue with Custom Allocation
              </button>
            </div>
          </div>

          {/* Right Section - 30% - Restructured Monthly Impact */}
          <div className="border-l border-border pl-5 flex flex-col justify-between" style={{ width: "30%" }}>
            <div className="space-y-4">
              <div>
                <h4 className="text-foreground mb-1" style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Your monthly impact
                </h4>
              </div>

              {/* Grouped Contribution */}
              <div>
                <p className="text-muted-foreground mb-2" style={{ fontSize: "0.7rem" }}>
                  You contribute:
                </p>
                <p className="text-foreground mb-3" style={{ fontSize: "1.3rem", fontWeight: 800 }}>
                  ${monthlyTotal.toLocaleString()}
                </p>
                
                {/* Breakdown */}
                <div className="space-y-1.5 pl-3 border-l-2 border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      <p className="text-muted-foreground" style={{ fontSize: "0.7rem" }}>
                        Pre-Tax
                      </p>
                    </div>
                    <p className="text-foreground" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                      ${monthlyPreTax.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                      <p className="text-muted-foreground" style={{ fontSize: "0.7rem" }}>
                        Roth
                      </p>
                    </div>
                    <p className="text-foreground" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                      ${monthlyRoth.toLocaleString()}
                    </p>
                  </div>

                  {monthlyAfterTax > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                        <p className="text-muted-foreground" style={{ fontSize: "0.7rem" }}>
                          After-Tax
                        </p>
                      </div>
                      <p className="text-foreground" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                        ${monthlyAfterTax.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Employer Match - Highlighted */}
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-lg p-3">
                <p className="text-green-700 mb-1" style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Employer match
                </p>
                <p className="text-green-700" style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                  +${monthlyMatch.toLocaleString()}/month
                </p>
                <p className="text-green-600 mt-1" style={{ fontSize: "0.65rem" }}>
                  100% on first {matchPercent}%
                </p>
              </div>

              {/* Total Investment */}
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-muted-foreground mb-1" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                  Total investment
                </p>
                <p className="text-foreground" style={{ fontSize: "1.5rem", fontWeight: 800 }}>
                  ${totalMonthlyInvestment.toLocaleString()}
                </p>
                <p className="text-muted-foreground mt-0.5" style={{ fontSize: "0.65rem" }}>
                  per month
                </p>
              </div>
            </div>

            {/* Continue with Custom Allocation Button */}
            <button
              onClick={handleNext}
              disabled={total !== 100}
              className="bg-white text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-all border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontSize: "0.8rem", fontWeight: 600 }}
            >
              Continue with Custom Allocation
            </button>
          </div>
        </div>
      </div>

      {/* Understanding the Difference Section - Lighter weight */}
      <div className="space-y-3 opacity-90">
        <h2 className="text-foreground" style={{ fontSize: "1.3rem", fontWeight: 700 }}>
          Understanding the Difference
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Pre-Tax Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-foreground" style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                Pre-Tax
              </h3>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-foreground" style={{ fontSize: "0.8rem" }}>
                  Lower taxes today
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-foreground" style={{ fontSize: "0.8rem" }}>
                  Reduces current taxable income
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-foreground" style={{ fontSize: "0.8rem" }}>
                  Pay taxes when you withdraw
                </p>
              </div>
            </div>
          </div>

          {/* Roth Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-foreground" style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                Roth
              </h3>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                <p className="text-foreground" style={{ fontSize: "0.8rem" }}>
                  Tax-free withdrawals later
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                <p className="text-foreground" style={{ fontSize: "0.8rem" }}>
                  Pay taxes now at current rate
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                <p className="text-foreground" style={{ fontSize: "0.8rem" }}>
                  Growth is tax-free
                </p>
              </div>
            </div>
          </div>

          {/* After-Tax Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-foreground" style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                After-Tax
              </h3>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-orange-600 mt-0.5 shrink-0" />
                <p className="text-foreground" style={{ fontSize: "0.8rem" }}>
                  For high earners
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-orange-600 mt-0.5 shrink-0" />
                <p className="text-foreground" style={{ fontSize: "0.8rem" }}>
                  Mega backdoor Roth option
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-orange-600 mt-0.5 shrink-0" />
                <p className="text-foreground" style={{ fontSize: "0.8rem" }}>
                  Advanced tax strategy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}