
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  Info,
  Landmark,
  PieChart,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { getRoutingVersion, withVersion } from "@/core/version";
import { cn } from "@/lib/utils";
import { TransactionFlowShell } from "../TransactionFlowShell";
import { useCrpTransactionStore } from "../crpTransactionStore";
import { MOCK_PLAN, type RolloverData } from "../types";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ease = [0.4, 0, 0.2, 1] as const;

const ROLLOVER_TYPES = [
  {
    value: "traditional" as const,
    label: "Traditional 401k",
    icon: Building2,
    desc: "Pre-tax employer-sponsored retirement funds",
  },
  {
    value: "roth" as const,
    label: "Roth 401k",
    icon: ShieldCheck,
    desc: "After-tax contributions with tax-free growth",
  },
  {
    value: "ira" as const,
    label: "Traditional IRA",
    icon: Landmark,
    desc: "Individual retirement account with tax-deferred growth",
  },
];

const ALLOCATION_OPTIONS = [
  {
    value: "match" as const,
    label: "Match current plan election",
    desc: "Invest incoming dollars like your deferral election",
    icon: PieChart,
  },
  {
    value: "target" as const,
    label: "100% to target date fund",
    desc: "Single-fund allocation until you rebalance later",
    icon: Landmark,
  },
  {
    value: "custom" as const,
    label: "Custom split",
    desc: "Specify percentages across core funds (advanced)",
    icon: Building2,
  },
];

type DocEntry = {
  id: string;
  name: string;
  description: string;
  required: boolean;
  file: File | null;
};

const INITIAL_DOCS: DocEntry[] = [
  {
    id: "spousal-consent",
    name: "Spousal Consent Form",
    description:
      "Required when balance exceeds $5,000 and participant is married",
    required: true,
    file: null,
  },
  {
    id: "prior-statement",
    name: "Prior Plan Statement",
    description: "Most recent quarterly or annual statement from prior plan",
    required: true,
    file: null,
  },
  {
    id: "distribution-check",
    name: "Distribution Check",
    description: "Copy of check or wire confirmation from prior plan",
    required: false,
    file: null,
  },
];

type ValidationCheck = {
  label: string;
  detail: string;
  ok: boolean;
  severity: "success" | "warning";
};

