import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/Slider";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons } from "@/components/transactions/FigmaFlowUI";
import { useVersionedTxNavigate } from "../lib/nav";

const SOURCES = [
  { id: "pretax", label: "Pre-Tax Contributions", sublabel: "Traditional 401(k) deferrals", max: 3500, color: "var(--color-primary)", taxNote: "Subject to ordinary income tax" },
  {
    id: "roth",
    label: "Roth Contributions",
    sublabel: "After-tax Roth 401(k) deferrals",
    max: 1200,
    color: "var(--color-primary)",
    taxNote: "Tax-free if qualified distribution",
  },
  {
    id: "employer",
    label: "Employer Contributions",
    sublabel: "Matching and profit sharing",
    max: 2000,
    color: "var(--color-success)",
    taxNote: "Subject to ordinary income tax",
  },
  {
    id: "aftertax",
    label: "After-Tax Contributions",
    sublabel: "Non-Roth after-tax deferrals",
    max: 800,
    color: "var(--color-warning)",
    taxNote: "Only earnings portion is taxable",
  },
];

export default function WithdrawSourcePage() {
  const go = useVersionedTxNavigate();
  const [amounts, setAmounts] = useState<Record<string, number>>({ pretax: 2000, roth: 500, employer: 0, aftertax: 500 });

  const total = Object.values(amounts).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Funding Sources"
        description="Select the contribution sources and amounts for your withdrawal."
      />

      <FlowCard delay={0.05}>
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <FlowCardTitle>Withdrawal Amount</FlowCardTitle>
          <div style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 14%, var(--background)), color-mix(in srgb, var(--color-primary) 10%, var(--muted)))", borderRadius: 12, padding: "8px 16px" }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.5px" }}>
              ${total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {SOURCES.map((src) => (
            <div key={src.id}>
              <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{src.label}</p>
                  <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)" }}>{src.sublabel}</p>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: 18, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.3px" }}>
                    ${amounts[src.id].toLocaleString()}
                  </p>
                  <p style={{ fontSize: 10, fontWeight: 500, color: src.color }}>{src.taxNote}</p>
                </div>
              </div>
              <Slider
                value={[amounts[src.id]]}
                onValueChange={(v) => setAmounts((prev) => ({ ...prev, [src.id]: v[0] }))}
                min={0}
                max={src.max}
                step={100}
              />
              <div className="flex justify-between" style={{ marginTop: 4 }}>
                <span style={{ fontSize: 9, color: "var(--color-text-tertiary)", fontWeight: 500 }}>$0</span>
                <span style={{ fontSize: 9, color: "var(--color-text-tertiary)", fontWeight: 500 }}>${src.max.toLocaleString()} available</span>
              </div>
            </div>
          ))}
        </div>
      </FlowCard>

      <FlowNavButtons
        backLabel="Back to Type"
        nextLabel="Continue to Fees"
        onBack={() => go("withdraw/type")}
        onNext={() => go("withdraw/fees")}
        disabled={total === 0}
      />
    </div>
  );
}
