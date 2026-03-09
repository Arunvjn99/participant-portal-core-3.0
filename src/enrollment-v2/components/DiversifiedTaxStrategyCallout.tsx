/**
 * Diversified Tax Strategy callout — Figma: light cyan/teal info box.
 */
import { motion } from "framer-motion";
import { Info } from "lucide-react";

export function DiversifiedTaxStrategyCallout({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className={
        `rounded-[14px] border border-[#a2f4fd] bg-[#ecfeff] dark:bg-cyan-900/20 dark:border-cyan-700 ` +
        `px-3.5 py-3.5 flex items-start gap-2.5 ${className}`
      }
    >
      <div className="w-7 h-7 rounded-lg bg-[#00b8db] flex items-center justify-center flex-shrink-0">
        <Info className="w-3.5 h-3.5 text-white" />
      </div>
      <div>
        <h5 className="font-bold text-[12px] text-[#104e64] dark:text-cyan-200 mb-0.5">
          Diversified Tax Strategy
        </h5>
        <p className="text-[11px] text-[#007595] dark:text-cyan-300/90 leading-relaxed">
          Your contributions are split across different tax treatments to optimize flexibility in
          retirement.
        </p>
      </div>
    </motion.div>
  );
}
