import { Button } from "./ui/button";
import { AlertCircle, ArrowRight, FileWarning } from "lucide-react";
import { motion } from "motion/react";

interface AttentionRequiredCompactProps {
  transactionType: string;
  amount: string;
  message: string;
  onResolve: () => void;
}

export function AttentionRequiredCompact({
  transactionType,
  amount,
  message,
  onResolve,
}: AttentionRequiredCompactProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-amber-200/70"
      style={{
        background:
          "linear-gradient(145deg, #fffbeb 0%, #fef3c7 40%, #fff7ed 100%)",
        boxShadow:
          "0 4px 24px rgba(245,158,11,0.08), 0 1px 3px rgba(245,158,11,0.06)",
      }}
    >
      {/* Decorative glow circles */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-200/15 rounded-full blur-2xl" />
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-orange-200/10 rounded-full blur-2xl" />

      <div className="relative p-5">
        <div className="flex items-start gap-3 mb-4">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="p-2.5 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200/60 flex-shrink-0"
            style={{ boxShadow: "0 2px 10px rgba(245,158,11,0.12)" }}
          >
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
              {transactionType}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-600">Amount: {amount}</span>
              <span className="px-2 py-0.5 bg-amber-200/60 text-amber-800 text-[10px] font-semibold rounded-full border border-amber-300/40">
                Action Required
              </span>
            </div>
          </div>
        </div>

        {/* Issue description */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-white/50 border border-amber-100/60 mb-4">
          <FileWarning className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-700 leading-relaxed">{message}</p>
        </div>

        <Button
          onClick={onResolve}
          size="sm"
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 rounded-xl h-10 transition-all duration-200 group cursor-pointer"
          style={{ boxShadow: "0 2px 10px rgba(245,158,11,0.25)" }}
        >
          Resolve Issue
          <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
