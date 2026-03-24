import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons } from "@/components/transactions/FigmaFlowUI";
import { useVersionedTxNavigate } from "../lib/nav";

const OPTIONS = [
  { id: "match", label: "Match current plan election", desc: "Invest incoming dollars like your deferral election." },
  { id: "target", label: "100% to target date fund", desc: "Single-fund allocation until you rebalance later." },
  { id: "custom", label: "Custom split", desc: "Specify percentages across core funds (advanced)." },
];

export default function RolloverAllocationPage() {
  const go = useVersionedTxNavigate();
  const [selected, setSelected] = useState("match");

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Investment Allocation"
        description="Choose how to invest the incoming rollover funds."
      />

      <FlowCard delay={0.05}>
        <FlowCardTitle>Allocation Method</FlowCardTitle>
        <div className="space-y-3">
          {OPTIONS.map((opt, i) => {
            const isSelected = selected === opt.id;
            return (
              <motion.button
                key={opt.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.04 }}
                onClick={() => setSelected(opt.id)}
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
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 4 }}>{opt.label}</p>
                <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)" }}>{opt.desc}</p>
              </motion.button>
            );
          })}
        </div>
      </FlowCard>

      <FlowNavButtons
        backLabel="Back to Documents"
        nextLabel="Continue to Review"
        onBack={() => go("rollover/documents")}
        onNext={() => go("rollover/review")}
        disabled={!selected}
      />
    </div>
  );
}
