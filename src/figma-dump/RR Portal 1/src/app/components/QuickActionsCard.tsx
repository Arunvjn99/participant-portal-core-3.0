import {
  RefreshCw,
  Repeat,
  Building2,
  UserCircle,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Settings
} from "lucide-react";

export function QuickActionsCard() {
  const actions = [
    {
      icon: UserCircle,
      label: "Change Contribution",
      description: "Adjust your contribution rate",
      color: "blue"
    },
    {
      icon: Repeat,
      label: "Transfer Funds",
      description: "Move money between funds",
      color: "purple"
    },
    {
      icon: RefreshCw,
      label: "Rebalance",
      description: "Realign your portfolio",
      color: "emerald"
    },
    {
      icon: Settings,
      label: "Update Profile",
      description: "Manage account settings",
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        iconBg: "bg-blue-50",
        iconHover: "group-hover:bg-blue-100",
        icon: "text-blue-600",
        iconHover2: "group-hover:text-blue-700",
        border: "group-hover:border-blue-500",
        bg: "group-hover:bg-blue-50/50",
        ring: "group-hover:ring-blue-100"
      },
      purple: {
        iconBg: "bg-purple-50",
        iconHover: "group-hover:bg-purple-100",
        icon: "text-purple-600",
        iconHover2: "group-hover:text-purple-700",
        border: "group-hover:border-purple-500",
        bg: "group-hover:bg-purple-50/50",
        ring: "group-hover:ring-purple-100"
      },
      emerald: {
        iconBg: "bg-emerald-50",
        iconHover: "group-hover:bg-emerald-100",
        icon: "text-emerald-600",
        iconHover2: "group-hover:text-emerald-700",
        border: "group-hover:border-emerald-500",
        bg: "group-hover:bg-emerald-50/50",
        ring: "group-hover:ring-emerald-100"
      },
      orange: {
        iconBg: "bg-orange-50",
        iconHover: "group-hover:bg-orange-100",
        icon: "text-orange-600",
        iconHover2: "group-hover:text-orange-700",
        border: "group-hover:border-orange-500",
        bg: "group-hover:bg-orange-50/50",
        ring: "group-hover:ring-orange-100"
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          <p className="text-sm text-gray-500 mt-0.5">Manage your retirement account</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const colors = getColorClasses(action.color);
          
          return (
            <button
              key={index}
              className={`
                relative flex flex-col items-start gap-2 p-4 rounded-xl 
                border-2 border-gray-200 
                hover:border-blue-300 hover:bg-blue-50/30
                hover:shadow-lg hover:ring-4 hover:ring-blue-50
                transition-all duration-200
                group
                text-left
              `}
            >
              <div className={`
                w-10 h-10 ${colors.iconBg} group-hover:bg-blue-100 rounded-xl 
                flex items-center justify-center
                transition-all duration-200
                group-hover:scale-110
              `}>
                <Icon className={`w-5 h-5 ${colors.icon} group-hover:text-blue-600 transition-colors`} />
              </div>
              
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-0.5 text-sm">
                  {action.label}
                </div>
                <div className="text-xs text-gray-500">
                  {action.description}
                </div>
              </div>

              <ArrowRight className={`
                w-4 h-4 text-gray-400 group-hover:text-blue-600
                absolute top-4 right-4
                opacity-0 group-hover:opacity-100
                transform translate-x-0 group-hover:translate-x-1
                transition-all duration-200
              `} />
            </button>
          );
        })}
      </div>

      {/* Additional Quick Links */}
      
    </div>
  );
}