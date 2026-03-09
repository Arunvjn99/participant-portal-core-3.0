import { 
  RefreshCw, 
  Repeat, 
  Building2, 
  UserCircle
} from "lucide-react";

interface AccountOverviewCardProps {
  planName: string;
  accountBalance: number;
  ytdChange: number;
  ytdPercentage: number;
  vestedBalance: number;
  rolloverEligible: number;
  availableCash: number;
}

export function AccountOverviewCard({
  planName,
  accountBalance,
  ytdChange,
  ytdPercentage,
  vestedBalance,
  rolloverEligible,
  availableCash
}: AccountOverviewCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs text-gray-500 mb-1">Enrolled May 16, 2025</div>
          <h2 className="text-xl font-bold text-gray-900">{planName}</h2>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300">
          <span className="text-xs font-bold text-emerald-700">{ytdPercentage > 0 ? '+' : ''}{ytdPercentage}% YTD</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Balance */}
        <div className="md:col-span-2">
          <div className="text-sm text-gray-500 mb-2">Account Balance</div>
          <div className="text-4xl font-bold text-gray-900 mb-1">${accountBalance.toLocaleString()}</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-600 font-semibold">+${ytdChange.toLocaleString()}</span>
            <span className="text-gray-500">YTD Change</span>
          </div>
        </div>

        {/* Vested Balance */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Vested Balance</div>
          <div className="text-2xl font-bold text-gray-900">${vestedBalance.toLocaleString()}</div>
        </div>

        {/* Rollover Eligible */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Rollover Eligible</div>
          <div className="text-2xl font-bold text-gray-900">${rolloverEligible.toLocaleString()}</div>
        </div>

        {/* Available Cash */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Available Cash</div>
          <div className="text-2xl font-bold text-gray-900">${Math.abs(availableCash).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}