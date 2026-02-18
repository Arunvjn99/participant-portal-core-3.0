import React from 'react';
import { Menu, Bell, Search, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-lg">L</div>
                <span className="font-bold text-lg tracking-tight text-slate-900">Lumina</span>
            </div>

            <div className="hidden md:flex items-center gap-1">
                <a href="#" className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Dashboard</a>
                <a href="#" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-md">Performance</a>
                <a href="#" className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Holdings</a>
                <a href="#" className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Activity</a>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Market Open</span>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
                <Search size={20} />
            </button>
            <button className="text-slate-400 hover:text-slate-600 relative">
                <Bell size={20} />
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200 cursor-pointer">
                <div className="w-8 h-8 bg-slate-200 rounded-full border border-slate-300"></div>
                <ChevronDown size={14} className="text-slate-400" />
            </div>
        </div>

      </div>
    </nav>
  );
};
