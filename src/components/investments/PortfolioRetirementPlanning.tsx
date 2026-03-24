import { useRef, useState } from "react";
import { Area, AreaChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Target, TrendingUp } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import {
  mockRetirementGoalK,
  mockRetirementScenarios,
  RETIREMENT_SCENARIO_TABS,
  type RetirementScenarioTab,
} from "@/modules/investment/data/mockPortfolioDashboard";

function ReadinessRing({ score, color, trackColor }: { score: number; color: string; trackColor: string }) {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="inv-portfolio-retire__ring">
      <svg width={96} height={96} viewBox="0 0 96 96" aria-hidden>
        <circle cx={48} cy={48} r={40} fill="none" stroke={trackColor} strokeWidth={7} />
        <circle
          cx={48}
          cy={48}
          r={40}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 48 48)"
          style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.3s ease" }}
        />
      </svg>
      <div className="inv-portfolio-retire__ring-label">
        <span className="inv-portfolio-retire__ring-score">{score}</span>
        <span className="inv-portfolio-retire__ring-max">/ 100</span>
      </div>
    </div>
  );
}

function scoreLabel(score: number) {
  if (score >= 80) return { text: "On Track", className: "inv-portfolio-retire__pill inv-portfolio-retire__pill--ok" };
  if (score >= 60) return { text: "Needs Attention", className: "inv-portfolio-retire__pill inv-portfolio-retire__pill--warn" };
  return { text: "Off Track", className: "inv-portfolio-retire__pill inv-portfolio-retire__pill--bad" };
}

function projectedMeetsGoal(projectedLabel: string): boolean {
  const digits = projectedLabel.replace(/\D/g, "");
  const n = parseInt(digits, 10);
  return n >= mockRetirementGoalK * 1000;
}

/**
 * Scenarios, readiness ring, and projection area chart (Figma-aligned).
 */
export function PortfolioRetirementPlanning() {
  const gradIdRef = useRef(`rg${Math.random().toString(36).slice(2, 10)}`);
  const gradId = gradIdRef.current;
  const { currentColors } = useTheme();
  const trackColor = currentColors.border;
  const tickFill = currentColors.textSecondary;

  const [active, setActive] = useState<RetirementScenarioTab>("Base");
  const scenario = mockRetirementScenarios[active];
  const meetsGoal = projectedMeetsGoal(scenario.projectedLabel);
  const pill = scoreLabel(scenario.score);

  return (
    <section className="inv-portfolio-retire inv-portfolio-card" aria-labelledby="inv-portfolio-retire-title">
      <div className="inv-portfolio-retire__head">
        <Target className="inv-portfolio-retire__head-icon" aria-hidden />
        <div>
          <h2 id="inv-portfolio-retire-title" className="inv-portfolio-retire__title">
            Retirement Planning
          </h2>
          <p className="inv-portfolio-retire__subtitle">What your portfolio means for retirement at age 65</p>
        </div>
      </div>

      <div className="inv-portfolio-retire__stats">
        <div className="inv-portfolio-retire__stat inv-portfolio-retire__stat--row">
          <ReadinessRing score={scenario.score} color={scenario.chartColor} trackColor={trackColor} />
          <div>
            <p className="inv-portfolio-retire__stat-label">Readiness Score</p>
            <span className={pill.className}>
              <TrendingUp className="inv-portfolio-retire__pill-icon" aria-hidden />
              {pill.text}
            </span>
          </div>
        </div>

        <div className="inv-portfolio-retire__stat">
          <p className="inv-portfolio-retire__stat-label">Projected at 65</p>
          <p className="inv-portfolio-retire__stat-value">{scenario.projectedLabel}</p>
          <span
            className={
              meetsGoal ? "inv-portfolio-retire__goal-pill inv-portfolio-retire__goal-pill--met" : "inv-portfolio-retire__goal-pill inv-portfolio-retire__goal-pill--below"
            }
          >
            {meetsGoal ? "Meets Goal" : "Below $1.3M Goal"}
          </span>
        </div>

        <div className="inv-portfolio-retire__stat">
          <p className="inv-portfolio-retire__stat-label">Est. Monthly Income</p>
          <div className="inv-portfolio-retire__income-row">
            <p className="inv-portfolio-retire__stat-value">{scenario.monthlyIncome}</p>
            <span className="inv-portfolio-retire__income-suffix">/mo</span>
          </div>
          <p className="inv-portfolio-retire__income-note">Based on 4% withdrawal rate</p>
        </div>
      </div>

      <div className="inv-portfolio-retire__tabs" role="tablist" aria-label="Retirement scenario">
        {RETIREMENT_SCENARIO_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            className={`inv-portfolio-retire__tab${active === tab ? " inv-portfolio-retire__tab--active" : ""}`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="inv-portfolio-retire__chart">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={scenario.data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id={`retireGrad-${gradId}-${active}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={scenario.chartColor} stopOpacity={0.12} />
                <stop offset="100%" stopColor={scenario.chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="age"
              tick={{ fontSize: 11, fill: tickFill }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: tickFill }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}k`}
            />
            <ReferenceLine
              y={mockRetirementGoalK}
              stroke={tickFill}
              strokeDasharray="6 4"
              label={{
                value: "Goal: $1.3M",
                position: "insideTopRight",
                fill: tickFill,
                fontSize: 10,
              }}
            />
            <Area
              type="monotone"
              dataKey="projected"
              stroke={scenario.chartColor}
              strokeWidth={2.5}
              fill={`url(#retireGrad-${gradId}-${active})`}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: currentColors.surface }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="inv-portfolio-retire__legend">
        <div className="inv-portfolio-retire__legend-item">
          <span className="inv-portfolio-retire__legend-line" style={{ backgroundColor: scenario.chartColor }} />
          <span>Projected Savings</span>
        </div>
        <div className="inv-portfolio-retire__legend-item">
          <span className="inv-portfolio-retire__legend-dash" />
          <span>Retirement Goal</span>
        </div>
        <p className="inv-portfolio-retire__legend-desc">{scenario.description}</p>
      </div>
    </section>
  );
}
