import { useTranslation } from "react-i18next";
import { Coins, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import DashboardSection from "../dashboard/DashboardSection";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

const GROWTH_CHART_DATA = [
  { year: "2024", value: 0 },
  { year: "2030", value: 45 },
  { year: "2040", value: 180 },
  { year: "2050", value: 480 },
  { year: "2060", value: 890 },
];

export function InsightCards() {
  const { t } = useTranslation();
  const matchPercent = 6;
  const currentPercent = 3; // example: user at 3%, match goes to 6%

  return (
    <DashboardSection title={t("dashboard.insightCardsTitle", "Key benefits")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employer Match – Free Money: progress bar 0–6%, $2500 example */}
        <Card className="h-full p-5 rounded-xl transition-shadow duration-300 hover:shadow-md">
          <CardHeader className="p-0 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-[var(--color-success)]/10">
                <Coins className="h-5 w-5 text-[var(--color-success)]" />
              </div>
              <span className="text-sm font-semibold text-[var(--color-success)] uppercase tracking-wide">
                {t("dashboard.employerMatchLabel", "Free Money")}
              </span>
            </div>
            <CardTitle className="text-lg font-semibold">
              {t("dashboard.employerMatchCardTitle", "Don't miss your employer match")}
            </CardTitle>
            <CardDescription className="text-base">
              {t("dashboard.employerMatchDescription", "Your employer matches 50% of contributions up to 6%.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-[var(--color-textSecondary)] mb-1">
                  <span>0%</span>
                  <span>{matchPercent}% match</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--color-background-secondary)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--color-success)] transition-all duration-500"
                    style={{ width: `${Math.min(currentPercent / matchPercent * 100, 100)}%` }}
                  />
                </div>
              </div>
              <p className="text-2xl font-bold text-[var(--color-text)]">+$2,500</p>
              <p className="text-sm text-[var(--color-textSecondary)]">
                {t("dashboard.employerMatchPotential", "Potential free money added to your account every year.")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Compound Growth – small bar chart */}
        <Card className="h-full p-5 rounded-xl transition-shadow duration-300 hover:shadow-md">
          <CardHeader className="p-0 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-[var(--color-primary)]/10">
                <TrendingUp className="h-5 w-5 text-[var(--color-primary)]" />
              </div>
              <span className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wide">
                {t("dashboard.growthImpactLabel", "Compound Growth")}
              </span>
            </div>
            <CardTitle className="text-lg font-semibold">
              {t("dashboard.growthImpactCardTitle", "Annual savings impact")}
            </CardTitle>
            <CardDescription className="text-base">
              {t("dashboard.growthImpactDescription", "See how small contributions plus the match grow over time.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={GROWTH_CHART_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--color-textSecondary)" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--color-textSecondary)" }} tickFormatter={(v) => `$${v}k`} width={28} />
                  <Bar dataKey="value" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardSection>
  );
}
