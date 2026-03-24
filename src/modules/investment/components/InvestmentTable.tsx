import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HoldingRow } from "../data/mockPortfolioDashboard";

type Props = {
  holdings: HoldingRow[];
};

export function InvestmentTable({ holdings }: Props) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm",
        "dark:border-border/80 dark:shadow-none dark:ring-1 dark:ring-white/5",
      )}
    >
      <div className="border-b border-border px-5 py-4 dark:border-border/80">
        <h3 className="text-base font-semibold text-foreground">Investments</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Holdings, weights, and YTD performance (illustrative)
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground dark:border-border/80 dark:bg-muted/15">
              <th className="px-5 py-3 font-medium">Fund</th>
              <th className="px-3 py-3 font-medium">Ticker</th>
              <th className="px-3 py-3 text-right font-medium">Allocation</th>
              <th className="px-5 py-3 text-right font-medium">YTD</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/80 last:border-0 hover:bg-muted/20 dark:hover:bg-muted/10"
              >
                <td className="px-5 py-3.5 font-medium text-foreground">{row.fundName}</td>
                <td className="px-3 py-3.5 text-muted-foreground">{row.ticker ?? "—"}</td>
                <td className="px-3 py-3.5 text-right tabular-nums text-foreground">
                  {row.allocationPercent}%
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span
                    className={cn(
                      "inline-flex items-center justify-end gap-0.5 tabular-nums font-medium",
                      row.performanceYtd >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400",
                    )}
                  >
                    {row.performanceYtd >= 0 ? (
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    )}
                    {row.performanceYtd >= 0 ? "+" : ""}
                    {row.performanceYtd.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
