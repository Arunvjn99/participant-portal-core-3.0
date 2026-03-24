import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { AllocationGroup } from "@/modules/investment/data/mockPortfolioDashboard";

type PortfolioAllocationSectionProps = {
  groups: AllocationGroup[];
};

/**
 * Donut + legend matching Figma “Investment Portfolio Page Design” allocation section.
 */
export function PortfolioAllocationSection({ groups }: PortfolioAllocationSectionProps) {
  const pieData = groups.map((d) => ({ name: d.label, value: d.percentage, color: d.color }));

  return (
    <section className="inv-portfolio-alloc inv-portfolio-card" aria-labelledby="inv-portfolio-alloc-title">
      <h2 id="inv-portfolio-alloc-title" className="inv-portfolio-alloc__title">
        Portfolio Allocation
      </h2>
      <p className="inv-portfolio-alloc__subtitle">Asset class breakdown by category</p>

      <div className="inv-portfolio-alloc__body">
        <div className="inv-portfolio-alloc__chart-wrap">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="inv-portfolio-alloc__chart-center" aria-hidden>
            <span className="inv-portfolio-alloc__chart-center-num">{groups.length}</span>
            <span className="inv-portfolio-alloc__chart-center-label">classes</span>
          </div>
        </div>

        <div className="inv-portfolio-alloc__legend">
          {groups.map((group) => (
            <div key={group.id} className="inv-portfolio-alloc__group">
              <div className="inv-portfolio-alloc__group-head">
                <div className="inv-portfolio-alloc__group-name">
                  <span className="inv-portfolio-alloc__dot" style={{ backgroundColor: group.color }} />
                  <span>{group.label}</span>
                </div>
                <span className="inv-portfolio-alloc__pct">{group.percentage}%</span>
              </div>
              <div className="inv-portfolio-alloc__bar-track">
                <div
                  className="inv-portfolio-alloc__bar-fill"
                  style={{ width: `${group.percentage}%`, backgroundColor: group.color }}
                />
              </div>
              <div className="inv-portfolio-alloc__holdings">
                {group.holdings.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
