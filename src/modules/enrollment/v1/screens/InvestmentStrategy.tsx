import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TFunction } from "i18next";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Gauge,
  Layers,
  Minus,
  Pencil,
  Phone,
  Plus,
  Settings,
  Sparkles,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { pathForWizardStep } from "../flow/v1WizardPaths";
import type { RiskLevel } from "../store/useEnrollmentStore";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

/* ─── Types ─── */

interface FundDetail {
  name: string;
  ticker: string;
  expense: string;
}

interface AllocationEntry {
  name: string;
  value: number;
  color: string;
  funds: FundDetail[];
}

interface SourceFundAllocation {
  name: string;
  ticker: string;
  expense: string;
  assetClass: string;
  color: string;
  allocation: number;
}

type SourceKey = "roth" | "preTax" | "afterTax";

interface PerSourceAllocations {
  sameForAll: boolean;
  unified: SourceFundAllocation[];
  sources: Record<SourceKey, SourceFundAllocation[]>;
}

/* ─── Labels ─── */

const sourceColors: Record<SourceKey, string> = {
  roth: "#8b5cf6",
  preTax: "#3b82f6",
  afterTax: "#10b981",
};

const sourceBorderColors: Record<SourceKey, string> = {
  roth: "border-purple-200 dark:border-purple-800/80",
  preTax: "border-blue-200 dark:border-blue-800/80",
  afterTax: "border-green-200 dark:border-green-800/80",
};

const sourceBgColors: Record<SourceKey, string> = {
  roth: "bg-purple-50 dark:bg-purple-950/40",
  preTax: "bg-blue-50 dark:bg-blue-950/40",
  afterTax: "bg-green-50 dark:bg-green-950/40",
};

/* ─── Static data ─── */

const ALLOCATION_BY_RISK: Record<RiskLevel, AllocationEntry[]> = {
  conservative: [
    { name: "Bonds", value: 45, color: "#3b82f6", funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }, { name: "PIMCO Income Fund", ticker: "PONAX", expense: "0.59%" }] },
    { name: "US Stocks", value: 25, color: "#10b981", funds: [{ name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" }] },
    { name: "International Stocks", value: 15, color: "#8b5cf6", funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }] },
    { name: "Real Estate", value: 15, color: "#f59e0b", funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }] },
  ],
  balanced: [
    { name: "US Stocks", value: 40, color: "#10b981", funds: [{ name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" }, { name: "Vanguard Mid-Cap Index", ticker: "VIMAX", expense: "0.05%" }] },
    { name: "Bonds", value: 25, color: "#3b82f6", funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }] },
    { name: "International Stocks", value: 20, color: "#8b5cf6", funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }] },
    { name: "Real Estate", value: 15, color: "#f59e0b", funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }] },
  ],
  growth: [
    { name: "US Stocks", value: 50, color: "#10b981", funds: [{ name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" }, { name: "Vanguard Growth Index", ticker: "VIGAX", expense: "0.05%" }] },
    { name: "International Stocks", value: 20, color: "#8b5cf6", funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }] },
    { name: "Bonds", value: 20, color: "#3b82f6", funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }] },
    { name: "Real Estate", value: 10, color: "#f59e0b", funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }] },
  ],
  aggressive: [
    { name: "US Stocks", value: 50, color: "#10b981", funds: [{ name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" }, { name: "Vanguard Small-Cap Growth", ticker: "VSGAX", expense: "0.07%" }] },
    { name: "International Stocks", value: 20, color: "#8b5cf6", funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }, { name: "Vanguard Emerging Markets", ticker: "VEMAX", expense: "0.14%" }] },
    { name: "Bonds", value: 20, color: "#3b82f6", funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }] },
    { name: "Real Estate", value: 10, color: "#f59e0b", funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }] },
  ],
};

const STYLE_TITLE_KEYS: Record<RiskLevel, string> = {
  conservative: "styleTitleConservative",
  balanced: "styleTitleBalanced",
  growth: "styleTitleGrowth",
  aggressive: "styleTitleAggressive",
};

const STYLE_DESC_KEYS: Record<RiskLevel, string> = {
  conservative: "styleDescConservative",
  balanced: "styleDescBalanced",
  growth: "styleDescGrowth",
  aggressive: "styleDescAggressive",
};

const WHY_KEYS: Record<RiskLevel, string> = {
  conservative: "whyConservative",
  balanced: "whyBalanced",
  growth: "whyGrowth",
  aggressive: "whyAggressive",
};

const RISK_DEF: { key: RiskLevel; labelKey: string; subKey: string }[] = [
  { key: "conservative", labelKey: "riskConservative", subKey: "riskSubConservative" },
  { key: "balanced", labelKey: "riskBalanced", subKey: "riskSubBalanced" },
  { key: "growth", labelKey: "riskGrowth", subKey: "riskSubGrowth" },
  { key: "aggressive", labelKey: "riskAggressive", subKey: "riskSubAggressive" },
];

const RETURN_BAND_KEYS: Record<RiskLevel, string> = {
  conservative: "returnBandConservative",
  balanced: "returnBandBalanced",
  growth: "returnBandGrowth",
  aggressive: "returnBandAggressive",
};

const RISK_DISPLAY_KEYS: Record<RiskLevel, string> = {
  conservative: "riskDisplayLow",
  balanced: "riskDisplayLow",
  growth: "riskDisplayModerate",
  aggressive: "riskDisplayHigh",
};

const IV = "enrollment.v1.investment.";

function sourceShort(t: TFunction, k: SourceKey) {
  const m: Record<SourceKey, string> = { roth: "sourceRoth", preTax: "sourcePreTax", afterTax: "sourceAfterTax" };
  return t(`${IV}${m[k]}`);
}

function sourceFull(t: TFunction, k: SourceKey) {
  const m: Record<SourceKey, string> = {
    roth: "sourceRothFull",
    preTax: "sourcePreTaxFull",
    afterTax: "sourceAfterTaxFull",
  };
  return t(`${IV}${m[k]}`);
}

