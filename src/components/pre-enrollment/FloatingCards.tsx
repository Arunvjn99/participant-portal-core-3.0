import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";

const data = [
  { year: "2024", amount: 0 },
  { year: "2030", amount: 45000 },
  { year: "2040", amount: 180000 },
  { year: "2050", amount: 480000 },
  { year: "2060", amount: 890000 },
  { year: "2065", amount: 1240000 },
];

const floatTransition = {
  duration: 6,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export const FloatingCards = () => {
  const { t } = useTranslation();
  const [contribution, setContribution] = useState(6);

  return (
    <div className="relative w-full h-full min-h-[320px] md:min-h-[480px] select-none pointer-events-auto">
      {/* Main projection card – front layer, subtle float */}
      <motion.div
        className="absolute top-4 right-2 md:top-10 md:right-4 xl:right-10 w-[16rem] md:w-[20rem] xl:w-96 h-56 md:h-72 xl:h-80 glass-card rounded-2xl md:rounded-3xl p-4 md:p-5 xl:p-6 z-20 transition-shadow duration-300 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(51,65,85,0.5)] hover:shadow-[0_24px_48px_-12px_rgba(139,92,246,0.18)] dark:hover:shadow-[0_24px_48px_-12px_rgba(139,92,246,0.25)]"
        animate={{ y: [0, -6, 0] }}
        transition={{ ...floatTransition, delay: 0 }}
        whileHover={{ scale: 1.02, transition: { duration: 0.25 } }}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="min-w-0">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t("dashboard.heroFloatingProjectedAt65")}</p>
            <h3 className="text-xl md:text-2xl xl:text-4xl font-display font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              $1,240,000
            </h3>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 px-2.5 md:px-3 py-1 rounded-full text-xs font-semibold flex items-center shrink-0">
            <ArrowUpRight size={14} className="mr-1" />
            {t("dashboard.heroFloatingOnTrack")}
          </div>
        </div>

        <div className="h-28 md:h-40 xl:h-48 w-full -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                itemStyle={{ color: "#6d28d9", fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#8b5cf6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Insight chip – middle layer, delayed float */}
      <motion.div
        className="absolute top-0 right-4 md:right-16 xl:right-28 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-2.5 md:px-3 xl:px-4 py-2 md:py-2.5 xl:py-3 rounded-xl md:rounded-2xl border border-white/60 dark:border-slate-600/80 z-30 flex items-center gap-2 xl:gap-3 shadow-lg dark:shadow-black/30 max-w-[200px] md:max-w-[260px]"
        animate={{ y: [0, -8, 0] }}
        transition={{ ...floatTransition, delay: 1.5 }}
        whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      >
        <div className="bg-amber-100 dark:bg-amber-900/50 p-1.5 md:p-2 rounded-full text-amber-600 dark:text-amber-300 shrink-0">
          <Sparkles size={14} className="shrink-0" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] md:text-xs font-semibold text-slate-800 dark:text-slate-100">{t("dashboard.heroFloatingSmartRec")}</p>
          <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400">{t("dashboard.heroFloatingRothSuggestion")}</p>
        </div>
      </motion.div>

      {/* Contribution card – back layer, more float delay */}
      <motion.div
        className="absolute bottom-4 left-2 md:bottom-10 md:left-2 xl:bottom-20 xl:left-10 w-52 md:w-64 xl:w-80 glass-card rounded-xl md:rounded-2xl p-3 md:p-4 xl:p-6 z-10 border border-white/80 dark:border-slate-600/80 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.35)]"
        animate={{ y: [0, -5, 0] }}
        transition={{ ...floatTransition, delay: 3 }}
        whileHover={{ scale: 1.02, transition: { duration: 0.25 } }}
      >
        <div className="flex justify-between items-center mb-2 md:mb-4">
          <span className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400">{t("dashboard.heroFloatingYourContribution")}</span>
          <span className="text-xl md:text-2xl font-bold text-brand-600 dark:text-brand-400">{contribution}%</span>
        </div>

        <input
          type="range"
          min="1"
          max="15"
          value={contribution}
          onChange={(e) => setContribution(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-brand-600 mb-2 md:mb-4"
        />

        <div className="flex items-center gap-2 text-[11px] md:text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck size={12} className="md:w-3.5 md:h-3.5 text-emerald-500 shrink-0" />
          <span>{t("dashboard.heroFloatingEmployerMatchMax")}</span>
        </div>
      </motion.div>

      {/* Background blur orbs – depth, very subtle */}
      <div
        className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-brand-300/20 dark:bg-brand-500/10 blur-3xl pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-10 right-1/4 w-40 h-40 rounded-full bg-indigo-300/15 dark:bg-indigo-500/10 blur-3xl pointer-events-none"
        aria-hidden
      />
    </div>
  );
};
