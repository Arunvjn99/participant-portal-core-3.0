import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function TransactionCenterQuickActionButton({
  icon,
  title,
  contextInfo,
  additionalInfo,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  contextInfo: string;
  additionalInfo?: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(37,99,235,0.18)" }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      className="relative overflow-hidden cursor-pointer group"
      style={{
        background: "var(--card-bg)",
        borderRadius: 14,
        border: "1px solid var(--border)",
        padding: "16px 20px",
      }}
    >
      <div className="relative flex items-start gap-3.5">
        <div
          className="flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 14%, var(--background)), color-mix(in srgb, var(--color-primary) 10%, var(--muted)))",
            color: "var(--color-primary)",
          }}
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--foreground)",
                letterSpacing: "-0.3px",
                lineHeight: "20px",
              }}
            >
              {title}
            </h3>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-primary)", marginTop: 2 }}>{contextInfo}</p>
          {additionalInfo ? (
            <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontWeight: 500, marginTop: 2 }}>{additionalInfo}</p>
          ) : null}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
        style={{ height: 2, background: "var(--color-primary)", borderRadius: 1 }}
      />
    </motion.div>
  );
}
