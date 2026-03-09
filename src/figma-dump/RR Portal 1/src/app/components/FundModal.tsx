import { motion } from "motion/react";
import { X, Plus, Search, TrendingUp } from "lucide-react";
import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Fund {
  id: string;
  name: string;
  ticker: string;
  category: string;
  riskLevel: number;
  allocation: number;
}

interface AvailableFund {
  id: string;
  name: string;
  ticker: string;
  category: string;
  expenseRatio: string;
  riskLevel: number;
}

const AVAILABLE_FUNDS: AvailableFund[] = [
  {
    id: "sp500",
    name: "S&P 500 Index Fund",
    ticker: "SP500",
    category: "US Large Cap",
    expenseRatio: "0.03%",
    riskLevel: 5,
  },
  {
    id: "tsm",
    name: "Total Stock Market Index",
    ticker: "TSM",
    category: "US Large Cap",
    expenseRatio: "0.04%",
    riskLevel: 5,
  },
  {
    id: "mcg",
    name: "Mid Cap Growth Fund",
    ticker: "MCG",
    category: "US Mid Cap",
    expenseRatio: "0.45%",
    riskLevel: 6,
  },
  {
    id: "scv",
    name: "Small Cap Value Fund",
    ticker: "SCV",
    category: "US Small Cap",
    expenseRatio: "0.38%",
    riskLevel: 7,
  },
  {
    id: "intl",
    name: "International Stock Index",
    ticker: "INTL",
    category: "International",
    expenseRatio: "0.08%",
    riskLevel: 6,
  },
  {
    id: "em",
    name: "Emerging Markets Fund",
    ticker: "EM",
    category: "International",
    expenseRatio: "0.12%",
    riskLevel: 8,
  },
  {
    id: "bond",
    name: "Total Bond Market Index",
    ticker: "BOND",
    category: "Bonds",
    expenseRatio: "0.03%",
    riskLevel: 2,
  },
];

interface FundModalProps {
  isOpen: boolean;
  accountType: 'preTax' | 'roth' | 'afterTax';
  funds: Fund[];
  onClose: () => void;
  onSave: () => void;
  onUpdateAllocation: (fundId: string, newAllocation: number) => void;
  onRemoveFund: (fundId: string) => void;
  onAddFund: (fund: { id: string; name: string; ticker: string; category: string; riskLevel: number }) => void;
  getTotalAllocation: () => number;
  getAccountTypeLabel: () => string;
}

