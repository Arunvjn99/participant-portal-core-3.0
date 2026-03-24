import { useNavigate } from "react-router";
import { useEnrollment } from "./enrollment-context";
import {
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Pencil,
  Check,
  ShieldCheck,
  X,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Layers,
  Minus,
  Copy,
  Gauge,
  Phone,
  Sparkles,
  TrendingUp,
  Settings,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState, useCallback, useEffect, useRef } from "react";
import sidebarImage from 'figma:asset/2d728293b82e8a1859a0bc8335857b338c59084f.png';

/* ─── Data Types ─── */

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

const sourceLabels: Record<SourceKey, string> = {
  roth: "Roth",
  preTax: "Pre-Tax",
  afterTax: "After-Tax",
};

const sourceFullLabels: Record<SourceKey, string> = {
  roth: "Roth Contributions",
  preTax: "Pre-Tax Contributions",
  afterTax: "After-Tax Contributions",
};

const sourceTaxLabels: Record<SourceKey, string> = {
  roth: "Tax Free",
  preTax: "Tax Deferred",
  afterTax: "Taxable",
};

const sourceColors: Record<SourceKey, string> = {
  roth: "#8b5cf6",
  preTax: "#3b82f6",
  afterTax: "#10b981",
};

const sourceBorderColors: Record<SourceKey, string> = {
  roth: "border-purple-200",
  preTax: "border-blue-200",
  afterTax: "border-green-200",
};

const sourceBgColors: Record<SourceKey, string> = {
  roth: "bg-purple-50",
  preTax: "bg-blue-50",
  afterTax: "bg-green-50",
};

/* ─── Static Data ─── */

const allocations: Record<string, AllocationEntry[]> = {
  conservative: [
    {
      name: "Bonds",
      value: 45,
      color: "#3b82f6",
      funds: [
        { name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" },
        { name: "PIMCO Income Fund", ticker: "PONAX", expense: "0.59%" },
      ],
    },
    {
      name: "US Stocks",
      value: 25,
      color: "#10b981",
      funds: [{ name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" }],
    },
    {
      name: "International Stocks",
      value: 15,
      color: "#8b5cf6",
      funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }],
    },
    {
      name: "Real Estate",
      value: 15,
      color: "#f59e0b",
      funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }],
    },
  ],
  balanced: [
    {
      name: "US Stocks",
      value: 40,
      color: "#10b981",
      funds: [
        { name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" },
        { name: "Vanguard Mid-Cap Index", ticker: "VIMAX", expense: "0.05%" },
      ],
    },
    {
      name: "Bonds",
      value: 25,
      color: "#3b82f6",
      funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }],
    },
    {
      name: "International Stocks",
      value: 20,
      color: "#8b5cf6",
      funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }],
    },
    {
      name: "Real Estate",
      value: 15,
      color: "#f59e0b",
      funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }],
    },
  ],
  growth: [
    {
      name: "US Stocks",
      value: 50,
      color: "#10b981",
      funds: [
        { name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" },
        { name: "Vanguard Growth Index", ticker: "VIGAX", expense: "0.05%" },
      ],
    },
    {
      name: "International Stocks",
      value: 20,
      color: "#8b5cf6",
      funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }],
    },
    {
      name: "Bonds",
      value: 20,
      color: "#3b82f6",
      funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }],
    },
    {
      name: "Real Estate",
      value: 10,
      color: "#f59e0b",
      funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }],
    },
  ],
  aggressive: [
    {
      name: "US Stocks",
      value: 50,
      color: "#10b981",
      funds: [
        { name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" },
        { name: "Vanguard Small-Cap Growth", ticker: "VSGAX", expense: "0.07%" },
      ],
    },
    {
      name: "International Stocks",
      value: 20,
      color: "#8b5cf6",
      funds: [
        { name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" },
        { name: "Vanguard Emerging Markets", ticker: "VEMAX", expense: "0.14%" },
      ],
    },
    {
      name: "Bonds",
      value: 20,
      color: "#3b82f6",
      funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }],
    },
    {
      name: "Real Estate",
      value: 10,
      color: "#f59e0b",
      funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }],
    },
  ],
};

const riskLabels: Record<string, string> = {
  conservative: "Conservative Investor",
  balanced: "Balanced Investor",
  growth: "Growth Investor",
  aggressive: "Aggressive Investor",
};

const riskDescriptions: Record<string, string> = {
  conservative:
    "A focus on capital preservation with steady, predictable returns suited for risk-averse retirement planning.",
  balanced: "A mix of growth and stability designed for long-term retirement investing.",
  growth: "Emphasizes long-term capital appreciation while accepting higher short-term volatility.",
  aggressive:
    "Maximizes growth potential through equity-heavy allocations, suited for longer time horizons.",
};

const expectedGrowth: Record<string, string> = {
  conservative: "~4.5%",
  balanced: "~6.8%",
  growth: "~8.2%",
  aggressive: "~9.5%",
};

const riskLevels = [
  { key: "conservative" as const, label: "Conservative", desc: "Lower risk, steadier returns" },
  { key: "balanced" as const, label: "Balanced", desc: "Moderate risk and growth" },
  { key: "growth" as const, label: "Growth", desc: "Higher growth potential" },
  { key: "aggressive" as const, label: "Aggressive", desc: "Maximum growth potential" },
];

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
      const matchedCategory = alloc.find((cat) => cat.funds.some((f) => f.ticker === fund.ticker));
      if (!matchedCategory) return null;
      const sharePerFund = matchedCategory.value / matchedCategory.funds.length;
      return { ...fund, allocation: Math.round(sharePerFund) };
    })
    .filter((f): f is SourceFundAllocation => f !== null);
}

