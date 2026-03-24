import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useInvestment } from "@/context/InvestmentContext";
import { useEnrollmentOptional } from "@/enrollment/context/EnrollmentContext";
import { getSourceTotal, deriveStyleFromRiskScore } from "@/utils/investmentAllocationHelpers";
import { FundAllocationModal, type SourceKey } from "./FundAllocationModal";

const SOURCE_LABEL_KEYS: Record<SourceKey, string> = {
  preTax: "enrollment.preTax",
  roth: "enrollment.roth",
  afterTax: "enrollment.afterTax",
};

const cardStyle: React.CSSProperties = {
  background: "var(--enroll-card-bg)",
  border: "1px solid var(--enroll-card-border)",
  borderRadius: "var(--enroll-card-radius)",
  boxShadow: "var(--enroll-elevation-2)",
};

/** Single source row: when custom enabled = clickable + edit icon; when disabled = muted + System Managed badge */
function SourceRow({
  source,
  isCustomEnabled,
  onOpenModal,
}: {
  source: SourceKey;
  isCustomEnabled: boolean;
  onOpenModal: (s: SourceKey) => void;
}) {
  const { t } = useTranslation();
  const { getFundsForSource } = useInvestment();
  const funds = getFundsForSource(source);
  const total = getSourceTotal(funds);
  const sourceLabel = t(SOURCE_LABEL_KEYS[source]);
  const isValid = Math.abs(total - 100) < 0.01;

  if (!isCustomEnabled) {
    return (
      <div
        className="w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl text-left cursor-default"
        style={{
          background: "var(--enroll-soft-bg)",
          border: "1px solid var(--enroll-card-border)",
          opacity: 0.85,
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-bold" style={{ color: "var(--enroll-text-secondary)" }}>
            {sourceLabel}
          </span>
          <span
            className="text-[11px] px-2 py-0.5 rounded-full"
            style={{
              background: "rgb(var(--enroll-brand-rgb) / 0.06)",
              color: "var(--enroll-text-muted)",
            }}
          >
            {t("enrollment.fundsCount", { count: funds.length })}
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded"
            style={{
              background: "var(--enroll-card-border)",
              color: "var(--enroll-text-muted)",
            }}
          >
            {t("enrollment.systemManaged")}
          </span>
        </div>
        <span className="text-xs font-semibold" style={{ color: "var(--enroll-text-muted)" }}>
          {isValid ? t("enrollment.allocated100") : t("enrollment.allocatedBadge", { pct: total.toFixed(1) })}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpenModal(source)}
      className="w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl transition-colors duration-200 text-left hover:opacity-90"
      style={{
        background: "var(--enroll-soft-bg)",
        border: "1px solid var(--enroll-card-border)",
      }}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-bold" style={{ color: "var(--enroll-text-primary)" }}>
          {sourceLabel}
        </span>
        <span
          className="text-[11px] px-2 py-0.5 rounded-full"
          style={{
            background: "rgb(var(--enroll-brand-rgb) / 0.08)",
            color: "var(--enroll-text-secondary)",
          }}
        >
          {t("enrollment.fundsCount", { count: funds.length })}
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-xs font-semibold" style={{ color: isValid ? "var(--enroll-accent)" : "var(--enroll-text-muted)" }}>
          {isValid ? t("enrollment.allocated100") : t("enrollment.allocatedBadge", { pct: total.toFixed(1) })}
        </span>
        <span style={{ color: "var(--enroll-text-muted)" }} aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </span>
      </div>
    </button>
  );
}

export function FundAllocationSection() {
  const { t } = useTranslation();
  const enrollment = useEnrollmentOptional();
  const {
    activeSources,
    getFundsForSource,
    canConfirmAllocation,
    isCustomAllocationEnabled,
    setCustomAllocationEnabled,
    applyModelAllocation,
  } = useInvestment();
  const [modalSource, setModalSource] = useState<SourceKey | null>(null);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);

  const profile = enrollment?.state.investmentProfile ?? null;
  const riskTolerance = profile?.riskTolerance ?? 3;
  const derivedStyle = deriveStyleFromRiskScore(riskTolerance);

  const anyOver = activeSources.some((src) => getSourceTotal(getFundsForSource(src)) > 100.01);
  const globalStatus: "error" | "warning" | "success" = canConfirmAllocation
    ? "success"
    : anyOver
      ? "error"
      : "warning";

  const handleToggleCustom = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        setCustomAllocationEnabled(true);
        return;
      }
      setShowDisableConfirm(true);
    },
    [setCustomAllocationEnabled]
  );

  const handleConfirmDisable = useCallback(() => {
    applyModelAllocation(derivedStyle);
    setCustomAllocationEnabled(false);
    setModalSource(null);
    setShowDisableConfirm(false);
  }, [applyModelAllocation, derivedStyle, setCustomAllocationEnabled]);

  const handleCancelDisable = useCallback(() => {
    setShowDisableConfirm(false);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      aria-labelledby="fund-allocation-heading"
    >
      <h2
        id="fund-allocation-heading"
        className="text-[10px] font-bold uppercase tracking-widest mb-4"
        style={{ color: "var(--enroll-text-muted)" }}
      >
        {t("enrollment.fundAllocation")}
      </h2>

      {/* Toggle: I choose my investments */}
      <div
        className="mb-4 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        style={{ ...cardStyle, background: "var(--enroll-soft-bg)" }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
            {t("enrollment.customizeMyAllocation")}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--enroll-text-muted)" }}>
            {t("enrollment.customizeMyAllocationDesc")}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isCustomAllocationEnabled}
          aria-label={t("enrollment.customizeMyAllocation")}
          onClick={() => handleToggleCustom(!isCustomAllocationEnabled)}
          className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--enroll-brand)]"
          style={{
            background: isCustomAllocationEnabled ? "var(--enroll-brand)" : "var(--enroll-card-border)",
          }}
        >
          <span
            className="pointer-events-none inline-block h-5 w-5 shrink-0 rounded-full bg-white shadow-sm transition-transform"
            style={{
              transform: isCustomAllocationEnabled ? "translateX(1.25rem)" : "translateX(0.125rem)",
            }}
          />
        </button>
      </div>

      <div className="p-5 space-y-5" style={cardStyle}>
        {/* Source rows */}
        <div className="space-y-3">
          {activeSources.map((source) => (
            <SourceRow
              key={source}
              source={source}
              isCustomEnabled={isCustomAllocationEnabled}
              onOpenModal={setModalSource}
            />
          ))}
        </div>

        {/* Global status */}
        <div
          className="flex items-center gap-3 p-4 rounded-xl"
          style={{
            background: globalStatus === "success"
              ? "rgb(var(--enroll-accent-rgb) / 0.06)"
              : globalStatus === "error"
                ? "rgb(var(--color-danger-rgb) / 0.06)"
                : "rgb(var(--color-warning-rgb) / 0.06)",
            border: globalStatus === "success"
              ? "1px solid rgb(var(--enroll-accent-rgb) / 0.15)"
              : globalStatus === "error"
                ? "1px solid rgb(var(--color-danger-rgb) / 0.15)"
                : "1px solid rgb(var(--color-warning-rgb) / 0.15)",
          }}
          role="status"
        >
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shrink-0"
            style={{
              background: globalStatus === "success"
                ? "var(--enroll-accent)"
                : globalStatus === "error"
                  ? "var(--color-danger)"
                  : "var(--color-warning)",
            }}
          >
            {globalStatus === "success" ? "✓" : "!"}
          </span>
          <div>
            <p className="text-sm font-semibold" style={{
              color: globalStatus === "success"
                ? "var(--enroll-accent)"
                : globalStatus === "error"
                  ? "var(--color-danger)"
                  : "var(--color-warning)",
            }}>
              {globalStatus === "success" && t("enrollment.totalAllocation100")}
              {globalStatus === "error" && t("enrollment.overAllocated")}
              {globalStatus === "warning" && t("enrollment.incompleteAllocation")}
            </p>
            <p className="text-xs" style={{ color: "var(--enroll-text-muted)" }}>
              {globalStatus === "success" && t("enrollment.allocationComplete")}
              {globalStatus === "error" && t("enrollment.reduceAllocationsPerSource")}
              {globalStatus === "warning" && t("enrollment.eachSourceMustTotal100")}
            </p>
          </div>
        </div>
      </div>

      {isCustomAllocationEnabled && modalSource && (
        <FundAllocationModal
          open={!!modalSource}
          onClose={() => setModalSource(null)}
          source={modalSource}
        />
      )}

      {/* Confirm dialog: Disabling customization will reset... */}
      {showDisableConfirm && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="disable-custom-title"
        >
          <div
            className="max-w-sm w-full p-6 rounded-xl shadow-xl"
            style={{
              background: "var(--enroll-card-bg)",
              border: "1px solid var(--enroll-card-border)",
            }}
          >
            <p id="disable-custom-title" className="text-sm mb-4" style={{ color: "var(--enroll-text-primary)" }}>
              {t("enrollment.disablingCustomizationReset")}
            </p>
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleCancelDisable}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{
                  background: "var(--enroll-soft-bg)",
                  color: "var(--enroll-text-primary)",
                  border: "1px solid var(--enroll-card-border)",
                }}
              >
                {t("enrollment.cancel")}
              </button>
              <button
                type="button"
                onClick={handleConfirmDisable}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                style={{ background: "var(--enroll-brand)" }}
              >
                {t("enrollment.continue")}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
