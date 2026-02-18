import React from 'react';
import { CloudRain, X } from 'lucide-react';

export const VolatilityBanner: React.FC = () => {
  // Logic to determine if we show this could be passed in props.
  // For demo, we assume "Market Volatility Mode" is active to show the UI.
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  return (
    <div className="bg-slate-800 text-slate-200 rounded-2xl p-6 mb-8 flex items-start md:items-center gap-6 relative overflow-hidden shadow-lg animate-fade-in">
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-700 rounded-full mix-blend-overlay filter blur-3xl opacity-30 -mr-10 -mt-10"></div>
      
      <div className="p-3 bg-slate-700/50 rounded-xl backdrop-blur-sm z-10">
        <CloudRain className="text-blue-300" size={24} />
      </div>
      
      <div className="flex-1 z-10">
        <h3 className="text-white font-bold text-lg mb-1">Markets are fluctuating today</h3>
        <p className="text-slate-400 text-sm max-w-2xl">
          History shows that staying invested during volatility often leads to better long-term outcomes than trying to time the market. Your plan is built for resilience.
        </p>
      </div>

      <button 
        onClick={() => setVisible(false)}
        className="p-2 hover:bg-slate-700 rounded-full transition-colors z-10 text-slate-400 hover:text-white"
      >
        <X size={20} />
      </button>
    </div>
  );
};