function sourceTax(t: TFunction, k: SourceKey) {
  const m: Record<SourceKey, string> = { roth: "taxFree", preTax: "taxDeferred", afterTax: "taxable" };
  return t(`${IV}${m[k]}`);
}

const ADVISOR_CONTACT_HREF = "mailto:support@yourplan.com?subject=Investment%20guidance";

// Plan-approved fund catalog
const fundCatalog: SourceFundAllocation[] = [
  { name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%", assetClass: "Equity", color: "#10b981", allocation: 0 },
  { name: "Vanguard Mid-Cap Index", ticker: "VIMAX", expense: "0.05%", assetClass: "Equity", color: "#10b981", allocation: 0 },
  { name: "Vanguard Growth Index", ticker: "VIGAX", expense: "0.05%", assetClass: "Equity", color: "#10b981", allocation: 0 },
  { name: "Vanguard Small-Cap Growth", ticker: "VSGAX", expense: "0.07%", assetClass: "Equity", color: "#10b981", allocation: 0 },
  { name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%", assetClass: "Fixed Income", color: "#3b82f6", allocation: 0 },
  { name: "PIMCO Income Fund", ticker: "PONAX", expense: "0.59%", assetClass: "Fixed Income", color: "#3b82f6", allocation: 0 },
  { name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%", assetClass: "International", color: "#8b5cf6", allocation: 0 },
  { name: "Vanguard Emerging Markets", ticker: "VEMAX", expense: "0.14%", assetClass: "International", color: "#8b5cf6", allocation: 0 },
  { name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%", assetClass: "Real Estate", color: "#f59e0b", allocation: 0 },
];

/* ─── Helpers ─── */

function buildFundsFromRecommended(alloc: AllocationEntry[]): SourceFundAllocation[] {
  return fundCatalog
    .map((fund) => {
      const matched = alloc.find((cat) => cat.funds.some((f) => f.ticker === fund.ticker));
      if (!matched) return null;
      const share = matched.value / matched.funds.length;
      return { ...fund, allocation: Math.round(share) };
    })
    .filter((f): f is SourceFundAllocation => f !== null);
}

function getSourceTotal(funds: SourceFundAllocation[]): number {
  return funds.reduce((s, f) => s + f.allocation, 0);
}

function translateAllocName(t: TFunction, name: string) {
  const m: Record<string, string> = {
    Bonds: "allocBonds",
    "US Stocks": "allocUsStocks",
    "International Stocks": "allocIntlStocks",
    "Real Estate": "allocRealEstate",
  };
  const k = m[name];
  return k ? t(`${IV}${k}`) : name;
}

function assetClassLabelInv(t: TFunction, cls: string) {
  const m: Record<string, string> = {
    Equity: "assetEquity",
    "Fixed Income": "assetFixedIncome",
    International: "assetInternational",
    "Real Estate": "assetRealEstate",
  };
  const k = m[cls];
  return k ? t(`${IV}${k}`) : cls;
}

function computeRiskLevel(funds: SourceFundAllocation[], t: TFunction): { label: string; color: string } {
  const total = funds.reduce((s, f) => s + f.allocation, 0);
  if (total === 0) return { label: t(`${IV}riskNotSet`), color: "text-muted-foreground" };
  const equityPct = funds
    .filter((f) => f.assetClass === "Equity" || f.assetClass === "International")
    .reduce((s, f) => s + f.allocation, 0);
  if (equityPct >= 70) return { label: t(`${IV}riskAggressive`), color: "text-red-600 dark:text-red-400" };
  if (equityPct >= 50) return { label: t(`${IV}riskGrowth`), color: "text-orange-600 dark:text-orange-400" };
  if (equityPct >= 30) return { label: t(`${IV}riskBalanced`), color: "text-blue-600 dark:text-blue-400" };
  return { label: t(`${IV}riskConservative`), color: "text-green-600 dark:text-green-400" };
}

/* ─── Allocation indicator ─── */

function AllocationIndicator({ total, label }: { total: number; label?: string }) {
  const { t } = useTranslation();
  const isValid = total === 100;
  const diff = total - 100;
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl px-3.5 py-2",
        isValid ? "bg-green-50 dark:bg-green-950/40" : "bg-amber-50 dark:bg-amber-950/35",
      )}
    >
      <div className="flex items-center gap-2">
        {isValid
          ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
          : <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
        <span
          className={cn(isValid ? "text-green-700 dark:text-green-200" : "text-amber-700 dark:text-amber-200")}
          style={{ fontSize: "0.78rem", fontWeight: 500 }}
        >
          {label ? `${label}: ` : ""}
          {isValid
            ? t(`${IV}allocBalanced`)
            : diff > 0
              ? t(`${IV}allocOver`, { diff })
              : t(`${IV}allocRemaining`, { diff: Math.abs(diff) })}
        </span>
      </div>
      <span
        className={cn("tabular-nums", isValid ? "text-green-800 dark:text-green-100" : "text-amber-800 dark:text-amber-100")}
        style={{ fontSize: "0.9rem", fontWeight: 700 }}
      >
        {total}%
      </span>
    </div>
  );
}

/* ─── Fund picker dropdown ─── */

function FundPicker({ existingTickers, onAdd }: { existingTickers: string[]; onAdd: (f: SourceFundAllocation) => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const available = fundCatalog.filter((f) => !existingTickers.includes(f.ticker));
  if (available.length === 0) return null;

  const grouped = available.reduce<Record<string, SourceFundAllocation[]>>((acc, f) => {
    if (!acc[f.assetClass]) acc[f.assetClass] = [];
    acc[f.assetClass].push(f);
    return acc;
  }, {});

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 py-1.5 px-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50"
        style={{ fontSize: "0.8rem", fontWeight: 500 }}
      >
        <Plus className="w-3.5 h-3.5" /> {t(`${IV}addFund`)}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 max-h-64 w-72 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-900">
          {Object.entries(grouped).map(([cls, funds]) => (
            <div key={cls}>
              <p
                className="sticky top-0 bg-white px-3 pb-1 pt-2.5 text-gray-400 dark:bg-gray-900 dark:text-gray-500"
                style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
              >
                {assetClassLabelInv(t, cls)}
              </p>
              {funds.map((fund) => (
            <button
                  key={fund.ticker}
              type="button"
                  onClick={() => { onAdd({ ...fund, allocation: 0 }); setOpen(false); }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div>
                    <p className="text-gray-800 dark:text-gray-100" style={{ fontSize: "0.8rem" }}>{fund.name}</p>
                    <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>
                      {fund.ticker} · {t(`${IV}erLabel`)} {fund.expense}
                    </p>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-gray-400" />
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Source fund list ─── */

function SourceFundList({ funds, onUpdate, onRemove, onAdd }: {
  funds: SourceFundAllocation[];
  onUpdate: (ticker: string, value: number) => void;
  onRemove: (ticker: string) => void;
  onAdd: (fund: SourceFundAllocation) => void;
}) {
  const { t } = useTranslation();
  const { effectiveMode } = useTheme();
  const trackMuted = effectiveMode === "dark" ? "#4b5563" : "#e5e7eb";
  const grouped = funds.reduce<Record<string, SourceFundAllocation[]>>((acc, f) => {
    if (!acc[f.assetClass]) acc[f.assetClass] = [];
    acc[f.assetClass].push(f);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([assetClass, classFunds]) => (
        <div key={assetClass}>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: classFunds[0].color }} />
            <p
              className="text-gray-400 dark:text-gray-500"
              style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
            >
              {assetClassLabelInv(t, assetClass)}
            </p>
          </div>
          <div className="space-y-2">
            {classFunds.map((fund) => (
              <div
                key={fund.ticker}
                className="rounded-xl border border-gray-200 bg-white px-3.5 py-3 dark:border-gray-600 dark:bg-gray-900/90"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-gray-900 dark:text-gray-50" style={{ fontSize: "0.82rem", fontWeight: 500 }}>{fund.name}</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.68rem" }}>{fund.ticker}</span>
                      <span className="text-gray-300 dark:text-gray-600">·</span>
                      <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.68rem" }}>
                        {t(`${IV}erLabel`)} {fund.expense}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={() => onUpdate(fund.ticker, Math.max(0, fund.allocation - 1))}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <div className="flex items-center gap-0.5 rounded-lg bg-gray-50 px-2 py-0.5 dark:bg-gray-800/80">
                      <input
                        type="number" min={0} max={100} value={fund.allocation}
                        onChange={(e) => onUpdate(fund.ticker, Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                        className="w-9 border-none bg-transparent text-right text-gray-900 tabular-nums outline-none dark:text-gray-100"
                        style={{ fontSize: "0.85rem", fontWeight: 600 }}
                      />
                      <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.78rem" }}>%</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onUpdate(fund.ticker, Math.min(100, fund.allocation + 1))}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(fund.ticker)}
                      className="ml-0.5 flex h-6 w-6 items-center justify-center rounded-md text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <input
                  type="range" min={0} max={100} value={fund.allocation}
                  onChange={(e) => onUpdate(fund.ticker, parseInt(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${fund.color} 0%, ${fund.color} ${fund.allocation}%, ${trackMuted} ${fund.allocation}%, ${trackMuted} 100%)`,
                    accentColor: fund.color,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <FundPicker existingTickers={funds.map((f) => f.ticker)} onAdd={onAdd} />
    </div>
  );
}

/* ─── Portfolio editor content (shared between inline + modal) ─── */

function PortfolioEditorContent({ allocs, setAllocs, activeSources, activeTab, setActiveTab }: {
  allocs: PerSourceAllocations;
  setAllocs: React.Dispatch<React.SetStateAction<PerSourceAllocations>>;
  activeSources: SourceKey[];
  activeTab: SourceKey;
  setActiveTab: (tab: SourceKey) => void;
}) {
  const { t } = useTranslation();
  const updateUnifiedFund = useCallback((ticker: string, value: number) => {
    setAllocs((prev) => ({ ...prev, unified: prev.unified.map((f) => f.ticker === ticker ? { ...f, allocation: value } : f) }));
  }, [setAllocs]);

  const removeUnifiedFund = useCallback((ticker: string) => {
    setAllocs((prev) => ({ ...prev, unified: prev.unified.filter((f) => f.ticker !== ticker) }));
  }, [setAllocs]);

  const addUnifiedFund = useCallback((fund: SourceFundAllocation) => {
    setAllocs((prev) => ({ ...prev, unified: [...prev.unified, fund] }));
  }, [setAllocs]);

  const updateSourceFund = useCallback((source: SourceKey, ticker: string, value: number) => {
    setAllocs((prev) => ({ ...prev, sources: { ...prev.sources, [source]: prev.sources[source].map((f) => f.ticker === ticker ? { ...f, allocation: value } : f) } }));
  }, [setAllocs]);

  const removeSourceFund = useCallback((source: SourceKey, ticker: string) => {
    setAllocs((prev) => ({ ...prev, sources: { ...prev.sources, [source]: prev.sources[source].filter((f) => f.ticker !== ticker) } }));
  }, [setAllocs]);

  const addSourceFund = useCallback((source: SourceKey, fund: SourceFundAllocation) => {
    setAllocs((prev) => ({ ...prev, sources: { ...prev.sources, [source]: [...prev.sources[source], fund] } }));
  }, [setAllocs]);

  const toggleSameForAll = () => {
    setAllocs((prev) => {
      if (prev.sameForAll) {
        const newSources = { ...prev.sources };
        activeSources.forEach((src) => { if (newSources[src].length === 0) newSources[src] = prev.unified.map((f) => ({ ...f })); });
        return { ...prev, sameForAll: false, sources: newSources };
      }
      return { ...prev, sameForAll: true };
    });
  };

  const unifiedTotal = getSourceTotal(allocs.unified);
  const sourceTotals = activeSources.map((src) => ({ key: src, total: getSourceTotal(allocs.sources[src]) }));
  const currentFunds = allocs.sameForAll ? allocs.unified : allocs.sources[activeTab];

  const chartData = Object.entries(
    (currentFunds || []).filter((f) => f.allocation > 0).reduce<Record<string, { value: number; color: string }>>((acc, f) => {
      if (!acc[f.assetClass]) acc[f.assetClass] = { value: 0, color: f.color };
      acc[f.assetClass].value += f.allocation;
      return acc;
    }, {})
  ).map(([name, d]) => ({ name, ...d }));

  return (
    <div className="space-y-4">
      {/* Same-for-all toggle */}
      {activeSources.length > 1 && (
        <button
          type="button"
          onClick={toggleSameForAll}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border px-4 py-3 transition-all",
            allocs.sameForAll
              ? "border-blue-200 bg-blue-50 dark:border-blue-800/80 dark:bg-blue-950/40"
              : "border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50",
          )}
        >
          {allocs.sameForAll ? (
            <ToggleRight className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
          ) : (
            <ToggleLeft className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" />
          )}
          <div className="flex-1 text-left">
            <p
              className={cn(
                allocs.sameForAll ? "text-blue-800 dark:text-blue-100" : "text-gray-700 dark:text-gray-200",
              )}
              style={{ fontSize: "0.82rem", fontWeight: 500 }}
            >
              {t(`${IV}sameForAllTitle`)}
            </p>
            <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.7rem" }}>
              {allocs.sameForAll ? t(`${IV}sameForAllOn`) : t(`${IV}sameForAllOff`)}
            </p>
          </div>
          {!allocs.sameForAll && (
            <div className="flex items-center gap-1 shrink-0">
              <Layers className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-500 dark:text-gray-400" style={{ fontSize: "0.72rem" }}>
                {t(`${IV}sourcesCount`, { count: activeSources.length })}
              </span>
            </div>
          )}
        </button>
      )}

      {/* Donut chart summary */}
      {chartData.length > 0 && (
        <div className="flex items-center gap-4 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/60">
          <div className="w-14 h-14 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={16} outerRadius={26} paddingAngle={2} dataKey="value" strokeWidth={0}>
                  {chartData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {chartData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-gray-600 dark:text-gray-300" style={{ fontSize: "0.72rem" }}>
                    {assetClassLabelInv(t, d.name)}:{" "}
                    <span className="text-gray-900 dark:text-gray-50" style={{ fontWeight: 600 }}>{d.value}%</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Gauge className="h-3 w-3 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-500 dark:text-gray-400" style={{ fontSize: "0.68rem" }}>
                {t(`${IV}riskLabel`)}{" "}
                <span className={computeRiskLevel(currentFunds || [], t).color} style={{ fontWeight: 600 }}>
                  {computeRiskLevel(currentFunds || [], t).label}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      {allocs.sameForAll ? (
        <div>
          {allocs.unified.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.85rem" }}>{t(`${IV}noFunds`)}</p>
              <div className="mt-3 flex justify-center"><FundPicker existingTickers={[]} onAdd={addUnifiedFund} /></div>
            </div>
          ) : (
            <SourceFundList funds={allocs.unified} onUpdate={updateUnifiedFund} onRemove={removeUnifiedFund} onAdd={addUnifiedFund} />
          )}
          <div className="mt-4 space-y-2">
            <AllocationIndicator total={unifiedTotal} label={t(`${IV}totalAllocation`)} />
          </div>
        </div>
      ) : (
        <div>
          {activeSources.length > 1 ? (
            <div className="mb-4 space-y-1.5">
              <p
                className="mb-1 text-gray-400 dark:text-gray-500"
                style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
              >
                {t(`${IV}allSources`)}
              </p>
              {sourceTotals.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActiveTab(s.key)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
                    s.total === 100 ? "bg-green-50 dark:bg-green-950/40" : "bg-amber-50 dark:bg-amber-950/35",
                    activeTab === s.key && "ring-2 ring-blue-500 ring-offset-2 dark:ring-blue-400 dark:ring-offset-gray-950",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: sourceColors[s.key] }} />
                    {s.total === 100 ? (
                      <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    )}
                    <span
                      className={cn(
                        s.total === 100 ? "text-green-700 dark:text-green-200" : "text-amber-700 dark:text-amber-200",
                      )}
                      style={{ fontSize: "0.75rem", fontWeight: 500 }}
                    >
                      {sourceShort(t, s.key)}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "tabular-nums",
                      s.total === 100 ? "text-green-800 dark:text-green-100" : "text-amber-800 dark:text-amber-100",
                    )}
                    style={{ fontSize: "0.8rem", fontWeight: 600 }}
                  >
                    {s.total}%
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="mb-3 text-gray-800 dark:text-gray-100" style={{ fontSize: "0.88rem", fontWeight: 600 }}>
              {t(`${IV}sourcePortfolio`, { source: sourceShort(t, activeTab) })}
            </p>
          )}

          <div className="mb-2">
            {allocs.sources[activeTab].length === 0 ? (
              <div className="rounded-xl bg-gray-50 py-6 text-center dark:bg-gray-800/50">
                <p className="mb-2 text-gray-400 dark:text-gray-500" style={{ fontSize: "0.82rem" }}>
                  {t(`${IV}noFundsForSource`, { source: sourceShort(t, activeTab) })}
                </p>
                <div className="flex justify-center"><FundPicker existingTickers={[]} onAdd={(fund) => addSourceFund(activeTab, fund)} /></div>
              </div>
            ) : (
              <SourceFundList
                funds={allocs.sources[activeTab]}
                onUpdate={(ticker, val) => updateSourceFund(activeTab, ticker, val)}
                onRemove={(ticker) => removeSourceFund(activeTab, ticker)}
                onAdd={(fund) => addSourceFund(activeTab, fund)}
              />
            )}

            <div className="mt-3 space-y-2">
              <AllocationIndicator
                total={getSourceTotal(allocs.sources[activeTab])}
                label={t(`${IV}sourceAllocationLabel`, { source: sourceShort(t, activeTab) })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Source card ─── */

function SourceCard({ sourceKey, monthlyAmount, funds, isCustomized, onEditPortfolio }: {
  sourceKey: SourceKey;
  monthlyAmount: number;
  funds: SourceFundAllocation[];
  isCustomized: boolean;
  onEditPortfolio: () => void;
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const activeFunds = funds.filter((f) => f.allocation > 0);

  const assetSummary = Object.entries(
    activeFunds.reduce<Record<string, { value: number; color: string }>>((acc, f) => {
      if (!acc[f.assetClass]) acc[f.assetClass] = { value: 0, color: f.color };
      acc[f.assetClass].value += f.allocation;
      return acc;
    }, {})
  ).map(([name, d]) => ({ name, ...d }));

  return (
    <div className={cn("overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-gray-900/90", sourceBorderColors[sourceKey])}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: sourceColors[sourceKey] }} />
              <p className="text-gray-900 dark:text-gray-50" style={{ fontSize: "0.9rem", fontWeight: 600 }}>{sourceFull(t, sourceKey)}</p>
              <span className={cn(sourceBgColors[sourceKey], "px-1.5 py-0.5 rounded")} style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.03em" }}>
                <span style={{ color: sourceColors[sourceKey] }}>{sourceTax(t, sourceKey)}</span>
                  </span>
            </div>
            <div className="mt-1.5 flex items-center gap-3">
              <span className="text-gray-700 dark:text-gray-300" style={{ fontSize: "0.82rem", fontWeight: 500 }}>
                {t(`${IV}perMo`, { amount: `$${Math.round(monthlyAmount).toLocaleString()}` })}
              </span>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span className="text-gray-500 dark:text-gray-400" style={{ fontSize: "0.78rem" }}>
                {t(`${IV}fund`, { count: activeFunds.length })}
              </span>
              {isCustomized && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                  <span className="text-blue-600 dark:text-blue-400" style={{ fontSize: "0.72rem", fontWeight: 500 }}>
                    {t(`${IV}customized`)}
                  </span>
                </>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onEditPortfolio}
            className="shrink-0 rounded-lg px-3 py-1.5 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/50 dark:hover:text-blue-300"
            style={{ fontSize: "0.82rem", fontWeight: 500 }}
          >
            <Pencil className="w-3.5 h-3.5 inline mr-1.5" />
            {t(`${IV}edit`)}
          </button>
        </div>

        {assetSummary.length > 0 && (
          <div className="mt-3">
            <div className="flex rounded-full h-2 overflow-hidden">
              {assetSummary.map((a) => <div key={a.name} style={{ width: `${a.value}%`, backgroundColor: a.color }} className="transition-all" />)}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2">
              {assetSummary.map((a) => (
                <div key={a.name} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                  <span className="text-gray-500 dark:text-gray-400" style={{ fontSize: "0.68rem" }}>
                    {assetClassLabelInv(t, a.name)}{" "}
                    <span className="text-gray-700 dark:text-gray-200" style={{ fontWeight: 600 }}>{a.value}%</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeFunds.length > 0 && (
          <div className="mt-2.5 space-y-0.5">
            {activeFunds.slice(0, 2).map((fund) => (
              <p key={fund.ticker} className="truncate text-gray-500 dark:text-gray-400" style={{ fontSize: "0.72rem" }}>{fund.name}</p>
            ))}
            {activeFunds.length > 2 && (
              <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.68rem" }}>
                {t(`${IV}moreFunds`, { count: activeFunds.length - 2 })}
              </p>
            )}
          </div>
        )}
      </div>

      {activeFunds.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-center gap-1.5 border-t border-gray-100 px-4 py-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 dark:border-gray-700 dark:hover:bg-gray-800/80 dark:hover:text-gray-300"
            style={{ fontSize: "0.75rem", fontWeight: 500 }}
          >
            {expanded ? t(`${IV}hideFunds`) : t(`${IV}viewFunds`)}
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {expanded && (
            <div className="space-y-2 border-t border-gray-100 px-4 py-3 dark:border-gray-700">
              {activeFunds.map((fund) => (
                <div key={fund.ticker} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-gray-700 dark:text-gray-200" style={{ fontSize: "0.78rem" }}>{fund.name}</p>
                    <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.65rem" }}>
                      {fund.ticker} · {t(`${IV}erLabel`)} {fund.expense}
                    </p>
                  </div>
                  <span className="tabular-nums text-gray-900 dark:text-gray-50" style={{ fontSize: "0.82rem", fontWeight: 600 }}>{fund.allocation}%</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function InactiveSourceCard({ sourceKey }: { sourceKey: SourceKey }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 opacity-60 dark:border-gray-600 dark:bg-gray-800/50">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: sourceColors[sourceKey] }} />
      <div>
        <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: "0.85rem", fontWeight: 500 }}>{sourceFull(t, sourceKey)}</p>
        <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.72rem" }}>{t(`${IV}inactiveSource`)}</p>
      </div>
    </div>
  );
}

/* ─── Build Portfolio Modal ─── */

function BuildPortfolioModal({
  onClose,
  defaultFunds,
  activeSources,
  inactiveSources,
  contributionSources,
  monthlyTotal,
  onSave,
  wizardHasCustomPortfolio,
}: {
  onClose: () => void;
  defaultFunds: SourceFundAllocation[];
  activeSources: SourceKey[];
  inactiveSources: SourceKey[];
  contributionSources: { preTax: number; roth: number; afterTax: number };
  monthlyTotal: number;
  onSave: (allocs: PerSourceAllocations) => void;
  wizardHasCustomPortfolio: boolean;
}) {
  const { t } = useTranslation();
  const [allocs, setAllocs] = useState<PerSourceAllocations>({
    sameForAll: activeSources.length === 1,
    unified: defaultFunds.map((f) => ({ ...f })),
    sources: { roth: defaultFunds.map((f) => ({ ...f })), preTax: defaultFunds.map((f) => ({ ...f })), afterTax: defaultFunds.map((f) => ({ ...f })) },
  });
  const [editingSource, setEditingSource] = useState<SourceKey | null>(null);
  const [inlineAllocs, setInlineAllocs] = useState<PerSourceAllocations | null>(null);
  const [inlineActiveTab, setInlineActiveTab] = useState<SourceKey>("preTax");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const getFundsForSource = (src: SourceKey) => {
    if (allocs.sameForAll) return allocs.unified;
    return allocs.sources[src];
  };

  const getMonthlyForSource = (src: SourceKey) => monthlyTotal * (contributionSources[src] / 100);

  const handleEditSource = (src: SourceKey) => {
    const initial = { ...allocs, unified: allocs.unified.map((f) => ({ ...f })), sources: { roth: allocs.sources.roth.map((f) => ({ ...f })), preTax: allocs.sources.preTax.map((f) => ({ ...f })), afterTax: allocs.sources.afterTax.map((f) => ({ ...f })) } };
    setInlineAllocs(initial);
    setInlineActiveTab(src);
    setEditingSource(src);
  };

  const handleSaveInline = () => {
    if (inlineAllocs) setAllocs(inlineAllocs);
    setEditingSource(null);
    setInlineAllocs(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-700">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-gray-900 dark:text-gray-50" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                {t(`${IV}modalTitle`)}
              </h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: "0.85rem" }}>
              {editingSource
                ? t(`${IV}modalSubtitleEdit`, { source: sourceFull(t, editingSource) })
                : t(`${IV}modalSubtitlePick`)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body — two columns */}
        <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
          {/* Left — source cards */}
          <div
            className={cn(
              editingSource ? "md:w-2/5" : "w-full",
              "overflow-y-auto border-r border-gray-200 px-6 py-5 transition-all dark:border-gray-700",
            )}
          >
            <p className="mb-4 text-gray-900 dark:text-gray-50" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
              {t(`${IV}yourSources`)}
            </p>
            <div className="space-y-3">
              {activeSources.map((src) => (
                <SourceCard
                  key={src}
                  sourceKey={src}
                  monthlyAmount={getMonthlyForSource(src)}
                  funds={getFundsForSource(src)}
                  isCustomized={wizardHasCustomPortfolio}
                  onEditPortfolio={() => handleEditSource(src)}
                />
              ))}
              {inactiveSources.map((src) => <InactiveSourceCard key={src} sourceKey={src} />)}
            </div>
          </div>

          {/* Right — inline editor */}
          {editingSource && inlineAllocs && (
            <div className="flex flex-1 flex-col bg-gray-50 md:w-3/5 dark:bg-gray-950/60">
              <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: sourceColors[editingSource] }} />
                  <h3 className="text-gray-900 dark:text-gray-50" style={{ fontSize: "1rem", fontWeight: 600 }}>
                    {t(`${IV}customizeSource`, { source: sourceFull(t, editingSource) })}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => { setEditingSource(null); setInlineAllocs(null); }}
                  className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <PortfolioEditorContent
                  allocs={inlineAllocs}
                  setAllocs={setInlineAllocs}
                  activeSources={activeSources}
                  activeTab={inlineActiveTab}
                  setActiveTab={setInlineActiveTab}
                />
              </div>
              <div className="flex items-center gap-3 border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
                <button
                  type="button"
                  onClick={() => { setEditingSource(null); setInlineAllocs(null); }}
                  className="flex-1 rounded-xl border border-gray-200 px-5 py-2.5 text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  style={{ fontSize: "0.85rem", fontWeight: 500 }}
                >
                  {t(`${IV}cancel`)}
                </button>
                <button
                  type="button"
                  onClick={handleSaveInline}
                  className="flex-1 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  style={{ fontSize: "0.85rem", fontWeight: 500 }}
                >
                  <Check className="w-4 h-4" /> {t(`${IV}saveChanges`)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-950/50">
          <button
            type="button"
            onClick={() => { onSave(allocs); onClose(); }}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            style={{ fontSize: "0.9rem", fontWeight: 600 }}
          >
            {t(`${IV}saveContinue`)} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─── */

export function InvestmentStrategy() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const riskLevel = useEnrollmentStore((s) => s.riskLevel);
  const updateField = useEnrollmentStore((s) => s.updateField);
  const nextStep = useEnrollmentStore((s) => s.nextStep);
  const contribution = useEnrollmentStore((s) => s.contribution);
  const salary = useEnrollmentStore((s) => s.salary);
  const contributionSources = useEnrollmentStore((s) => s.contributionSources);
  const supportsAfterTax = useEnrollmentStore((s) => s.supportsAfterTax);
  const currentAge = useEnrollmentStore((s) => s.currentAge);
  const retirementAge = useEnrollmentStore((s) => s.retirementAge);

  const [editorOpen, setEditorOpen] = useState(false);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [customAllocations, setCustomAllocations] = useState<PerSourceAllocations | null>(null);

  useEffect(() => {
    if (riskLevel == null) updateField("riskLevel", "balanced");
  }, [riskLevel, updateField]);

  const activeRisk = riskLevel ?? "balanced";
  const currentAllocation = ALLOCATION_BY_RISK[activeRisk];
  const defaultFunds = buildFundsFromRecommended(currentAllocation);

  // Determine active contribution sources
  const activeSources: SourceKey[] = [];
  if (contributionSources.roth > 0) activeSources.push("roth");
  if (contributionSources.preTax > 0) activeSources.push("preTax");
  if (supportsAfterTax && contributionSources.afterTax > 0) activeSources.push("afterTax");
  if (activeSources.length === 0) activeSources.push("preTax");

  const allSources: SourceKey[] = ["roth", "preTax", "afterTax"];
  const inactiveSources = allSources.filter((s) => !activeSources.includes(s) && (s !== "afterTax" || supportsAfterTax));

  const monthlyTotal = (salary * contribution) / 100 / 12;

  const riskOptions = useMemo(
    () =>
      RISK_DEF.map((opt) => ({
        key: opt.key,
        label: t(`${IV}${opt.labelKey}`),
        sub: t(`${IV}${opt.subKey}`),
      })),
    [t],
  );

  const handleContinueRecommended = () => {
    updateField("useRecommendedPortfolio", true);
    if (riskLevel == null) updateField("riskLevel", "balanced");
    nextStep();
    navigate(pathForWizardStep(useEnrollmentStore.getState().currentStep));
  };

  const handleSaveCustom = (allocs: PerSourceAllocations) => {
    setCustomAllocations(allocs);
    updateField("useRecommendedPortfolio", false);
  };

  const expectedReturnLabel = t(`${IV}${RETURN_BAND_KEYS[activeRisk]}`);
  const riskDotFilled: Record<RiskLevel, number> = {
    conservative: 1,
    balanced: 2,
    growth: 4,
    aggressive: 5,
  };
  const filledDots = riskDotFilled[activeRisk];
  const yearsToRet = Math.max(0, retirementAge - currentAge);
  const timelineLabel =
    yearsToRet >= 10 ? t(`${IV}timeline10Plus`) : t(`${IV}timelineYears`, { count: Math.max(1, yearsToRet) });
  const riskLevelShort = t(`${IV}${RISK_DISPLAY_KEYS[activeRisk]}`);

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl">
          {t(`${IV}pageTitle`)}
        </h1>
        <p className="mt-2 text-base font-normal leading-relaxed text-gray-500 dark:text-gray-400">
          {t(`${IV}pageSubtitle`)}
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 shadow-sm dark:border-gray-600 dark:bg-gray-900/90">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50">
                <Gauge className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden />
              </div>
              <div className="min-w-0">
                <p
                  className="text-gray-400 dark:text-gray-500"
                  style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}
                >
                  {t(`${IV}styleEyebrow`)}
                </p>
                <p className="mt-1 text-gray-900 dark:text-gray-50" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
                  {t(`${IV}${STYLE_TITLE_KEYS[activeRisk]}`)}
                </p>
                <p className="mt-1 text-gray-600 dark:text-gray-400" style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}>
                  {t(`${IV}${STYLE_DESC_KEYS[activeRisk]}`)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEditorOpen(!editorOpen)}
              aria-expanded={editorOpen}
              className="flex shrink-0 items-center gap-1.5 self-start text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 sm:self-center"
              style={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              <Pencil className="h-4 w-4" aria-hidden />
              {t(`${IV}editStrategy`)}
            </button>
          </div>

          {editorOpen ? (
            <div className="mt-5 border-t border-gray-100 pt-5 dark:border-gray-700">
              <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:grid-cols-4">
                {riskOptions.map((level) => (
                  <button
                    key={level.key}
                    type="button"
                    onClick={() => {
                      updateField("riskLevel", level.key);
                      setEditorOpen(false);
                      setCustomAllocations(null);
                    }}
                    className={`rounded-xl border-2 p-3 text-center transition-all ${
                      activeRisk === level.key
                        ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40"
                        : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-950 dark:hover:border-gray-500"
                    }`}
                  >
                    <p
                      className={activeRisk === level.key ? "text-blue-700 dark:text-blue-200" : "text-gray-900 dark:text-gray-50"}
                      style={{ fontWeight: 600, fontSize: "0.85rem" }}
                    >
                      {level.label}
                    </p>
                    <p className="mt-0.5 text-gray-500 dark:text-gray-400" style={{ fontSize: "0.72rem" }}>
                      {level.sub}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6 lg:items-stretch">
          <div className="flex min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-600 dark:bg-gray-900/90">
            <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="mb-2 inline-flex rounded-md bg-blue-100 px-2.5 py-1 dark:bg-blue-950/60">
                  <p
                    className="text-blue-700 dark:text-blue-300"
                    style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}
                  >
                    {t(`${IV}recommendedBadge`)}
                  </p>
                </div>
                <h3 className="text-gray-900 dark:text-gray-50" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
                  {t(`${IV}planDefaultTitle`)}
                </h3>
                <p className="mt-1 text-gray-600 dark:text-gray-400" style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}>
                  {t(`${IV}planDefaultDesc`)}
                </p>
              </div>

              <div className="shrink-0 space-y-2 text-right sm:text-left">
                <div className="flex flex-wrap items-baseline justify-end gap-x-2 sm:justify-start">
                  <span className="text-gray-500 dark:text-gray-400" style={{ fontSize: "0.8125rem" }}>
                    {t(`${IV}metricReturn`)}
                  </span>
                  <span className="text-gray-900 dark:text-gray-50" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                    {expectedReturnLabel}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-x-2 sm:justify-start">
                  <span className="text-gray-500 dark:text-gray-400" style={{ fontSize: "0.8125rem" }}>
                    {t(`${IV}metricRisk`)}
                  </span>
                  <span className="text-gray-900 dark:text-gray-50" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                    {riskLevelShort}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`h-2 w-2 rounded-full ${i < filledDots ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-200 dark:bg-gray-600"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-baseline justify-end gap-x-2 sm:justify-start">
                  <span className="text-gray-500 dark:text-gray-400" style={{ fontSize: "0.8125rem" }}>
                    {t(`${IV}metricTimeline`)}
                  </span>
                  <span className="text-gray-900 dark:text-gray-50" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                    {timelineLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-5 space-y-3 border-t border-gray-100 pt-5 dark:border-gray-700">
              {currentAllocation.map((a) => (
                <div key={a.name} className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: a.color }} />
                    <span className="truncate text-gray-800 dark:text-gray-200" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                      {translateAllocName(t, a.name)}
                    </span>
                  </div>
                  <span className="shrink-0 tabular-nums text-gray-900 dark:text-gray-50" style={{ fontSize: "0.875rem", fontWeight: 700 }}>
                    {a.value}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50/90 px-4 py-3 dark:border-blue-900/40 dark:bg-blue-950/40">
              <p className="mb-1 text-blue-800 dark:text-blue-200" style={{ fontSize: "0.8125rem", fontWeight: 700 }}>
                {t(`${IV}whyTitle`)}
              </p>
              <p className="text-blue-700 dark:text-blue-300/95" style={{ fontSize: "0.8125rem", lineHeight: 1.55 }}>
                {t(`${IV}${WHY_KEYS[activeRisk]}`)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleContinueRecommended}
              className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-white transition-all hover:bg-blue-700 active:scale-[0.99]"
              style={{ fontSize: "0.9375rem", fontWeight: 600 }}
            >
              {t(`${IV}continueRecommended`)} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </button>
          </div>

          <div className="flex min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-600 dark:bg-gray-900/90">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600 dark:bg-purple-500">
                <Settings className="h-5 w-5 text-white" aria-hidden />
              </div>
              <div className="rounded-md border border-purple-200 bg-purple-50 px-2.5 py-1 dark:border-purple-800/60 dark:bg-purple-950/50">
                <p
                  className="text-purple-800 dark:text-purple-200"
                  style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}
                >
                  {t(`${IV}advancedUser`)}
                </p>
              </div>
            </div>

            <h3 className="mb-2 text-gray-900 dark:text-gray-50" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
              {t(`${IV}customizeTitle`)}
            </h3>
            <p className="mb-6 flex-1 text-gray-600 dark:text-gray-400" style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>
              {t(`${IV}customizeDesc`)}
            </p>

            <button
              type="button"
              onClick={() => setShowBuildModal(true)}
              className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border-2 border-purple-500 bg-white px-6 py-3 text-purple-700 transition-all hover:bg-purple-50 active:scale-[0.99] dark:border-purple-500 dark:bg-transparent dark:text-purple-300 dark:hover:bg-purple-950/40"
              style={{ fontSize: "0.9375rem", fontWeight: 600 }}
            >
              {customAllocations ? t(`${IV}editPortfolioCta`) : t(`${IV}customizeCta`)}{" "}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </button>
          </div>
        </div>

        <div
          className="rounded-2xl border p-5 shadow-sm sm:p-6 sm:pl-8 sm:pr-8 dark:border-amber-500/35 dark:bg-gradient-to-br dark:from-amber-950/50 dark:to-[#1a1410] dark:shadow-none"
          style={{
            backgroundColor: "#FFF9EB",
            borderColor: "#F9C04D",
          }}
        >
          <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            {/* Left: EXPERT HELP badge + phone icon block */}
            <div className="flex shrink-0 flex-col items-start gap-3">
              <span
                className="inline-flex w-fit rounded-md border px-2.5 py-1 dark:border-amber-400/50 dark:bg-amber-950/60 dark:text-amber-200"
                style={{
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  backgroundColor: "#FEF3C7",
                  borderColor: "#F9C04D",
                  color: "#A65E00",
                }}
              >
                {t(`${IV}expertHelp`)}
              </span>
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl dark:bg-[#F58220]/90"
                style={{ backgroundColor: "#F58220" }}
                aria-hidden
              >
                <Phone className="h-7 w-7 text-white" strokeWidth={2} fill="none" />
              </div>
            </div>

            {/* Center: headline, body, bullets side-by-side on sm+ */}
            <div className="min-w-0 flex-1 lg:max-w-2xl lg:py-0.5">
              <h3
                className="text-pretty font-bold text-black dark:text-amber-50"
                style={{ fontSize: "1.125rem", lineHeight: 1.35 }}
              >
                {t(`${IV}advisorTitle`)}
              </h3>
              <p
                className="mt-2 max-w-2xl text-pretty dark:text-stone-400"
                style={{ fontSize: "0.9375rem", lineHeight: 1.55, color: "#4D4D4D" }}
              >
                {t(`${IV}advisorDesc`)}
              </p>
              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-1">
                <div className="flex items-center gap-2">
                  <Check
                    className="h-4 w-4 shrink-0 dark:text-emerald-400"
                    strokeWidth={2.75}
                    aria-hidden
                    style={{ color: "#28A745" }}
                  />
                  <span
                    className="dark:text-stone-200"
                    style={{ fontSize: "0.875rem", fontWeight: 500, color: "#4D4D4D" }}
                  >
                    {t(`${IV}advisorBullet1`)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check
                    className="h-4 w-4 shrink-0 dark:text-emerald-400"
                    strokeWidth={2.75}
                    aria-hidden
                    style={{ color: "#28A745" }}
                  />
                  <span
                    className="dark:text-stone-200"
                    style={{ fontSize: "0.875rem", fontWeight: 500, color: "#4D4D4D" }}
                  >
                    {t(`${IV}advisorBullet2`)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: ghost CTA */}
            <div className="flex w-full shrink-0 justify-stretch lg:w-auto lg:justify-end lg:self-center">
              <a
                href={ADVISOR_CONTACT_HREF}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border bg-transparent px-6 py-3 transition-colors hover:bg-[#F58220]/[0.08] active:scale-[0.99] sm:w-auto lg:min-w-[11rem] dark:border-amber-400/70 dark:hover:bg-amber-400/10 [&_svg]:shrink-0"
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  borderColor: "#F58220",
                  color: "#A65E00",
                  backgroundColor: "transparent",
                }}
              >
                {t(`${IV}connectNow`)}
                <ArrowRight className="h-4 w-4" style={{ color: "#A65E00" }} aria-hidden />
              </a>
            </div>
          </div>
        </div>

        <div className="pb-2 pt-1" />
      </div>

      {showBuildModal ? (
        <BuildPortfolioModal
          wizardHasCustomPortfolio={customAllocations != null}
          onClose={() => setShowBuildModal(false)}
          defaultFunds={defaultFunds}
          activeSources={activeSources}
          inactiveSources={inactiveSources}
          contributionSources={contributionSources}
          monthlyTotal={monthlyTotal}
          onSave={handleSaveCustom}
        />
      ) : null}
    </div>
  );
}