export function FundModal({
  isOpen,
  accountType,
  funds,
  onClose,
  onSave,
  onUpdateAllocation,
  onRemoveFund,
  onAddFund,
  getTotalAllocation,
  getAccountTypeLabel,
}: FundModalProps) {
  const [showAddSection, setShowAddSection] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Color palette for chart lines
  const chartColors = ['#0043AA', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  // Generate performance data for chart
  const performanceData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => {
      const dataPoint: any = { month, id: `month-${index}` };
      funds.forEach(fund => {
        // Generate mock performance based on risk level and allocation
        const baseReturn = 100;
        const volatility = fund.riskLevel * 0.8;
        const trend = index * (fund.riskLevel * 0.5);
        const randomness = Math.sin(index * fund.riskLevel) * volatility;
        dataPoint[fund.ticker] = baseReturn + trend + randomness;
      });
      return dataPoint;
    });
  }, [funds]);

  const totalAllocation = getTotalAllocation();
  const addedFundIds = funds.map(f => f.id);

  const filteredAvailableFunds = AVAILABLE_FUNDS.filter((fund) => {
    const query = searchQuery.toLowerCase();
    return (
      fund.name.toLowerCase().includes(query) ||
      fund.ticker.toLowerCase().includes(query) ||
      fund.category.toLowerCase().includes(query)
    );
  });

  const handleAddFund = (fund: AvailableFund) => {
    if (!addedFundIds.includes(fund.id)) {
      onAddFund(fund);
      setShowAddSection(false);
      setSearchQuery("");
    }
  };
  
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white px-3 py-3 flex items-center justify-between border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{getAccountTypeLabel()}</h2>
              <p className="text-xs text-gray-500">Manage your investment allocation</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="px-3 py-3 space-y-3 max-h-[calc(85vh-150px)] overflow-y-auto">
            {/* Performance Chart */}
            {funds.length > 0 && (
              null
            )}

            {/* Search and Add Investment */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search funds..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0043AA] focus:border-transparent focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddSection(!showAddSection)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  showAddSection 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-[#0043AA] text-white hover:bg-[#00358A] shadow-sm'
                }`}
              >
                {showAddSection ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                Add Investment
              </motion.button>
            </div>

            {/* Available Funds Section */}
            {showAddSection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 bg-blue-50/50 border border-blue-100 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0043AA] flex items-center justify-center">
                    <Search className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Available Investments</h3>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredAvailableFunds.map((fund) => {
                    const isAdded = addedFundIds.includes(fund.id);
                    return (
                      <div key={fund.id} className="bg-white rounded-lg border border-gray-200 p-2.5 hover:border-[#0043AA]/30 transition-all">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-gray-900 truncate">{fund.name}</h4>
                              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded flex-shrink-0">
                                {fund.ticker}
                              </span>
                              <span className="text-xs text-gray-500">{fund.category}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Risk Level */}
                            <div className="flex items-center gap-1.5">
                              {/* Mini Line Graph */}
                              <svg width="16" height="12" viewBox="0 0 16 12" className="flex-shrink-0">
                                <polyline
                                  points="0,10 4,7 8,4 12,6 16,2"
                                  fill="none"
                                  stroke="#6B7280"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              {/* Vertical Bars */}
                              <div className="flex gap-0.5">
                                {[...Array(4)].map((_, i) => (
                                  <div 
                                    key={i} 
                                    className={`w-1 h-3 ${
                                      i < Math.ceil(fund.riskLevel / 2.5) ? 'bg-[#0043AA]' : 'bg-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                            </div>
                            {/* Add button */}
                            <motion.button
                              whileHover={{ scale: isAdded ? 1 : 1.05 }}
                              whileTap={{ scale: isAdded ? 1 : 0.95 }}
                              onClick={() => handleAddFund(fund)}
                              disabled={isAdded}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                isAdded
                                  ? 'bg-green-100 text-green-700 cursor-default'
                                  : 'bg-[#0043AA] text-white hover:bg-[#00358A]'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Added
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  Add
                                </>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Fund Items */}
            {funds.length > 0 && (
              <div className="space-y-2">
                {funds.map((fund) => (
                  <div key={fund.id} className="bg-gray-50/50 rounded-lg border border-gray-200 p-3 hover:border-[#0043AA]/30 transition-all">
                    {/* Fund Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[#0043AA] flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-gray-900 truncate">{fund.name}</h3>
                            <span className="px-1.5 py-0.5 bg-[#0043AA] text-white text-xs font-bold rounded flex-shrink-0">
                              {fund.ticker}
                            </span>
                            <span className="text-xs text-gray-500">{fund.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Risk bars */}
                        <div className="flex items-center gap-1.5">
                          {/* Mini Line Graph */}
                          <svg width="16" height="12" viewBox="0 0 16 12" className="flex-shrink-0">
                            <polyline
                              points="0,10 4,7 8,4 12,6 16,2"
                              fill="none"
                              stroke="#6B7280"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {/* Vertical Bars */}
                          <div className="flex gap-0.5">
                            {[...Array(4)].map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-1 h-3 ${
                                  i < Math.ceil(fund.riskLevel / 2.5) ? 'bg-[#0043AA]' : 'bg-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                        {/* Remove button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onRemoveFund(fund.id)}
                          className="w-6 h-6 rounded-lg bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-gray-500 hover:text-red-600" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Slider and Percentage */}
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={fund.allocation}
                        onChange={(e) => onUpdateAllocation(fund.id, Number(e.target.value))}
                        className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0043AA] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#0043AA] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                        style={{
                          background: `linear-gradient(to right, #0043AA 0%, #0043AA ${fund.allocation}%, #e5e7eb ${fund.allocation}%, #e5e7eb 100%)`
                        }}
                      />
                      <div className="flex items-center gap-0.5 min-w-[75px]">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={fund.allocation.toFixed(1)}
                          onChange={(e) => onUpdateAllocation(fund.id, Math.max(0, Math.min(100, Number(e.target.value))))}
                          className="w-[60px] px-2 py-1.5 text-center text-sm font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0043AA] focus:border-transparent focus:bg-white transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-gray-900 font-bold text-sm">%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total Allocation */}
            {funds.length > 0 && (
              <div className={`rounded-lg border p-2 ${
              totalAllocation === 100 
                ? 'bg-green-50/50 border-green-200' 
                : totalAllocation > 100
                  ? 'bg-red-50/50 border-red-200'
                  : 'bg-amber-50/50 border-amber-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Total Allocation</p>
                  {totalAllocation !== 100 && (
                    <p className={`text-xs font-medium ${
                      totalAllocation > 100 ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {totalAllocation > 100 
                        ? `Reduce by ${(totalAllocation - 100).toFixed(1)}%` 
                        : `Add ${(100 - totalAllocation).toFixed(1)}% to reach 100%`
                      }
                    </p>
                  )}
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className={`text-lg font-bold ${
                    totalAllocation === 100 
                      ? 'text-green-600' 
                      : totalAllocation > 100
                        ? 'text-red-600'
                        : 'text-amber-600'
                  }`}>
                    {totalAllocation.toFixed(1)}
                  </span>
                  <span className={`text-sm font-bold ${
                    totalAllocation === 100 
                      ? 'text-green-600' 
                      : totalAllocation > 100
                        ? 'text-red-600'
                        : 'text-amber-600'
                  }`}>%</span>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-3 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {totalAllocation === 100 ? '✓ Ready to save' : 'Allocation must equal 100%'}
            </p>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: totalAllocation === 100 ? 1.02 : 1 }}
                whileTap={{ scale: totalAllocation === 100 ? 0.98 : 1 }}
                onClick={totalAllocation === 100 ? onSave : undefined}
                disabled={totalAllocation !== 100}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  totalAllocation === 100
                    ? 'bg-[#0043AA] text-white hover:bg-[#00358A] shadow-sm cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Save Changes
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
