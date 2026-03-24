import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { AllocationGroup } from "../data/mockPortfolioDashboard";

type Props = {
  groups: AllocationGroup[];
};

export function AllocationCard({ groups }: Props) {
  const pieData = groups.map((g) => ({
    name: g.label,
    value: g.percentage,
    color: g.color,
  }));

  return (
    <div
      className="h-full rounded-xl border border-border bg-card p-5 shadow-sm dark:border-border/80 dark:shadow-none dark:ring-1 dark:ring-white/5 sm:p-6"
    >
      <h3 className="text-base font-semibold text-foreground">Allocation</h3>
      <p className="mb-5 mt-0.5 text-xs text-muted-foreground">Asset class breakdown</p>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div
          className="relative shrink-0"
          style={{ width: 160, height: 160, minHeight: 160, minWidth: 160 }}
        >
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
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-semibold text-foreground">{groups.length}</span>
            <span className="text-[10px] text-muted-foreground">classes</span>
          </div>
        </div>

        <div className="w-full flex-1 space-y-4">
          {groups.map((group) => (
            <div key={group.id}>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <span className="text-sm font-medium text-foreground">{group.label}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{group.percentage}%</span>
              </div>
              <div className="mb-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted dark:bg-muted/50">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${group.percentage}%`, backgroundColor: group.color }}
                />
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                {group.holdings.map((item) => (
                  <span key={item} className="text-[11px] text-muted-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
