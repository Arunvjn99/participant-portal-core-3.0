import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons } from "@/components/transactions/FigmaFlowUI";
import { useVersionedTxNavigate } from "../lib/nav";

const DESTS = [
  { id: "target", label: "Target Date 2045", desc: "Diversified fund aligned to 2045 retirement", color: "var(--color-primary)" },
  { id: "equity", label: "Large Cap Index", desc: "Broad U.S. large-cap equity exposure", color: "var(--color-primary)" },
  { id: "intl", label: "International Equity", desc: "Diversified international stock exposure", color: "var(--color-success)" },
  { id: "bond", label: "Bond Index", desc: "U.S. investment-grade bond exposure", color: "var(--color-warning)" },
];

export default function TransferDestinationPage() {
  const go = useVersionedTxNavigate();
  const [selected, setSelected] = useState("");

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Destination Fund"
        description="Choose where the funds should be invested after the transfer."
      />

      <FlowCard delay={0.05}>
        <FlowCardTitle>Available Funds</FlowCardTitle>
        <div className="space-y-3">
          {DESTS.map((dest, i) => {
            const isSelected = selected === dest.id;
            return (
              <motion.button
                key={dest.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.04 }}
                onClick={() => setSelected(dest.id)}
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
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: dest.color, flexShrink: 0 }} />
                  <div className="flex-1">
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>{dest.label}</p>
                    <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginTop: 2 }}>{dest.desc}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </FlowCard>

      <FlowNavButtons
        backLabel="Back to Amount"
        nextLabel="Preview Impact"
        onBack={() => go("transfer/amount")}
        onNext={() => go("transfer/impact")}
        disabled={!selected}
      />
    </div>
  );
}
