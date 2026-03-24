import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type KPIStatTrend = {
  /** e.g. "+1.2%" */
  label: string;
  positive?: boolean;
};

type KPIStatCardProps = {
  label: string;
  value: string;
  subtext?: string;
  trend?: KPIStatTrend;
  /** Figma-style positive row with leading arrow */
  showPositiveLeadingIcon?: boolean;
  /** Match Figma metric colors */
  valueTone?: "default" | "success" | "primary";
  className?: string;
};

/**
 * Compact KPI tile for summary grids (label / value / subtext / optional trend).
 */
export function KPIStatCard({
  label,
  value,
  subtext,
  trend,
  showPositiveLeadingIcon,
  valueTone = "default",
  className,
}: KPIStatCardProps) {
  const valueClass = cn(
    "inv-portfolio-kpi__value",
    valueTone === "success" && "inv-portfolio-kpi__value--success",
    valueTone === "primary" && "inv-portfolio-kpi__value--primary",
  );
  return (
    <div className={cn("inv-portfolio-kpi", className)}>
      <p className="inv-portfolio-kpi__label">{label}</p>
      {showPositiveLeadingIcon ? (
        <div className="inv-portfolio-kpi__value-row">
          <ArrowUpRight className="inv-portfolio-kpi__value-arrow" aria-hidden />
          <p className={valueClass}>{value}</p>
        </div>
      ) : (
        <p className={valueClass}>{value}</p>
      )}
      {subtext ? <p className="inv-portfolio-kpi__sub">{subtext}</p> : null}
      {trend ? (
        <span
          className={cn(
            "inv-portfolio-kpi__trend",
            trend.positive === true && "inv-portfolio-kpi__trend--up",
            trend.positive === false && "inv-portfolio-kpi__trend--down",
          )}
        >
          {trend.label}
        </span>
      ) : null}
    </div>
  );
}
