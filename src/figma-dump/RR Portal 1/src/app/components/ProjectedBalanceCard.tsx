import { TrendingUp, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ProjectedBalanceCardProps {
  totalBalance: number;
  netFlow: number;
  monthImpact: number;
}

export function ProjectedBalanceCard({ 
  totalBalance, 
  netFlow, 
  monthImpact 
}: ProjectedBalanceCardProps) {
  // Sample data for the chart
  const chartData = [
    { month: "Sep", balance: 132000, inflow: 130000 },
    { month: "Oct", balance: 135000, inflow: 133000 },
    { month: "Nov", balance: 138000, inflow: 136000 },
    { month: "Dec", balance: 141000, inflow: 139000 },
    { month: "Jan", balance: 144000, inflow: 142000 },
    { month: "Feb", balance: 147000, inflow: 145000 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Balance Info */}
        <div className="space-y-6">
          <div>
            <div className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-4">
              Projected Retirement Balance
            </div>
            
            <div className="mb-2">
              <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                Total Balance
              </div>
              <div className="text-5xl font-bold text-gray-900">
                ${totalBalance.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {/* Net Flow */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <div className="text-sm text-gray-600">Net Flow (YTD this month)</div>
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                +${netFlow.toLocaleString()}
              </div>
            </div>

            {/* 12-Mo Impact */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <div className="text-sm text-gray-600">12-Mo Impact</div>
              </div>
              <div className="text-2xl font-bold text-indigo-600">
                +${monthImpact.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Chart */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" rx="2" fill="#E5E7EB"/>
                <path d="M5 8H11" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 5V11" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="font-medium">Growth & Contribution Analysis</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <span className="text-xs text-gray-600">Balance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-gray-600">Inflow</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(value) => `${value / 1000}k`}
                domain={[0, 160000]}
                ticks={[0, 40000, 80000, 120000, 160000]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Line 
                key="line-balance"
                type="monotone" 
                dataKey="balance" 
                stroke="#6366F1" 
                strokeWidth={2.5}
                dot={false}
                fill="url(#colorBalance)"
              />
              <Line 
                key="line-inflow"
                type="monotone" 
                dataKey="inflow" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop key="bal-stop1" offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                  <stop key="bal-stop2" offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}