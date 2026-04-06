import { useId, useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Area, AreaChart, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslation } from "react-i18next";
import type { PerformancePoint } from "@/stores/postEnrollmentDashboardStore";
import { cn } from "@/lib/utils";
import { pePanel } from "./dashboardSurfaces";

type Props = {
  data: PerformancePoint[];
  className?: string;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

function readThemeColors() {
  const root = typeof document !== "undefined" ? document.documentElement : null;
  if (!root) {
    return { primary: "", card: "", muted: "", border: "", foreground: "" };
  }
  const cs = getComputedStyle(root);
  const v = (name: string) => cs.getPropertyValue(name).trim();
  return {
    primary: v("--primary"),
    card: v("--card"),
    muted: v("--muted-foreground"),
    border: v("--border"),
    foreground: v("--foreground"),
  };
}

function hexAlphaSuffix(hex: string, opacity: number): string {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return hex;
  const a = Math.round(Math.min(1, Math.max(0, opacity)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

export function PerformanceChart({ data, className }: Props) {
  const { t } = useTranslation();
  const gid = useId().replace(/:/g, "");
  const gradId = `pe-chart-grad-${gid}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [colors, setColors] = useState(readThemeColors);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDims({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setColors(readThemeColors());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setColors(readThemeColors());
    mq.addEventListener?.("change", onChange);
    const root = document.documentElement;
    const mo = new MutationObserver(() => setColors(readThemeColors()));
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => {
      mq.removeEventListener?.("change", onChange);
      mo.disconnect();
    };
  }, []);

  const domain = useMemo((): [number, number] => {
    if (!data.length) return [0, 100];
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = (max - min) * 0.18 || max * 0.03;
    return [Math.floor(min - pad), Math.ceil(max + pad)];
  }, [data]);

  const primary = colors.primary || "currentColor";
  const cardBg = colors.card;
  const muted = colors.muted;
  const border = colors.border;
  const foreground = colors.foreground;
  const cursorStroke =
    /^#[0-9A-Fa-f]{6}$/.test(primary) ? hexAlphaSuffix(primary, 0.25) : primary;

  return (
    <section className={cn(pePanel, className)}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease, delay: 0.24 }}
        className="mb-5"
      >
        <h2 className="text-base font-semibold text-foreground sm:text-lg">
          {t("dashboard.postEnrollment.performanceGrowth")}
        </h2>
        <p className="mt-1 max-w-lg text-sm leading-relaxed text-muted-foreground">
          {t("dashboard.postEnrollment.peChartSubtitle")}
        </p>
      </motion.div>
      <div
        ref={containerRef}
        className="h-[260px] w-full sm:h-[300px] lg:h-[340px]"
        aria-label={t("dashboard.postEnrollment.performanceGrowth")}
      >
        {dims.w > 0 && dims.h > 0 && (
          <AreaChart
            data={data}
            width={dims.w}
            height={dims.h}
            margin={{ top: 12, right: 12, left: -4, bottom: 4 }}
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={primary} stopOpacity={0.4} />
                <stop offset="50%" stopColor={primary} stopOpacity={0.12} />
                <stop offset="100%" stopColor={primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: muted || "currentColor", fontSize: 11 }}
              dy={8}
            />
            <YAxis
              domain={domain}
              axisLine={false}
              tickLine={false}
              width={52}
              tick={{ fill: muted || "currentColor", fontSize: 11 }}
              tickFormatter={(v: number) =>
                `$${new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                  maximumFractionDigits: 1,
                }).format(v)}`
              }
            />
            <Tooltip
              cursor={{ stroke: cursorStroke, strokeWidth: 1 }}
              contentStyle={{
                borderRadius: "12px",
                border: border ? `1px solid ${border}` : undefined,
                background: cardBg || undefined,
                boxShadow: "var(--shadow-md, 0 4px 16px rgba(0,0,0,.12))",
                padding: "10px 14px",
                fontSize: 12,
                color: foreground || undefined,
              }}
              labelStyle={{
                color: muted || undefined,
                fontSize: 11,
                marginBottom: 4,
              }}
              formatter={(value) => [
                typeof value === "number"
                  ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
                  : "—",
                t("dashboard.postEnrollment.totalBalance"),
              ]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={primary}
              strokeWidth={2.5}
              fill={`url(#${gradId})`}
              dot={false}
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: cardBg || "var(--card)",
                fill: primary,
              }}
            />
          </AreaChart>
        )}
      </div>
    </section>
  );
}
