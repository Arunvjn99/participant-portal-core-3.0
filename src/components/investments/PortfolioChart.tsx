import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";
import type { PerformanceTimeRange } from "@/modules/investment/data/mockPortfolioDashboard";
import type { PortfolioChartRow } from "@/lib/portfolioChartSeries";

type PortfolioChartProps = {
  range: PerformanceTimeRange;
  data: PortfolioChartRow[];
};

function formatCompactUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

function formatFullUsd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

/**
 * Dual-series performance chart: portfolio (solid) vs S&P 500 benchmark (dashed), Recharts + tooltips.
 */
export function PortfolioChart({ range, data }: PortfolioChartProps) {
  const { currentColors } = useTheme();
  const gridStroke = currentColors.border;
  const tickFill = currentColors.textSecondary;
  const benchStroke = currentColors.textSecondary;

  return (
    <div className="inv-portfolio-chart">
      <ResponsiveContainer width="100%" height={260} minHeight={240}>
        <LineChart data={data} margin={{ top: 16, right: 12, left: 4, bottom: 8 }}>
          <CartesianGrid stroke={gridStroke} strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: tickFill, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: tickFill, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCompactUsd(Number(v))}
            domain={["auto", "auto"]}
          />
          <Tooltip
            cursor={{ stroke: gridStroke }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="inv-portfolio-chart__tooltip">
                  <p className="inv-portfolio-chart__tooltip-title">{label}</p>
                  <ul className="inv-portfolio-chart__tooltip-list">
                    {payload.map((item) => (
                      <li key={String(item.dataKey)} className="inv-portfolio-chart__tooltip-row">
                        <span className="inv-portfolio-chart__tooltip-name">{item.name}</span>
                        <span className="inv-portfolio-chart__tooltip-value">{formatFullUsd(Number(item.value))}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="inv-portfolio-chart__tooltip-range">Range: {range}</p>
                </div>
              );
            }}
          />
          <Line
            type="natural"
            dataKey="portfolio"
            name="Your Portfolio"
            stroke={currentColors.primary}
            strokeWidth={2.5}
            dot={false}
            isAnimationActive
            activeDot={{
              r: 5,
              strokeWidth: 2,
              fill: currentColors.surface,
              stroke: currentColors.primary,
            }}
          />
          <Line
            type="natural"
            dataKey="benchmark"
            name="S&P 500"
            stroke={benchStroke}
            strokeWidth={2}
            strokeDasharray="6 5"
            dot={false}
            isAnimationActive
            activeDot={{
              r: 4,
              strokeWidth: 2,
              fill: currentColors.surface,
              stroke: benchStroke,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="inv-portfolio-chart__legend" aria-hidden>
        <span className="inv-portfolio-chart__legend-item">
          <span className="inv-portfolio-chart__legend-swatch inv-portfolio-chart__legend-swatch--solid" />
          Your Portfolio
        </span>
        <span className="inv-portfolio-chart__legend-item">
          <span className="inv-portfolio-chart__legend-swatch inv-portfolio-chart__legend-swatch--dash" />
          S&amp;P 500
        </span>
      </div>
    </div>
  );
}
