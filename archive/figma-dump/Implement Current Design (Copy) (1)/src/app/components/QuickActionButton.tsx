import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

interface QuickActionButtonProps {
  icon: React.ReactNode;
  title: string;
  contextInfo: string;
  additionalInfo?: string;
  onClick: () => void;
}

export function QuickActionButton({
  icon,
  title,
  contextInfo,
  additionalInfo,
  onClick,
}: QuickActionButtonProps) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(37,99,235,0.18)" }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      className="relative overflow-hidden cursor-pointer group"
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #F1F5F9",
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
            background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
            color: "#2563EB",
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
                color: "#1E293B",
                letterSpacing: "-0.3px",
                lineHeight: "20px",
              }}
            >
              {title}
            </h3>
            <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#2563EB",
              marginTop: 2,
            }}
          >
            {contextInfo}
          </p>
          {additionalInfo && (
            <p
              style={{
                fontSize: 11,
                color: "#94A3B8",
                fontWeight: 500,
                marginTop: 2,
              }}
            >
              {additionalInfo}
            </p>
          )}
        </div>
      </div>

      {/* Bottom accent line on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
        style={{
          height: 2,
          background: "#2563EB",
          borderRadius: 1,
        }}
      />
    </motion.div>
  );
}