const VALIDATION_CHECKS: ValidationCheck[] = [
  {
    label: "Account verified",
    detail: "Recordkeeper matched employer and last four of account",
    ok: true,
    severity: "success",
  },
  {
    label: "Rollover eligible",
    detail: "Prior plan allows outgoing rollover to qualified plan",
    ok: true,
    severity: "success",
  },
  {
    label: "Spousal consent",
    detail:
      "Required if balance over $5,000 and married — upload on documents step",
    ok: false,
    severity: "warning",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════ */

export function RolloverFlowClient() {
  const { activeStep, activeType, flowData, updateFlowData, startFlow } =
    useCrpTransactionStore();

  useEffect(() => {
    if (activeType !== "rollover") startFlow("rollover");
  }, [activeType, startFlow]);

  const rd = flowData.rollover;

  const step0Valid =
    !!rd.previousEmployer &&
    !!rd.planAdministrator &&
    !!rd.accountNumber &&
    !!rd.estimatedAmount &&
    rd.estimatedAmount > 0 &&
    !!rd.rolloverType;

  switch (activeStep) {
    case 0:
      return (
        <TransactionFlowShell type="rollover" canContinue={step0Valid}>
          <StepPlanDetails
            data={rd}
            onChange={(d) => updateFlowData("rollover", d)}
          />
        </TransactionFlowShell>
      );
    case 1:
      return (
        <TransactionFlowShell type="rollover" canContinue>
          <StepValidation data={rd} />
        </TransactionFlowShell>
      );
    case 2:
      return <StepDocuments />;
    case 3:
      return <StepAllocation data={rd} />;
    case 4:
      return <StepReview data={rd} />;
    case 5:
      return <StepConfirmation data={rd} />;
    default:
      return null;
  }
}

/* ─── Step 0 — Plan Details ─── */

function StepPlanDetails({
  data,
  onChange,
}: {
  data: Partial<RolloverData>;
  onChange: (d: Partial<RolloverData>) => void;
}) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease }}
      >
        <h3 className="text-lg font-semibold text-foreground">Plan Details</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Select your rollover type and enter the details of the plan
          you&rsquo;d like to roll over.
        </p>
      </motion.div>

      {/* Rollover type selector */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35, ease }}
      >
        <p className="mb-3 text-sm font-medium text-foreground">
          Rollover Type
        </p>
        <div className="grid grid-cols-3 gap-3">
          {ROLLOVER_TYPES.map((t) => {
            const selected = data.rolloverType === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => onChange({ rolloverType: t.value })}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all",
                  selected
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10 dark:bg-primary/10"
                    : "border-border bg-white hover:border-slate-300 hover:shadow-sm dark:bg-slate-900/40 dark:hover:border-slate-600",
                )}
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl transition",
                    selected
                      ? "bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                  )}
                >
                  <t.icon className="size-5" />
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    selected
                      ? "text-primary dark:text-primary"
                      : "text-foreground",
                  )}
                >
                  {t.label}
                </span>
                <span className="text-xs text-muted-foreground">{t.desc}</span>
                {selected && (
                  <motion.div
                    layoutId="rollover-type-check"
                    className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-white"
                  >
                    <CheckCircle2 className="size-3.5" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Plan information form */}
      <motion.div
        className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-slate-900/40"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35, ease }}
      >
        <p className="mb-4 text-sm font-medium text-foreground">
          Plan Information
        </p>
        <div className="space-y-4">
          <Field
            label="Previous Employer Name"
            value={data.previousEmployer ?? ""}
            onChange={(v) => onChange({ previousEmployer: v })}
            placeholder="e.g. Acme Corp"
          />
          <Field
            label="Plan Administrator"
            value={data.planAdministrator ?? ""}
            onChange={(v) => onChange({ planAdministrator: v })}
            placeholder="e.g. Fidelity, Vanguard"
          />
          <Field
            label="Account Number"
            value={data.accountNumber ?? ""}
            onChange={(v) => onChange({ accountNumber: v })}
            placeholder="Enter your account number"
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Estimated Rollover Amount
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                $
              </span>
              <input
                type="number"
                min={0}
                value={data.estimatedAmount ?? ""}
                onChange={(e) =>
                  onChange({
                    estimatedAmount: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                placeholder="0"
                className="h-11 w-full rounded-xl border border-border bg-background pl-7 pr-3 text-sm tabular-nums text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Info banner */}
      <motion.div
        className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4 dark:border-sky-900/40 dark:bg-sky-950/20"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35, ease }}
      >
        <div className="mb-2 flex items-center gap-2">
          <Info className="size-4 shrink-0 text-sky-600 dark:text-sky-400" />
          <p className="text-sm font-medium text-sky-800 dark:text-sky-300">
            What you&rsquo;ll need
          </p>
        </div>
        <ul className="space-y-1.5 pl-6">
          {[
            "Most recent statement from your previous plan",
            "Contact information for your prior plan administrator",
            "Distribution check or electronic transfer form",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-sky-700 dark:text-sky-300"
            >
              <FileText className="mt-0.5 size-3.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

/* ─── Step 1 — Validation ─── */

function StepValidation({ data }: { data: Partial<RolloverData> }) {
  const hasWarnings = VALIDATION_CHECKS.some((c) => !c.ok);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease }}
      >
        <h3 className="text-lg font-semibold text-foreground">
          Validation Results
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          We&rsquo;ve verified your rollover eligibility against{" "}
          {data.previousEmployer || "your prior plan"}.
        </p>
      </motion.div>

      <motion.div
        className="divide-y divide-border rounded-2xl border border-border bg-white shadow-sm dark:bg-slate-900/40"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35, ease }}
      >
        {VALIDATION_CHECKS.map((check, i) => (
          <motion.div
            key={check.label}
            className="flex items-start gap-3 px-5 py-4"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.3, ease }}
          >
            <div
              className={cn(
                "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
                check.ok
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                  : "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
              )}
            >
              {check.ok ? (
                <CheckCircle2 className="size-3.5" />
              ) : (
                <AlertTriangle className="size-3.5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-semibold",
                  check.ok
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-amber-700 dark:text-amber-300",
                )}
              >
                {check.label}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {check.detail}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {hasWarnings && (
        <motion.div
          className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-950/20"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35, ease }}
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Some items require your attention. You can still proceed.
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Step 2 — Documents ─── */

function StepDocuments() {
  const updateFlowData = useCrpTransactionStore((s) => s.updateFlowData);
  const [docs, setDocs] = useState<DocEntry[]>(INITIAL_DOCS);

  const allRequiredUploaded = docs
    .filter((d) => d.required)
    .every((d) => d.file !== null);

  useEffect(() => {
    if (allRequiredUploaded) {
      updateFlowData("rollover", { documentsComplete: true });
    }
  }, [allRequiredUploaded, updateFlowData]);

  const handleUpload = (id: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.jpeg,.png";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setDocs((prev) =>
          prev.map((d) => (d.id === id ? { ...d, file } : d)),
        );
      }
    };
    input.click();
  };

  const handleRemove = (id: string) => {
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, file: null } : d)));
  };

  return (
    <TransactionFlowShell type="rollover" canContinue={allRequiredUploaded}>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease }}
        >
          <h3 className="text-lg font-semibold text-foreground">Documents</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload the required documents to continue your rollover request.
          </p>
        </motion.div>

        <div className="space-y-3">
          {docs.map((doc, i) => (
            <motion.div
              key={doc.id}
              className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-slate-900/40"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06, duration: 0.35, ease }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground">
                      {doc.name}
                    </p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        doc.required
                          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                      )}
                    >
                      {doc.required ? "Required" : "Optional"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {doc.description}
                  </p>
                </div>

                {!doc.file ? (
                  <button
                    type="button"
                    onClick={() => handleUpload(doc.id)}
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition hover:bg-muted"
                  >
                    <Upload className="size-3.5" />
                    Upload
                  </button>
                ) : (
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 dark:bg-emerald-900/30">
                      <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="max-w-[120px] truncate text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        {doc.file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(doc.id)}
                      className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </TransactionFlowShell>
  );
}

/* ─── Step 3 — Allocation ─── */

function StepAllocation({ data }: { data: Partial<RolloverData> }) {
  const updateFlowData = useCrpTransactionStore((s) => s.updateFlowData);

  return (
    <TransactionFlowShell
      type="rollover"
      canContinue={!!data.allocationMethod}
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease }}
        >
          <h3 className="text-lg font-semibold text-foreground">
            Allocation Method
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose how the incoming rollover funds should be invested.
          </p>
        </motion.div>

        <div className="space-y-3">
          {ALLOCATION_OPTIONS.map((opt, i) => {
            const selected = data.allocationMethod === opt.value;
            return (
              <motion.button
                key={opt.value}
                type="button"
                onClick={() =>
                  updateFlowData("rollover", { allocationMethod: opt.value })
                }
                className={cn(
                  "relative flex w-full items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all",
                  selected
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10 dark:bg-primary/10"
                    : "border-border bg-white hover:border-slate-300 hover:shadow-sm dark:bg-slate-900/40 dark:hover:border-slate-600",
                )}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.06, duration: 0.35, ease }}
              >
                <div
                  className={cn(
                    "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl transition",
                    selected
                      ? "bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                  )}
                >
                  <opt.icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      selected
                        ? "text-primary dark:text-primary"
                        : "text-foreground",
                    )}
                  >
                    {opt.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {opt.desc}
                  </p>
                </div>
                {selected && (
                  <motion.div
                    layoutId="allocation-check"
                    className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-primary text-white"
                  >
                    <CheckCircle2 className="size-4" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </TransactionFlowShell>
  );
}

/* ─── Step 4 — Review ─── */

function StepReview({ data }: { data: Partial<RolloverData> }) {
  const [termsAccepted, setTermsAccepted] = useState(false);

  const allocationLabel =
    ALLOCATION_OPTIONS.find((o) => o.value === data.allocationMethod)?.label ??
    "—";

  const rolloverTypeLabel =
    ROLLOVER_TYPES.find((t) => t.value === data.rolloverType)?.label ?? "—";

  const rows: { label: string; value: string }[] = [
    { label: "Rollover Type", value: rolloverTypeLabel },
    { label: "Previous Employer", value: data.previousEmployer || "—" },
    { label: "Administrator", value: data.planAdministrator || "—" },
    {
      label: "Estimated Amount",
      value: data.estimatedAmount ? fmt.format(data.estimatedAmount) : "—",
    },
    { label: "Allocation Method", value: allocationLabel },
    { label: "Processing Time", value: "5–10 business days" },
  ];

  return (
    <TransactionFlowShell type="rollover" canContinue={termsAccepted}>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease }}
        >
          <h3 className="text-lg font-semibold text-foreground">
            Rollover Summary
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Confirm the details below before submitting your rollover request.
          </p>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-border bg-white shadow-sm dark:bg-slate-900/40"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.35, ease }}
        >
          <div className="grid grid-cols-2 divide-x divide-border">
            {rows.map((r, i) => (
              <div
                key={r.label}
                className={cn(
                  "px-5 py-3.5",
                  i >= 2 && "border-t border-border",
                )}
              >
                <p className="text-xs text-muted-foreground">{r.label}</p>
                <p className="mt-0.5 text-sm font-medium tabular-nums text-foreground">
                  {r.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Authorization */}
        <motion.label
          className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm transition hover:border-primary/30 dark:bg-slate-900/40"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35, ease }}
        >
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 size-4 rounded border-border accent-primary"
          />
          <span className="text-sm text-muted-foreground">
            I confirm the information above is accurate and authorize this
            rollover request in accordance with plan terms and IRS regulations. I
            understand that processing typically takes 5–10 business days and
            that I will be notified once the transfer is complete.
          </span>
        </motion.label>
      </div>
    </TransactionFlowShell>
  );
}

/* ─── Step 5 — Confirmation ─── */

function StepConfirmation({ data }: { data: Partial<RolloverData> }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const [refNumber] = useState(
    () =>
      `ROL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
  );

  const rolloverTypeLabel =
    ROLLOVER_TYPES.find((t) => t.value === data.rolloverType)?.label ?? "—";

  const allocationLabel =
    ALLOCATION_OPTIONS.find((o) => o.value === data.allocationMethod)?.label ??
    "—";

  return (
    <TransactionFlowShell type="rollover" hideCta>
      <div className="flex flex-col items-center py-8 text-center">
        <motion.div
          className="mb-6 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <CheckCircle2 className="size-8 text-white" />
        </motion.div>

        <motion.h3
          className="text-xl font-bold text-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35, ease }}
        >
          Rollover Submitted
        </motion.h3>

        <motion.p
          className="mx-auto mt-2 max-w-md text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35, ease }}
        >
          Processing typically takes 5–10 business days. You&rsquo;ll receive a
          notification once the transfer is complete.
        </motion.p>

        {/* Reference */}
        <motion.div
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 dark:bg-slate-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35, ease }}
        >
          <span className="text-xs text-muted-foreground">Reference</span>
          <span className="font-mono text-xs font-semibold tabular-nums text-foreground">
            {refNumber}
          </span>
        </motion.div>

        {/* Details card */}
        <motion.div
          className="mx-auto mt-8 w-full max-w-sm divide-y divide-border rounded-2xl border border-border bg-white shadow-sm dark:bg-slate-900/40"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35, ease }}
        >
          {[
            { label: "Rollover Type", value: rolloverTypeLabel },
            {
              label: "Previous Employer",
              value: data.previousEmployer || "—",
            },
            {
              label: "Estimated Amount",
              value: data.estimatedAmount
                ? fmt.format(data.estimatedAmount)
                : "—",
            },
            { label: "Allocation", value: allocationLabel },
            { label: "Receiving Plan", value: MOCK_PLAN.planName },
          ].map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between px-5 py-3"
            >
              <span className="text-sm text-muted-foreground">{r.label}</span>
              <span className="text-sm font-medium tabular-nums text-foreground">
                {r.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Return button */}
        <motion.button
          type="button"
          onClick={() => navigate(withVersion(version, "/transactions"))}
          className="mt-8 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.35, ease }}
        >
          Return to Transaction Center
          <ArrowRight className="size-4" />
        </motion.button>
      </div>
    </TransactionFlowShell>
  );
}

/* ─── Shared Field ─── */

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