function fundsToAssetClasses(funds: SourceFundAllocation[]): AllocationEntry[] {
  const grouped: Record<string, { value: number; color: string; funds: FundDetail[] }> = {};
  funds
    .filter((f) => f.allocation > 0)
    .forEach((f) => {
      if (!grouped[f.assetClass]) grouped[f.assetClass] = { value: 0, color: f.color, funds: [] };
      grouped[f.assetClass].value += f.allocation;
      grouped[f.assetClass].funds.push({ name: f.name, ticker: f.ticker, expense: f.expense });
    });
  return Object.entries(grouped).map(([name, d]) => ({ name, value: d.value, color: d.color, funds: d.funds }));
}

function getSourceTotal(funds: SourceFundAllocation[]): number {
  return funds.reduce((s, f) => s + f.allocation, 0);
}

/* ─── Risk Level Calculator ─── */

function computeRiskLevel(funds: SourceFundAllocation[]): { label: string; color: string } {
  const total = funds.reduce((s, f) => s + f.allocation, 0);
  if (total === 0) return { label: "Not Set", color: "text-gray-400" };
  const equityPct = funds
    .filter((f) => f.assetClass === "Equity" || f.assetClass === "International")
    .reduce((s, f) => s + f.allocation, 0);
  if (equityPct >= 70) return { label: "Aggressive", color: "text-red-600" };
  if (equityPct >= 50) return { label: "Growth", color: "text-orange-600" };
  if (equityPct >= 30) return { label: "Balanced", color: "text-blue-600" };
  return { label: "Conservative", color: "text-green-600" };
}

/* ─── Validation Pill ─── */

function AllocationIndicator({ total, label }: { total: number; label?: string }) {
  const isValid = total === 100;
  const diff = total - 100;
  return (
    <div
      className={`flex items-center justify-between rounded-xl px-3.5 py-2 ${
        isValid ? "bg-green-50" : "bg-amber-50"
      }`}
    >
      <div className="flex items-center gap-2">
        {isValid ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
        ) : (
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        )}
        <span
          className={isValid ? "text-green-700" : "text-amber-700"}
          style={{ fontSize: "0.78rem", fontWeight: 500 }}
        >
          {label ? `${label}: ` : ""}
          {isValid ? "Balanced" : diff > 0 ? `${diff}% over` : `${Math.abs(diff)}% remaining`}
        </span>
      </div>
      <span
        className={`tabular-nums ${isValid ? "text-green-800" : "text-amber-800"}`}
        style={{ fontSize: "0.9rem", fontWeight: 700 }}
      >
        {total}%
      </span>
    </div>
  );
}

/* ─── Fund Picker Dropdown ─── */

