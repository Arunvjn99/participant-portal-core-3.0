import { useState, useMemo, useId } from "react";
import { useNavigate } from "react-router";
import { useEnrollment } from "./enrollment-context";
import { ArrowRight, ArrowLeft, TrendingUp, Calendar, Target, DollarSign, Info } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export function AutoIncreaseSetup() {
  const navigate = useNavigate();
  const { data, updateData, setCurrentStep, personalization } = useEnrollment();

  const [increaseAmount, setIncreaseAmount] = useState(data.autoIncreaseAmount);
  const [maxContribution, setMaxContribution] = useState(Math.min(data.autoIncreaseMax, 15));
  const [incrementCycle, setIncrementCycle] = useState<"calendar" | "participant" | "plan">("calendar");

  const currentPercent = data.contributionPercent;
  const salary = data.salary;
  const gradientId = useId().replace(/:/g, "_") + "_autoInc";

  // Calculate current monthly contribution
  const currentMonthlyContribution = Math.round((salary * currentPercent) / 100 / 12);
  const currentAnnualContribution = Math.round((salary * currentPercent) / 100);

  // Progression data for both chart and summary
  const progression = useMemo(() => {
    if (increaseAmount === 0 || currentPercent >= maxContribution) {
      // Need at least 2 points for the chart to render properly
      return [
        { year: 0, percent: currentPercent },
        { year: 1, percent: currentPercent },
      ];
    }
    const points: { year: number; percent: number }[] = [
      { year: 0, percent: currentPercent },
    ];
    let pct = currentPercent;
    let yr = 0;
    while (pct < maxContribution && yr < 30) {
      yr++;
      pct = Math.min(pct + increaseAmount, maxContribution);
      points.push({ year: yr, percent: Math.round(pct * 10) / 10 });
    }
    // Add one flat year after max for visual clarity
    const lastYear = points[points.length - 1].year;
    points.push({ year: lastYear + 1, percent: maxContribution });
    return points;
  }, [currentPercent, increaseAmount, maxContribution]);

  const yearsToMax =
    currentPercent >= maxContribution || increaseAmount === 0
      ? 0
      : Math.ceil((maxContribution - currentPercent) / increaseAmount);

  // Generate year-by-year table data
  const yearByYearData = useMemo(() => {
    if (increaseAmount === 0 || currentPercent >= maxContribution) {
      return [];
    }
    const rows: { year: number; percent: number; annual: number; date: string }[] = [];
    let pct = currentPercent;
    let yr = 0;
    
    // Determine next increase date based on increment cycle
    const getNextDate = (yearOffset: number) => {
      const today = new Date();
      if (incrementCycle === "calendar") {
        return new Date(today.getFullYear() + yearOffset, 0, 1); // Jan 1
      } else if (incrementCycle === "plan") {
        return new Date(today.getFullYear() + yearOffset, 3, 1); // Apr 1
      } else {
        // participant - assume Aug 15 as enrollment date
        return new Date(today.getFullYear() + yearOffset, 7, 15); // Aug 15
      }
    };

    while (pct < maxContribution && yr <= yearsToMax) {
      const annual = Math.round((salary * pct) / 100);
      const nextDate = getNextDate(yr);
      rows.push({
        year: yr,
        percent: Math.round(pct * 10) / 10,
        annual,
        date: nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      
      if (pct < maxContribution) {
        pct = Math.min(pct + increaseAmount, maxContribution);
      }
      yr++;
    }
    
    return rows;
  }, [currentPercent, increaseAmount, maxContribution, salary, yearsToMax, incrementCycle]);

  // Financial impact comparison
  const financialImpact = useMemo(() => {
    const yearsToRetirement = personalization.retirementAge - personalization.currentAge;
    const growthRates: Record<string, number> = {
      conservative: 0.045,
      balanced: 0.068,
      growth: 0.082,
      aggressive: 0.095,
    };
    const growthRate = growthRates[data.riskLevel] || 0.068;

    // Without auto increase
    let balanceFixed = personalization.currentSavings;
    for (let y = 0; y < yearsToRetirement; y++) {
      const contrib = (currentPercent / 100) * salary;
      const match = (Math.min(currentPercent, 6) / 100) * salary;
      balanceFixed = (balanceFixed + contrib + match) * (1 + growthRate);
    }

    // With auto increase
    let balanceAuto = personalization.currentSavings;
    let autoPct = currentPercent;
    for (let y = 0; y < yearsToRetirement; y++) {
      const contrib = (autoPct / 100) * salary;
      const match = (Math.min(autoPct, 6) / 100) * salary;
      balanceAuto = (balanceAuto + contrib + match) * (1 + growthRate);
      autoPct = Math.min(autoPct + increaseAmount, maxContribution);
    }

    return {
      withoutIncrease: balanceFixed,
      withIncrease: balanceAuto,
      difference: balanceAuto - balanceFixed,
    };
  }, [currentPercent, increaseAmount, maxContribution, salary, data.riskLevel, personalization]);

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000).toLocaleString()}K`;
    return `$${Math.round(val).toLocaleString()}`;
  };

  const handleSave = () => {
    updateData({
      autoIncrease: true,
      autoIncreaseAmount: increaseAmount,
      autoIncreaseMax: maxContribution,
    });
    setCurrentStep(5);
    navigate("/investment");
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
          <p className="text-gray-500" style={{ fontSize: "0.7rem" }}>
            {label === 0 ? "Today" : `Year ${label}`}
          </p>
          <p className="text-gray-900 tabular-nums" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            {payload[0].value}% of salary
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/auto-increase")}
          className="flex items-center gap-1 text-gray-500 mb-3 hover:text-gray-700"
          style={{ fontSize: "0.85rem" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-4.5 h-4.5 text-green-600" />
              </div>
              <h1 className="text-gray-900">Configure your automatic increases</h1>
            </div>
            <p className="text-gray-500 mt-1" style={{ fontSize: "0.9rem" }}>
              Your contribution will gradually increase over time.
            </p>
          </div>
          
          {/* Current Contribution Display - Moved to top right */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 shrink-0">
            <div className="flex items-start gap-6">
              <div>
                <p className="text-blue-700 mb-0.5" style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Current
                </p>
                <p className="text-blue-900" style={{ fontSize: "1.5rem", fontWeight: 800, lineHeight: 1 }}>
                  {currentPercent}%
                </p>
                <p className="text-blue-700 mt-1" style={{ fontSize: "0.7rem" }}>
                  ${currentMonthlyContribution.toLocaleString()}/mo
                </p>
              </div>
              <div className="border-l border-blue-300 pl-6">
                <p className="text-blue-600 mb-0.5" style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Target Max
                </p>
                <p className="text-blue-900" style={{ fontSize: "1.5rem", fontWeight: 800, lineHeight: 1 }}>
                  {maxContribution}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid lg:grid-cols-5 gap-5 items-start">
        {/* ════ Left Column — Controls (3/5) ════ */}
        <div className="lg:col-span-3 space-y-4 order-1">
          {/* Increment Cycle Selection - Horizontal Layout */}
          <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm px-4 py-3">
            <h3 className="text-gray-900 mb-2.5" style={{ fontSize: "0.9rem", fontWeight: 700 }}>
              Increment Cycle
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {/* Calendar Year Option */}
              <label className="flex flex-col gap-2 cursor-pointer group border-2 border-gray-200 rounded-xl p-3 hover:border-blue-300 transition-all has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="increment-cycle"
                    value="calendar"
                    checked={incrementCycle === "calendar"}
                    onChange={(e) => setIncrementCycle(e.target.value as "calendar")}
                    className="w-4 h-4 text-blue-600 cursor-pointer"
                  />
                  <p className="text-gray-900" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    Calendar Year
                  </p>
                </div>
                <p className="text-gray-500 ml-6" style={{ fontSize: "0.7rem" }}>
                  Every Jan 1st
                </p>
              </label>

              {/* Plan Participant Date Option */}
              <label className="flex flex-col gap-2 cursor-pointer group border-2 border-gray-200 rounded-xl p-3 hover:border-blue-300 transition-all has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="increment-cycle"
                    value="participant"
                    checked={incrementCycle === "participant"}
                    onChange={(e) => setIncrementCycle(e.target.value as "participant")}
                    className="w-4 h-4 text-blue-600 cursor-pointer"
                  />
                  <p className="text-gray-900" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    Participant Date
                  </p>
                </div>
                <p className="text-gray-500 ml-6" style={{ fontSize: "0.7rem" }}>
                  On enrollment date
                </p>
              </label>

              {/* Plan Year Option */}
              <label className="flex flex-col gap-2 cursor-pointer group border-2 border-gray-200 rounded-xl p-3 hover:border-blue-300 transition-all has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="increment-cycle"
                    value="plan"
                    checked={incrementCycle === "plan"}
                    onChange={(e) => setIncrementCycle(e.target.value as "plan")}
                    className="w-4 h-4 text-blue-600 cursor-pointer"
                  />
                  <p className="text-gray-900" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    Plan Year
                  </p>
                </div>
                <p className="text-gray-500 ml-6" style={{ fontSize: "0.7rem" }}>
                  Every April 1
                </p>
              </label>
            </div>
          </div>

          {/* Increase Amount Slider - More Compact */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <label className="text-gray-900" style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                  How much do you want to increase per cycle?
                </label>

                {/* Slider */}
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400" style={{ fontSize: "0.65rem" }}>0%</span>
                    <span className="text-blue-600 tabular-nums" style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                      {increaseAmount}% per cycle
                    </span>
                    <span className="text-gray-400" style={{ fontSize: "0.65rem" }}>3%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={3}
                    step={0.5}
                    value={increaseAmount}
                    onChange={(e) => setIncreaseAmount(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                    style={{
                      background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(increaseAmount / 3) * 100}%, #e5e7eb ${(increaseAmount / 3) * 100}%, #e5e7eb 100%)`,
                    }}
                  />
                </div>

                {/* Quick presets */}
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setIncreaseAmount(opt)}
                      className={`flex-1 py-1.5 rounded-lg transition-all ${
                        increaseAmount === opt
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      style={{ fontSize: "0.75rem", fontWeight: 500 }}
                    >
                      {opt}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Maximum Contribution Slider */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 mt-0.5">
                <Target className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <label className="text-gray-900" style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                  Stop increasing when contributions reach
                </label>
                <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.78rem" }}>
                  Your contribution rate will not exceed this percentage.
                </p>

                {/* Slider */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-gray-400" style={{ fontSize: "0.7rem" }}>10%</span>
                    <span className="text-purple-600 tabular-nums" style={{ fontSize: "1rem", fontWeight: 700 }}>
                      {maxContribution}%
                    </span>
                    <span className="text-gray-400" style={{ fontSize: "0.7rem" }}>15%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={15}
                    step={1}
                    value={maxContribution}
                    onChange={(e) => setMaxContribution(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-purple-600"
                    style={{
                      background: `linear-gradient(to right, #9333ea 0%, #9333ea ${((maxContribution - 10) / 5) * 100}%, #e5e7eb ${((maxContribution - 10) / 5) * 100}%, #e5e7eb 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Helper text */}
          <div className="flex items-start gap-2.5 px-1">
            <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-gray-400" style={{ fontSize: "0.78rem" }}>
              Automatic increases apply once per year on your enrollment anniversary. Your contribution will
              rise by the selected percentage each year until it reaches your maximum. You can change or
              disable automatic increases at any time.
            </p>
          </div>

          {/* CTA — desktop: below controls in left column */}
          <div className="hidden lg:block pt-1">
            <button
              onClick={handleSave}
              disabled={increaseAmount === 0}
              className={`w-full py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all ${
                increaseAmount > 0
                  ? "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Save Auto Increase <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ════ Right Column — Projection (2/5) ════ */}
        <div className="lg:col-span-2 order-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm lg:sticky lg:top-28 overflow-hidden">
            {/* Chart */}
            

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Progression Summary */}
            <div className="px-5 py-3.5">
              <p className="text-gray-700" style={{ fontSize: "0.82rem" }}>
                {currentPercent >= maxContribution ? (
                  <>Your contribution rate is already at or above your selected maximum.</>
                ) : increaseAmount === 0 ? (
                  <>Select an increase amount to see your contribution growth path.</>
                ) : (
                  <>
                    Your contribution will grow from{" "}
                    <span className="text-gray-900" style={{ fontWeight: 600 }}>{currentPercent}%</span> to{" "}
                    <span className="text-gray-900" style={{ fontWeight: 600 }}>{maxContribution}%</span> over
                    approximately{" "}
                    <span className="text-gray-900" style={{ fontWeight: 600 }}>
                      {yearsToMax} {yearsToMax === 1 ? "year" : "years"}
                    </span>.
                  </>
                )}
              </p>
            </div>

            {/* Savings Impact */}
            {increaseAmount > 0 && financialImpact.difference > 0 && (
              <>
                <div className="border-t border-gray-100" />
                <div className="px-5 py-4 space-y-3">
                  <p className="text-gray-900" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                    Savings Impact
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-gray-50 rounded-xl px-3 py-3 text-center">
                      <p
                        className="text-gray-400 mb-0.5"
                        style={{ fontSize: "0.6rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
                      >
                        Without increases
                      </p>
                      <p className="text-gray-600 tabular-nums" style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                        {formatCurrency(financialImpact.withoutIncrease)}
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-3 text-center">
                      <p
                        className="text-green-700 mb-0.5"
                        style={{ fontSize: "0.6rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
                      >
                        With increases
                      </p>
                      <p className="text-green-700 tabular-nums" style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                        {formatCurrency(financialImpact.withIncrease)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl px-3.5 py-2.5">
                    <DollarSign className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <p className="text-green-800" style={{ fontSize: "0.78rem" }}>
                      Automatic increases could add approximately{" "}
                      <span style={{ fontWeight: 700 }}>
                        {formatCurrency(financialImpact.difference)}
                      </span>{" "}
                      more to your retirement savings compared to keeping contributions fixed.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Year-by-Year Progression Table */}
            {yearByYearData.length > 0 && (
              <>
                <div className="border-t border-gray-100" />
                <div className="px-4 py-3">
                  <h3 className="text-gray-900 mb-3" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                    Growth Timeline
                  </h3>
                  
                  <div className="overflow-x-auto -mx-4">
                    <table className="w-full">
                      <thead className="border-b border-gray-200">
                        <tr>
                          <th className="px-3 py-1.5 text-left text-gray-600" style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Year
                          </th>
                          <th className="px-3 py-1.5 text-left text-gray-600" style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Date
                          </th>
                          <th className="px-3 py-1.5 text-left text-gray-600" style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            %
                          </th>
                          <th className="px-3 py-1.5 text-right text-gray-600" style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Annual
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {yearByYearData.map((row, idx) => (
                          <tr key={idx} className={`hover:bg-gray-50 transition-colors ${row.percent === maxContribution ? 'bg-purple-50' : ''}`}>
                            <td className="px-3 py-1.5 text-gray-900" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                              {row.year === 0 ? 'Now' : `Y${row.year}`}
                            </td>
                            <td className="px-3 py-1.5 text-gray-600" style={{ fontSize: "0.7rem" }}>
                              {row.date}
                            </td>
                            <td className="px-3 py-1.5">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-900 tabular-nums" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                                  {row.percent}%
                                </span>
                                {row.percent === maxContribution && (
                                  <span className="px-1 py-0.5 bg-purple-100 text-purple-700 rounded" style={{ fontSize: "0.55rem", fontWeight: 600 }}>
                                    MAX
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-1.5 text-right text-gray-900 tabular-nums" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                              ${(row.annual / 1000).toFixed(0)}K
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-gray-700" style={{ fontSize: "0.7rem" }}>
                      <span className="font-semibold text-gray-900">Timeline:</span> {currentPercent}% → {maxContribution}% over {yearsToMax} {yearsToMax === 1 ? 'yr' : 'yrs'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CTA — mobile only (sticky bottom) */}
      <div className="sticky bottom-4 lg:hidden">
        <button
          onClick={handleSave}
          disabled={increaseAmount === 0}
          className={`w-full py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
            increaseAmount > 0
              ? "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Save Auto Increase <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}