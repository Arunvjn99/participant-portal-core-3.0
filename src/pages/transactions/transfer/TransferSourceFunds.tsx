import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons } from "@/components/transactions/FigmaFlowUI";
import { useVersionedTxNavigate } from "../lib/nav";

const SOURCES = [
  { id: "stable", label: "Stable Value Fund", balance: 12400, color: "var(--color-success)" },
  { id: "target", label: "Target Date 2045", balance: 48200, color: "var(--color-primary)" },
  { id: "equity", label: "Large Cap Index", balance: 9100, color: "var(--color-primary)" },
];

export default function TransferSourceFundsPage() {
  const go = useVersionedTxNavigate();
  const [selected, setSelected] = useState("");

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Source Fund"
        description="Select the investment fund you are transferring from."
      />

      <FlowCard delay={0.05}>
        <FlowCardTitle>Available Funds</FlowCardTitle>
        <div className="space-y-3">
          {SOURCES.map((src, i) => {
            const isSelected = selected === src.id;
            return (
              <motion.button
                key={src.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.04 }}
                onClick={() => setSelected(src.id)}
                className="relative w-full text-left transition-all duration-200 cursor-pointer"
                style={{
                  padding: "16px 20px",
                  borderRadius: 14,
                  border: isSelected ? "2px solid var(--color-primary)" : "1.5px solid var(--border)",
                  background: isSelected ? "color-mix(in srgb, var(--color-primary) 14%, var(--background))" : "var(--card-bg)",
                }}
              >
                {isSelected && (
                  <CheckCircle2 className="absolute top-4 right-4" style={{ width: 18, height: 18, color: "var(--color-primary)" }} />
                )}
                <div className="flex items-center gap-3">
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: src.color, flexShrink: 0 }} />
                  <div className="flex-1">
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>{src.label}</p>
                    <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginTop: 2 }}>
                      Balance: ${src.balance.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </FlowCard>

      <FlowNavButtons
        backLabel="Back to Type"
        nextLabel="Continue to Amount"
        onBack={() => go("transfer/type")}
        onNext={() => go("transfer/amount")}
        disabled={!selected}
      />
    </div>
  );
}