function FundPicker({
  existingTickers,
  onAdd,
}: {
  existingTickers: string[];
  onAdd: (fund: SourceFundAllocation) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors py-1.5 px-2 rounded-lg hover:bg-blue-50"
        style={{ fontSize: "0.8rem", fontWeight: 500 }}
      >
        <Plus className="w-3.5 h-3.5" /> Add Fund
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-10 bg-white border border-gray-200 rounded-xl shadow-lg w-72 max-h-64 overflow-y-auto">
          {Object.entries(grouped).map(([cls, funds]) => (
            <div key={cls}>
              <p
                className="px-3 pt-2.5 pb-1 text-gray-400 sticky top-0 bg-white"
                style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
              >
                {cls}
              </p>
              {funds.map((fund) => (
                <button
                  key={fund.ticker}
                  onClick={() => {
                    onAdd({ ...fund, allocation: 0 });
                    setOpen(false);
                  }}
                  className="w-full px-3 py-2 hover:bg-gray-50 text-left flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="text-gray-800" style={{ fontSize: "0.8rem" }}>
                      {fund.name}
                    </p>
                    <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>
                      {fund.ticker} · ER: {fund.expense}
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

/* ─── Source Fund List ─── */

function SourceFundList({
  funds,
  onUpdate,
  onRemove,
  onAdd,
}: {
  funds: SourceFundAllocation[];
  onUpdate: (ticker: string, value: number) => void;
  onRemove: (ticker: string) => void;
  onAdd: (fund: SourceFundAllocation) => void;
}) {
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
              className="text-gray-400"
              style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
            >
              {assetClass}
            </p>
          </div>
          <div className="space-y-2">
            {classFunds.map((fund) => (
              <div key={fund.ticker} className="bg-white border border-gray-200 rounded-xl px-3.5 py-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0">
                    <p className="text-gray-900 truncate" style={{ fontSize: "0.82rem", fontWeight: 500 }}>
                      {fund.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-gray-400" style={{ fontSize: "0.68rem" }}>
                        {fund.ticker}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-400" style={{ fontSize: "0.68rem" }}>
                        ER: {fund.expense}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button
                      onClick={() => onUpdate(fund.ticker, Math.max(0, fund.allocation - 1))}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <div className="flex items-center gap-0.5 bg-gray-50 rounded-lg px-2 py-0.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={fund.allocation}
                        onChange={(e) => {
                          const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                          onUpdate(fund.ticker, val);
                        }}
                        className="w-9 text-right bg-transparent border-none outline-none text-gray-900 tabular-nums"
                        style={{ fontSize: "0.85rem", fontWeight: 600 }}
                      />
                      <span className="text-gray-400" style={{ fontSize: "0.78rem" }}>%</span>
                    </div>
                    <button
                      onClick={() => onUpdate(fund.ticker, Math.min(100, fund.allocation + 1))}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRemove(fund.ticker)}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors ml-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={fund.allocation}
                  onChange={(e) => onUpdate(fund.ticker, parseInt(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${fund.color} 0%, ${fund.color} ${fund.allocation}%, #e5e7eb ${fund.allocation}%, #e5e7eb 100%)`,
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

/* ─── Copy Portfolio Menu ─── */

function CopyPortfolioMenu({
  currentSource,
  activeSources,
  contributionSources,
  onCopy,
}: {
  currentSource: SourceKey;
  activeSources: SourceKey[];
  contributionSources: { preTax: number; roth: number; afterTax: number };
  onCopy: (fromSource: SourceKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const otherSources = activeSources.filter((s) => s !== currentSource);
  if (otherSources.length === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors py-1 px-2 rounded-lg hover:bg-gray-100"
        style={{ fontSize: "0.75rem", fontWeight: 500 }}
      >
        <Copy className="w-3 h-3" /> Copy from
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-10 bg-white border border-gray-200 rounded-xl shadow-lg w-52 py-1">
          {otherSources.map((src) => (
            <button
              key={src}
              onClick={() => {
                onCopy(src);
                setOpen(false);
              }}
              className="w-full px-3 py-2 hover:bg-gray-50 text-left flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sourceColors[src] }} />
                <span className="text-gray-700" style={{ fontSize: "0.78rem" }}>
                  {sourceLabels[src]} ({contributionSources[src]}%)
                </span>
              </div>
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Customize Modal ─── */

// Reusable Portfolio Editor Content Component
function PortfolioEditorContent({
  allocs,
  setAllocs,
  activeSources,
  contributionSources,
  activeTab,
  setActiveTab,
}: {
  allocs: PerSourceAllocations;
  setAllocs: React.Dispatch<React.SetStateAction<PerSourceAllocations>>;
  activeSources: SourceKey[];
  contributionSources: { preTax: number; roth: number; afterTax: number };
  activeTab: SourceKey;
  setActiveTab: (tab: SourceKey) => void;
}) {
  const updateUnifiedFund = useCallback((ticker: string, value: number) => {
    setAllocs((prev) => ({
      ...prev,
      unified: prev.unified.map((f) => (f.ticker === ticker ? { ...f, allocation: value } : f)),
    }));
  }, [setAllocs]);

  const removeUnifiedFund = useCallback((ticker: string) => {
    setAllocs((prev) => ({
      ...prev,
      unified: prev.unified.filter((f) => f.ticker !== ticker),
    }));
  }, [setAllocs]);

  const addUnifiedFund = useCallback((fund: SourceFundAllocation) => {
    setAllocs((prev) => ({ ...prev, unified: [...prev.unified, fund] }));
  }, [setAllocs]);

  const updateSourceFund = useCallback((source: SourceKey, ticker: string, value: number) => {
    setAllocs((prev) => ({
      ...prev,
      sources: {
        ...prev.sources,
        [source]: prev.sources[source].map((f) => (f.ticker === ticker ? { ...f, allocation: value } : f)),
      },
    }));
  }, [setAllocs]);

  const removeSourceFund = useCallback((source: SourceKey, ticker: string) => {
    setAllocs((prev) => ({
      ...prev,
      sources: {
        ...prev.sources,
        [source]: prev.sources[source].filter((f) => f.ticker !== ticker),
      },
    }));
  }, [setAllocs]);

  const addSourceFund = useCallback((source: SourceKey, fund: SourceFundAllocation) => {
    setAllocs((prev) => ({
      ...prev,
      sources: {
        ...prev.sources,
        [source]: [...prev.sources[source], fund],
      },
    }));
  }, [setAllocs]);

  const toggleSameForAll = () => {
    setAllocs((prev) => {
      if (prev.sameForAll) {
        const newSources = { ...prev.sources };
        activeSources.forEach((src) => {
          if (newSources[src].length === 0) {
            newSources[src] = prev.unified.map((f) => ({ ...f }));
          }
        });
        return { ...prev, sameForAll: false, sources: newSources };
      } else {
        return { ...prev, sameForAll: true };
      }
    });
  };

  const unifiedTotal = getSourceTotal(allocs.unified);
  const sourceTotals = activeSources.map((src) => ({
    key: src,
    total: getSourceTotal(allocs.sources[src]),
  }));

  const currentFundsForChart = allocs.sameForAll ? allocs.unified : allocs.sources[activeTab];

  const chartData = Object.entries(
    (currentFundsForChart || [])
      .filter((f) => f.allocation > 0)
      .reduce<Record<string, { value: number; color: string }>>((acc, f) => {
        if (!acc[f.assetClass]) acc[f.assetClass] = { value: 0, color: f.color };
        acc[f.assetClass].value += f.allocation;
        return acc;
      }, {})
  ).map(([name, d]) => ({ name, ...d }));

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {/* Same-for-all toggle */}
      {activeSources.length > 1 && (
        <div>
          <button
            onClick={toggleSameForAll}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 border transition-all ${
              allocs.sameForAll
                ? "border-blue-200 bg-blue-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            {allocs.sameForAll ? (
              <ToggleRight className="w-5 h-5 text-blue-600 shrink-0" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-gray-400 shrink-0" />
            )}
            <div className="text-left flex-1">
              <p
                className={allocs.sameForAll ? "text-blue-800" : "text-gray-700"}
                style={{ fontSize: "0.82rem", fontWeight: 500 }}
              >
                Same portfolio for all sources
              </p>
              <p className="text-gray-400" style={{ fontSize: "0.7rem" }}>
                {allocs.sameForAll
                  ? "One allocation applies to all contribution sources."
                  : "Customize each source independently."}
              </p>
            </div>
            {!allocs.sameForAll && (
              <div className="flex items-center gap-1 shrink-0">
                <Layers className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-500" style={{ fontSize: "0.72rem" }}>
                  {activeSources.length} sources
                </span>
              </div>
            )}
          </button>
        </div>
      )}

      {/* Asset Class Summary + Risk Level */}
      {chartData.length > 0 && (
        <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-3">
          <div className="w-14 h-14 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={16}
                  outerRadius={26}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {chartData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-gray-600" style={{ fontSize: "0.72rem" }}>
                    {d.name}:{" "}
                    <span className="text-gray-900" style={{ fontWeight: 600 }}>{d.value}%</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Gauge className="w-3 h-3 text-gray-400" />
              <span className="text-gray-500" style={{ fontSize: "0.68rem" }}>
                Risk:{" "}
                <span className={computeRiskLevel(currentFundsForChart || []).color} style={{ fontWeight: 600 }}>
                  {computeRiskLevel(currentFundsForChart || []).label}
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
              <p className="text-gray-400" style={{ fontSize: "0.85rem" }}>
                No funds selected. Add funds to build your portfolio.
              </p>
              <div className="mt-3 flex justify-center">
                <FundPicker existingTickers={[]} onAdd={addUnifiedFund} />
              </div>
            </div>
          ) : (
            <SourceFundList
              funds={allocs.unified}
              onUpdate={updateUnifiedFund}
              onRemove={removeUnifiedFund}
              onAdd={addUnifiedFund}
            />
          )}
          <div className="mt-4 space-y-2">
            <AllocationIndicator total={unifiedTotal} label="Total Allocation" />
          </div>
        </div>
      ) : (
        <div>
          {/* Source tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
            {activeSources.map((src) => {
              const srcTotal = getSourceTotal(allocs.sources[src]);
              const srcValid = srcTotal === 100;
              return (
                <button
                  key={src}
                  onClick={() => setActiveTab(src)}
                  className={`flex-1 rounded-lg py-2 px-3 transition-all flex items-center justify-center gap-2 ${
                    activeTab === src ? "bg-white shadow-sm" : "hover:bg-gray-50"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: sourceColors[src] }}
                  />
                  <span
                    className={activeTab === src ? "text-gray-900" : "text-gray-500"}
                    style={{ fontSize: "0.8rem", fontWeight: activeTab === src ? 600 : 400 }}
                  >
                    {sourceLabels[src]}
                  </span>
                  {srcTotal > 0 && (
                    <span className={`shrink-0 ${srcValid ? "text-green-600" : "text-amber-600"}`}>
                      {srcValid ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <span style={{ fontSize: "0.65rem", fontWeight: 600 }}>{srcTotal}%</span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: sourceColors[activeTab] }}
                />
                <p className="text-gray-800" style={{ fontSize: "0.88rem", fontWeight: 600 }}>
                  {sourceLabels[activeTab]} Portfolio
                </p>
              </div>
              {activeSources.length > 1 && (
                <CopyPortfolioMenu
                  currentSource={activeTab}
                  activeSources={activeSources}
                  contributionSources={contributionSources}
                  onCopy={(fromSource) => {
                    setAllocs((prev) => ({
                      ...prev,
                      sources: {
                        ...prev.sources,
                        [activeTab]: prev.sources[fromSource].map((f) => ({ ...f })),
                      },
                    }));
                  }}
                />
              )}
            </div>

            {allocs.sources[activeTab].length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-xl">
                <p className="text-gray-400 mb-2" style={{ fontSize: "0.82rem" }}>
                  No funds selected for {sourceLabels[activeTab]}.
                </p>
                <div className="flex justify-center">
                  <FundPicker
                    existingTickers={[]}
                    onAdd={(fund) => addSourceFund(activeTab, fund)}
                  />
                </div>
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
                label={`${sourceLabels[activeTab]} Allocation`}
              />
            </div>
          </div>

          {/* All-source validation summary */}
          <div className="border-t border-gray-100 pt-3 mt-4 space-y-1.5">
            <p
              className="text-gray-400 mb-1"
              style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
            >
              All Sources
            </p>
            {sourceTotals.map((s) => (
              <div
                key={s.key}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg ${
                  s.total === 100 ? "bg-green-50" : "bg-amber-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {s.total === 100 ? (
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                  )}
                  <span
                    className={s.total === 100 ? "text-green-700" : "text-amber-700"}
                    style={{ fontSize: "0.75rem", fontWeight: 500 }}
                  >
                    {sourceLabels[s.key]}
                  </span>
                </div>
                <span
                  className={`tabular-nums ${s.total === 100 ? "text-green-800" : "text-amber-800"}`}
                  style={{ fontSize: "0.8rem", fontWeight: 600 }}
                >
                  {s.total}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CustomizeModal({
  isOpen,
  onClose,
  initialAllocations,
  activeSources,
  contributionSources,
  onSave,
  initialTab,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialAllocations: PerSourceAllocations;
  activeSources: SourceKey[];
  contributionSources: { preTax: number; roth: number; afterTax: number };
  onSave: (allocs: PerSourceAllocations) => void;
  initialTab?: SourceKey;
}) {
  const [allocs, setAllocs] = useState<PerSourceAllocations>(initialAllocations);
  const [activeTab, setActiveTab] = useState<SourceKey>(initialTab || activeSources[0] || "preTax");
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAllocs(initialAllocations);
      setActiveTab(initialTab || activeSources[0] || "preTax");
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialAllocations, activeSources, initialTab]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleReset = () => setAllocs(initialAllocations);

  const unifiedTotal = getSourceTotal(allocs.unified);
  const sourceTotals = activeSources.map((src) => ({
    key: src,
    total: getSourceTotal(allocs.sources[src]),
  }));

  const allValid = allocs.sameForAll
    ? unifiedTotal === 100
    : sourceTotals.every((s) => s.total === 100);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-gray-900" style={{ fontSize: "1.1rem" }}>
              Edit Portfolio
            </h2>
            <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.78rem" }}>
              {allocs.sameForAll
                ? "Set fund allocations for all contribution sources."
                : `Editing ${sourceLabels[activeTab]} contribution portfolio.`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Same-for-all toggle */}
        {activeSources.length > 1 && (
          <div className="px-6 pt-4">
            <button
              onClick={toggleSameForAll}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 border transition-all ${
                allocs.sameForAll
                  ? "border-blue-200 bg-blue-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              {allocs.sameForAll ? (
                <ToggleRight className="w-5 h-5 text-blue-600 shrink-0" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-gray-400 shrink-0" />
              )}
              <div className="text-left flex-1">
                <p
                  className={allocs.sameForAll ? "text-blue-800" : "text-gray-700"}
                  style={{ fontSize: "0.82rem", fontWeight: 500 }}
                >
                  Same portfolio for all sources
                </p>
                <p className="text-gray-400" style={{ fontSize: "0.7rem" }}>
                  {allocs.sameForAll
                    ? "One allocation applies to all contribution sources."
                    : "Customize each source independently."}
                </p>
              </div>
              {!allocs.sameForAll && (
                <div className="flex items-center gap-1 shrink-0">
                  <Layers className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-500" style={{ fontSize: "0.72rem" }}>
                    {activeSources.length} sources
                  </span>
                </div>
              )}
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Asset Class Summary + Risk Level */}
          {chartData.length > 0 && (
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-3">
              <div className="w-14 h-14 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={16}
                      outerRadius={26}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {chartData.map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-gray-600" style={{ fontSize: "0.72rem" }}>
                        {d.name}:{" "}
                        <span className="text-gray-900" style={{ fontWeight: 600 }}>{d.value}%</span>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Gauge className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-500" style={{ fontSize: "0.68rem" }}>
                    Risk:{" "}
                    <span className={computeRiskLevel(currentFundsForChart || []).color} style={{ fontWeight: 600 }}>
                      {computeRiskLevel(currentFundsForChart || []).label}
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
                  <p className="text-gray-400" style={{ fontSize: "0.85rem" }}>
                    No funds selected. Add funds to build your portfolio.
                  </p>
                  <div className="mt-3 flex justify-center">
                    <FundPicker existingTickers={[]} onAdd={addUnifiedFund} />
                  </div>
                </div>
              ) : (
                <SourceFundList
                  funds={allocs.unified}
                  onUpdate={updateUnifiedFund}
                  onRemove={removeUnifiedFund}
                  onAdd={addUnifiedFund}
                />
              )}
              <div className="mt-4 space-y-2">
                <AllocationIndicator total={unifiedTotal} label="Total Allocation" />
              </div>
            </div>
          ) : (
            <div>
              {/* Source tabs */}
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
                {activeSources.map((src) => {
                  const srcTotal = getSourceTotal(allocs.sources[src]);
                  const srcValid = srcTotal === 100;
                  return (
                    <button
                      key={src}
                      onClick={() => setActiveTab(src)}
                      className={`flex-1 rounded-lg py-2 px-3 transition-all flex items-center justify-center gap-2 ${
                        activeTab === src ? "bg-white shadow-sm" : "hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: sourceColors[src] }}
                      />
                      <span
                        className={activeTab === src ? "text-gray-900" : "text-gray-500"}
                        style={{ fontSize: "0.8rem", fontWeight: activeTab === src ? 600 : 400 }}
                      >
                        {sourceLabels[src]}
                      </span>
                      {srcTotal > 0 && (
                        <span className={`shrink-0 ${srcValid ? "text-green-600" : "text-amber-600"}`}>
                          {srcValid ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <span style={{ fontSize: "0.65rem", fontWeight: 600 }}>{srcTotal}%</span>
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: sourceColors[activeTab] }}
                    />
                    <p className="text-gray-800" style={{ fontSize: "0.88rem", fontWeight: 600 }}>
                      {sourceLabels[activeTab]} Portfolio
                    </p>
                  </div>
                  {activeSources.length > 1 && (
                    <CopyPortfolioMenu
                      currentSource={activeTab}
                      activeSources={activeSources}
                      contributionSources={contributionSources}
                      onCopy={(fromSource) => {
                        setAllocs((prev) => ({
                          ...prev,
                          sources: {
                            ...prev.sources,
                            [activeTab]: prev.sources[fromSource].map((f) => ({ ...f })),
                          },
                        }));
                      }}
                    />
                  )}
                </div>

                {allocs.sources[activeTab].length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-xl">
                    <p className="text-gray-400 mb-2" style={{ fontSize: "0.82rem" }}>
                      No funds selected for {sourceLabels[activeTab]}.
                    </p>
                    <div className="flex justify-center">
                      <FundPicker
                        existingTickers={[]}
                        onAdd={(fund) => addSourceFund(activeTab, fund)}
                      />
                    </div>
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
                    label={`${sourceLabels[activeTab]} Allocation`}
                  />
                </div>
              </div>

              {/* All-source validation summary */}
              <div className="border-t border-gray-100 pt-3 mt-4 space-y-1.5">
                <p
                  className="text-gray-400 mb-1"
                  style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
                >
                  All Sources
                </p>
                {sourceTotals.map((s) => (
                  <div
                    key={s.key}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg ${
                      s.total === 100 ? "bg-green-50" : "bg-amber-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {s.total === 100 ? (
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                      )}
                      <span
                        className={s.total === 100 ? "text-green-700" : "text-amber-700"}
                        style={{ fontSize: "0.75rem", fontWeight: 500 }}
                      >
                        {sourceLabels[s.key]}
                      </span>
                    </div>
                    <span
                      className={`tabular-nums ${s.total === 100 ? "text-green-800" : "text-amber-800"}`}
                      style={{ fontSize: "0.8rem", fontWeight: 600 }}
                    >
                      {s.total}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors px-3 py-2"
              style={{ fontSize: "0.82rem", fontWeight: 500 }}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <div className="flex-1" />
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              style={{ fontSize: "0.85rem", fontWeight: 500 }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (allValid) onSave(allocs);
              }}
              disabled={!allValid}
              className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
                allValid
                  ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              style={{ fontSize: "0.85rem", fontWeight: 500 }}
            >
              <Check className="w-4 h-4" /> Save Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Source Card ─── */

function SourceCard({
  sourceKey,
  monthlyAmount,
  funds,
  isCustomized,
  onEditPortfolio,
}: {
  sourceKey: SourceKey;
  monthlyAmount: number;
  funds: SourceFundAllocation[];
  isCustomized: boolean;
  onEditPortfolio: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const activeFunds = funds.filter((f) => f.allocation > 0);
  const fundCount = activeFunds.length;

  // Asset class summary
  const assetSummary = Object.entries(
    activeFunds.reduce<Record<string, { value: number; color: string }>>((acc, f) => {
      if (!acc[f.assetClass]) acc[f.assetClass] = { value: 0, color: f.color };
      acc[f.assetClass].value += f.allocation;
      return acc;
    }, {})
  ).map(([name, d]) => ({ name, ...d }));

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${sourceBorderColors[sourceKey]}`}>
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: sourceColors[sourceKey] }}
              />
              <p className="text-gray-900" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                {sourceFullLabels[sourceKey]}
              </p>
              <span
                className={`${sourceBgColors[sourceKey]} px-1.5 py-0.5 rounded`}
                style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.03em" }}
              >
                <span style={{ color: sourceColors[sourceKey] }}>{sourceTaxLabels[sourceKey]}</span>
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-gray-700" style={{ fontSize: "0.82rem", fontWeight: 500 }}>
                ${Math.round(monthlyAmount).toLocaleString()}/mo
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-500" style={{ fontSize: "0.78rem" }}>
                {fundCount} {fundCount === 1 ? "fund" : "funds"}
              </span>
              {isCustomized && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="text-blue-600" style={{ fontSize: "0.72rem", fontWeight: 500 }}>
                    Customized
                  </span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onEditPortfolio}
            className="shrink-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            style={{ fontSize: "0.82rem", fontWeight: 500 }}
          >
            <Pencil className="w-3.5 h-3.5 inline mr-1.5" />
            Edit
          </button>
        </div>

        {/* Asset class summary bars */}
        {assetSummary.length > 0 && (
          <div className="mt-3">
            {/* Stacked bar */}
            <div className="flex rounded-full h-2 overflow-hidden">
              {assetSummary.map((a) => (
                <div
                  key={a.name}
                  style={{ width: `${a.value}%`, backgroundColor: a.color }}
                  className="transition-all"
                />
              ))}
            </div>
            {/* Labels */}
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2">
              {assetSummary.map((a) => (
                <div key={a.name} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                  <span className="text-gray-500" style={{ fontSize: "0.68rem" }}>
                    {a.name}{" "}
                    <span className="text-gray-700" style={{ fontWeight: 600 }}>{a.value}%</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fund preview */}
        {activeFunds.length > 0 && (
          <div className="mt-2.5 space-y-0.5">
            {activeFunds.slice(0, 2).map((fund) => (
              <p key={fund.ticker} className="text-gray-500 truncate" style={{ fontSize: "0.72rem" }}>
                {fund.name}
              </p>
            ))}
            {activeFunds.length > 2 && (
              <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>
                +{activeFunds.length - 2} more {activeFunds.length - 2 === 1 ? "fund" : "funds"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Expandable fund details */}
      {fundCount > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full border-t border-gray-100 px-4 py-2 flex items-center justify-center gap-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            style={{ fontSize: "0.75rem", fontWeight: 500 }}
          >
            {expanded ? "Hide" : "View"} funds
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {expanded && (
            <div className="border-t border-gray-100 px-4 py-3 space-y-2">
              {activeFunds.map((fund) => (
                <div key={fund.ticker} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-gray-700" style={{ fontSize: "0.78rem" }}>
                      {fund.name}
                    </p>
                    <p className="text-gray-400" style={{ fontSize: "0.65rem" }}>
                      {fund.ticker} · ER: {fund.expense}
                    </p>
                  </div>
                  <span className="text-gray-900 tabular-nums" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                    {fund.allocation}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Inactive Source Card ─── */

function InactiveSourceCard({ sourceKey }: { sourceKey: SourceKey }) {
  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3.5 flex items-center gap-3 opacity-60">
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: sourceColors[sourceKey] }}
      />
      <div>
        <p className="text-gray-500" style={{ fontSize: "0.85rem", fontWeight: 500 }}>
          {sourceFullLabels[sourceKey]}
        </p>
        <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>
          Not currently used
        </p>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */

export function InvestmentStrategy() {
  const navigate = useNavigate();
  const { data, updateData, personalization, setCurrentStep } = useEnrollment();
  const [showRiskEditor, setShowRiskEditor] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showBuildPortfolioModal, setShowBuildPortfolioModal] = useState(false);
  const [editingSource, setEditingSource] = useState<SourceKey | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<SourceKey>("preTax");
  const [customAllocations, setCustomAllocations] = useState<PerSourceAllocations | null>(null);
  const [inlineAllocs, setInlineAllocs] = useState<PerSourceAllocations | null>(null);
  const [inlineActiveTab, setInlineActiveTab] = useState<SourceKey>("preTax");

  const currentAllocation = allocations[data.riskLevel];
  const defaultFunds = buildFundsFromRecommended(currentAllocation);

  // Determine active contribution sources
  const activeSources: SourceKey[] = [];
  if (data.contributionSources.roth > 0) activeSources.push("roth");
  if (data.contributionSources.preTax > 0) activeSources.push("preTax");
  if (data.supportsAfterTax && data.contributionSources.afterTax > 0) activeSources.push("afterTax");
  if (activeSources.length === 0) activeSources.push("preTax");

  // All possible sources for showing inactive
  const allSources: SourceKey[] = ["roth", "preTax", "afterTax"];
  const inactiveSources = allSources.filter(
    (s) => !activeSources.includes(s) && (s !== "afterTax" || data.supportsAfterTax)
  );

  // Get funds for a specific source
  const getFundsForSource = (src: SourceKey): SourceFundAllocation[] => {
    if (!customAllocations) return defaultFunds;
    if (customAllocations.sameForAll) return customAllocations.unified;
    return customAllocations.sources[src];
  };

  // Check if a source has been customized
  const isSourceCustomized = (src: SourceKey): boolean => {
    if (!customAllocations) return false;
    return true;
  };

  // Monthly contribution per source
  const monthlyTotal = (data.salary * data.contributionPercent) / 100 / 12;
  const getMonthlyForSource = (src: SourceKey): number => {
    const pct = data.contributionSources[src];
    return monthlyTotal * (pct / 100);
  };

  const handleNext = () => {
    updateData({ useRecommendedPortfolio: !customAllocations });
    setCurrentStep(6);
    navigate("/readiness");
  };

  const handleOpenCustomize = (sourceKey: SourceKey) => {
    const initial: PerSourceAllocations = customAllocations || {
      sameForAll: activeSources.length === 1,
      unified: defaultFunds.map((f) => ({ ...f })),
      sources: {
        roth: defaultFunds.map((f) => ({ ...f })),
        preTax: defaultFunds.map((f) => ({ ...f })),
        afterTax: defaultFunds.map((f) => ({ ...f })),
      },
    };
    
    // If we're in the Build Portfolio Modal, show inline editor
    if (showBuildPortfolioModal) {
      setInlineAllocs(initial);
      setInlineActiveTab(sourceKey);
      setEditingSource(sourceKey);
    } else {
      // Otherwise, open the standalone modal
      setCustomAllocations(initial);
      setModalInitialTab(sourceKey);
      setShowCustomizeModal(true);
    }
  };

  const handleSaveCustom = (allocs: PerSourceAllocations) => {
    setCustomAllocations(allocs);
    setShowCustomizeModal(false);
  };

  const handleSaveInline = () => {
    if (inlineAllocs) {
      setCustomAllocations(inlineAllocs);
    }
    setEditingSource(null);
  };

  const handleCloseInline = () => {
    setEditingSource(null);
    setInlineAllocs(null);
  };

  // Compute blended overall allocation for the sidebar
  const overallAllocationData = (() => {
    const totalContrib = activeSources.reduce(
      (sum, src) => sum + data.contributionSources[src],
      0
    );
    if (totalContrib === 0) return [];

    const blended: Record<string, { value: number; color: string }> = {};
    activeSources.forEach((src) => {
      const weight = data.contributionSources[src] / totalContrib;
      const funds = getFundsForSource(src).filter((f) => f.allocation > 0);
      funds.forEach((f) => {
        if (!blended[f.assetClass]) blended[f.assetClass] = { value: 0, color: f.color };
        blended[f.assetClass].value += f.allocation * weight;
      });
    });

    return Object.entries(blended)
      .map(([name, d]) => ({ name, value: Math.round(d.value), color: d.color }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  })();

  // Compute overall portfolio risk level from blended funds
  const overallRiskLevel = (() => {
    const totalContrib = activeSources.reduce(
      (sum, src) => sum + data.contributionSources[src],
      0
    );
    if (totalContrib === 0) return { label: "Not Set", color: "text-gray-400" };
    const allFundsBlended: SourceFundAllocation[] = [];
    activeSources.forEach((src) => {
      const weight = data.contributionSources[src] / totalContrib;
      getFundsForSource(src)
        .filter((f) => f.allocation > 0)
        .forEach((f) => {
          allFundsBlended.push({ ...f, allocation: f.allocation * weight });
        });
    });
    return computeRiskLevel(allFundsBlended);
  })();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header — full width */}
      <div className="mb-5">
        <button
          onClick={() => {
            setCurrentStep(4);
            navigate(data.autoIncrease ? "/auto-increase-setup" : "/auto-increase");
          }}
          className="flex items-center gap-1 text-gray-500 mb-3 hover:text-gray-700"
          style={{ fontSize: "0.85rem" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-gray-900">Your Investment Strategy</h1>
        <p className="text-gray-500 mt-1" style={{ fontSize: "0.9rem" }}>
          See how each contribution source is invested.
        </p>
      </div>

      <div className="space-y-5">
        {/* Investment Style Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Gauge className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p
                  className="text-gray-400"
                  style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
                >
                  Investment Style
                </p>
                <p className="text-gray-900" style={{ fontSize: "1.05rem", fontWeight: 700 }}>
                  {riskLabels[data.riskLevel]}
                </p>
                <p className="text-gray-500 mt-0.5" style={{ fontSize: "0.78rem" }}>
                  {riskDescriptions[data.riskLevel]}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRiskEditor(!showRiskEditor)}
              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors shrink-0"
              style={{ fontSize: "0.82rem", fontWeight: 500 }}
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Investment Strategy
            </button>
          </div>

          {showRiskEditor && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-4 gap-2.5">
                {riskLevels.map((level) => (
                  <button
                    key={level.key}
                    onClick={() => {
                      updateData({ riskLevel: level.key });
                      setShowRiskEditor(false);
                      setCustomAllocations(null);
                    }}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      data.riskLevel === level.key
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <p
                      className={data.riskLevel === level.key ? "text-blue-700" : "text-gray-900"}
                      style={{ fontWeight: 600, fontSize: "0.85rem" }}
                    >
                      {level.label}
                    </p>
                    <p className="text-gray-500 mt-0.5" style={{ fontSize: "0.72rem" }}>
                      {level.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Plan Default Investment and Advisor Cards - 60/40 Split */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "60% 40%" }}>
          {/* Plan Default Investment Card - 60% */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              {/* Header with Badge, Title, and Metrics */}
              <div className="flex items-start justify-between gap-6 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="px-2.5 py-1 bg-blue-100 rounded-md">
                      <p className="text-blue-700" style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Recommended
                      </p>
                    </div>
                  </div>
                  <h3 className="text-gray-900" style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                    Plan Default Investment
                  </h3>
                  <p className="text-gray-600 mt-1" style={{ fontSize: "0.8rem" }}>
                    Professionally managed, diversified portfolio
                  </p>
                </div>

                {/* Key Metrics - Compact */}
                <div className="bg-gray-50 rounded-lg px-4 py-3 space-y-1.5 shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600" style={{ fontSize: "0.75rem" }}>Return:</span>
                    <span className="text-gray-900" style={{ fontSize: "0.75rem", fontWeight: 600 }}>~6–7%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600" style={{ fontSize: "0.75rem" }}>Risk:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-900" style={{ fontSize: "0.75rem", fontWeight: 600 }}>Low</span>
                      <div className="flex gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-900"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600" style={{ fontSize: "0.75rem" }}>Timeline:</span>
                    <span className="text-gray-900" style={{ fontSize: "0.75rem", fontWeight: 600 }}>10+ years</span>
                  </div>
                </div>
              </div>

              {/* Allocation Preview */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="space-y-2.5">
                  {currentAllocation.map((a) => (
                    <div key={a.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                        <span className="text-gray-700" style={{ fontSize: "0.8rem" }}>
                          {a.name}
                        </span>
                      </div>
                      <span className="text-gray-900 tabular-nums" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                        {a.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why this works */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
                <p className="text-blue-900 mb-1" style={{ fontSize: "0.78rem", fontWeight: 600 }}>
                  Why this works for you:
                </p>
                <p className="text-blue-800" style={{ fontSize: "0.75rem", lineHeight: 1.5 }}>
                  Balanced for growth with your retirement timeline
                </p>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleNext}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                style={{ fontSize: "0.85rem", fontWeight: 600 }}
              >
                Continue with recommended plan <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          {/* Customize Portfolio Card - 40% */}
          <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 border border-purple-200 rounded-2xl p-6 flex flex-col shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div className="px-2.5 py-1 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-md">
                <p className="text-purple-700" style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Advanced User
                </p>
              </div>
            </div>
            
            <h3 className="text-gray-900 mb-2" style={{ fontSize: "1rem", fontWeight: 700 }}>
              Customize your portfolio
            </h3>
            <p className="text-gray-700 mb-3" style={{ fontSize: "0.82rem", lineHeight: 1.6 }}>
              Adjust your investment allocation based on your preferences and risk tolerance.
            </p>

            <p className="text-gray-800 mb-4 flex-1" style={{ fontSize: "0.82rem", lineHeight: 1.5, fontWeight: 500 }}>
              Best for experienced investors who want more control over their portfolio.
            </p>

            <button
              onClick={() => setShowBuildPortfolioModal(true)}
              className="w-full border-2 border-purple-300 text-purple-700 py-2.5 px-6 rounded-xl hover:bg-purple-50 hover:border-purple-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              style={{ fontSize: "0.85rem", fontWeight: 600 }}
            >
              Customize my portfolio <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Advisor Card - Full Width */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl border border-amber-200 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-amber-700" style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Expert Help
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-between gap-6">
              <div>
                <h3 className="text-gray-900 mb-2" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Need Guidance? Contact Advisor</h3>
                <p className="text-gray-600 mb-3" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
                  Get help from a certified financial advisor to choose the right investment strategy for your goals.
                </p>
                <div className="flex gap-6">
                  
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700" style={{ fontSize: "0.75rem" }}>Certified professionals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700" style={{ fontSize: "0.75rem" }}>Custom portfolio analysis</span>
                  </div>
                </div>
              </div>
              
              <button
                className="border-2 border-amber-500 text-amber-700 py-2.5 px-6 rounded-xl hover:bg-amber-50 transition-all flex items-center gap-2 shrink-0"
                style={{ fontSize: "0.85rem", fontWeight: 500 }}
              >
                Connect Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Continue CTA */}
        <div className="pt-1 pb-2">
          
          
        </div>
      </div>

      {/* Customize Modal */}
      <CustomizeModal
        isOpen={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        initialAllocations={
          customAllocations || {
            sameForAll: activeSources.length === 1,
            unified: defaultFunds.map((f) => ({ ...f })),
            sources: {
              roth: defaultFunds.map((f) => ({ ...f })),
              preTax: defaultFunds.map((f) => ({ ...f })),
              afterTax: defaultFunds.map((f) => ({ ...f })),
            },
          }
        }
        activeSources={activeSources}
        contributionSources={data.contributionSources}
        onSave={handleSaveCustom}
        initialTab={modalInitialTab}
      />

      {/* Build Portfolio Modal */}
      {showBuildPortfolioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-gray-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                    Build Custom Portfolio
                  </h2>
                </div>
                <p className="text-gray-500" style={{ fontSize: "0.85rem" }}>
                  {editingSource
                    ? `Customizing ${sourceFullLabels[editingSource]} allocation`
                    : "Select a source to customize its investment allocation"}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowBuildPortfolioModal(false);
                  setEditingSource(null);
                  setInlineAllocs(null);
                }}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content - Two Column Layout */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* Left Column - Contribution Sources */}
              <div className={`${editingSource ? "md:w-2/5" : "w-full"} border-r border-gray-200 overflow-y-auto px-6 py-5 transition-all`}>
                <div>
                  <p className="text-gray-900 mb-4" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                    Your Contribution Sources
                  </p>
                  <div className="space-y-3">
                    {activeSources.map((src) => (
                      <SourceCard
                        key={src}
                        sourceKey={src}
                        monthlyAmount={getMonthlyForSource(src)}
                        funds={getFundsForSource(src)}
                        isCustomized={isSourceCustomized(src)}
                        onEditPortfolio={() => handleOpenCustomize(src)}
                      />
                    ))}
                    {inactiveSources.map((src) => (
                      <InactiveSourceCard key={src} sourceKey={src} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Portfolio Editor (shown when editing) */}
              {editingSource && inlineAllocs && (
                <div className="flex-1 flex flex-col md:w-3/5 bg-gray-50">
                  {/* Editor Header */}
                  <div className="px-6 py-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: sourceColors[editingSource] }}
                        />
                        <h3 className="text-gray-900" style={{ fontSize: "1rem", fontWeight: 600 }}>
                          Customize {sourceFullLabels[editingSource]}
                        </h3>
                      </div>
                      <button
                        onClick={handleCloseInline}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        style={{ fontSize: "0.82rem", fontWeight: 500 }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Editor Content */}
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    <PortfolioEditorContent
                      allocs={inlineAllocs}
                      setAllocs={setInlineAllocs}
                      activeSources={activeSources}
                      contributionSources={data.contributionSources}
                      activeTab={inlineActiveTab}
                      setActiveTab={setInlineActiveTab}
                    />
                  </div>

                  {/* Editor Footer */}
                  <div className="px-6 py-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleCloseInline}
                        className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                        style={{ fontSize: "0.85rem", fontWeight: 500 }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveInline}
                        className="flex-1 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        style={{ fontSize: "0.85rem", fontWeight: 500 }}
                      >
                        <Check className="w-4 h-4" /> Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowBuildPortfolioModal(false);
                  setEditingSource(null);
                  setInlineAllocs(null);
                }}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                style={{ fontSize: "0.9rem", fontWeight: 600 }}
              >
                Done <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}