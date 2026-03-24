import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, CalendarClock, CheckCircle2, Info } from "lucide-react";
import { FlowPageHeader, FlowNavButtons } from "@/components/transactions/FigmaFlowUI";
import { useVersionedTxNavigate } from "../lib/nav";

const TRANSFER_TYPES = [
  {
    id: "existing",
    icon: <ArrowLeftRight className="w-6 h-6" />,
    title: "Transfer Existing Balance",
    description: "Move money between your current investment funds. Trades execute at market close.",
    details: ["Reallocate existing investments", "No fees or penalties", "Executed at next market close"],
  },
  {
    id: "future",
    icon: <CalendarClock className="w-6 h-6" />,
    title: "Transfer Future Contributions",
    description: "Change how your future paycheck contributions are invested across funds.",
    details: ["Applies to all future contributions", "Takes effect next pay period", "Doesn't affect existing balance"],
  },
];

export default function TransferTypePage() {
  const go = useVersionedTxNavigate();
  const [transferType, setTransferType] = useState("");

  return (
    <div className="space-y-6 w-full">
      <FlowPageHeader
        title="Select Transfer Type"
        description="Choose whether to transfer existing investments or redirect future contributions."
      />

      <div className="space-y-4">
        {TRANSFER_TYPES.map((type, idx) => {
          const isSelected = transferType === type.id;
          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + idx * 0.06, duration: 0.3 }}
            >
              <button
                type="button"
                onClick={() => setTransferType(type.id)}
                className="relative w-full text-left transition-all duration-200 cursor-pointer"
                style={{
                  padding: "24px 28px",
                  borderRadius: 16,
                  border: isSelected ? "1.5px solid var(--color-primary)" : "1.5px solid var(--border)",
                  background: isSelected ? "color-mix(in srgb, var(--color-primary) 14%, var(--background))" : "var(--card-bg)",
                }}
              >
                {isSelected && (
                  <CheckCircle2
                    className="absolute top-5 right-5"
                    style={{ width: 20, height: 20, color: "var(--color-primary)" }}
                  />
                )}
                <div className="flex items-start gap-4">
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: isSelected
                        ? "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 12%, var(--muted)), color-mix(in srgb, var(--color-primary) 22%, var(--muted)))"
                        : "var(--color-background-secondary)",
                      color: isSelected ? "var(--color-primary)" : "var(--color-text-secondary)",
                    }}
                  >
                    {type.icon}
                  </div>
                  <div className="flex-1">
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.3px", marginBottom: 4 }}>
                      {type.title}
                    </h3>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 12, lineHeight: "20px" }}>
                      {type.description}
                    </p>
                    <div className="space-y-1.5">
                      {type.details.map((detail) => (
                        <div key={detail} className="flex items-center gap-2">
                          <span
                            className="rounded-full flex-shrink-0"
                            style={{ width: 6, height: 6, background: isSelected ? "var(--color-primary)" : "var(--color-text-tertiary)" }}
                          />
                          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)" }}>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <div
          className="flex items-start gap-3"
          style={{
            background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 14%, var(--background)) 0%, color-mix(in srgb, var(--color-primary) 10%, var(--muted)) 100%)",
            border: "1px solid color-mix(in srgb, var(--color-primary) 35%, var(--border))",
            borderRadius: 14,
            padding: "14px 16px",
          }}
        >
          <Info className="flex-shrink-0 mt-0.5" style={{ width: 16, height: 16, color: "var(--color-primary)" }} />
          <p className="leading-relaxed" style={{ fontSize: 12, fontWeight: 500, color: "var(--color-primary)" }}>
            Transfers within your 401(k) plan are tax-free and have no impact on your contribution limits. If you want
            to change both existing balance and future contributions, you&apos;ll need to initiate two separate
            transfers.
          </p>
        </div>
      </motion.div>

      <FlowNavButtons
        backLabel="Cancel"
        nextLabel="Continue"
        onBack={() => go("transactions")}
        onNext={() => go("transfer/source")}
        disabled={!transferType}
      />
    </div>
  );
}
