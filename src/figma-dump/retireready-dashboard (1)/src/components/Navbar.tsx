import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, Globe, User, LayoutDashboard, PieChart, ArrowRightLeft, TrendingUp, Settings } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { motion } from 'motion/react';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'Retirement Plan', icon: PieChart, active: false },
    { name: 'Transactions', icon: ArrowRightLeft, active: false },
    { name: 'Investments', icon: TrendingUp, active: false },
    { name: 'Profile', icon: Settings, active: false },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Logo & Nav */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-lg font-bold tracking-tight hidden sm:block">RetireReady</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-gray-500">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Globe className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
          </div>

          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

          <div className="flex items-center gap-3">
             {/* Persistent Primary Action - Fitts's Law */}
            <Button variant="accent" className="hidden sm:flex shadow-md shadow-emerald-600/10">
              Start Enrollment
            </Button>

            <button className="flex items-center gap-2 pl-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-200">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-4"
        >
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                className="flex w-full items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </button>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-100">
            <Button variant="accent" className="w-full justify-center">
              Start Enrollment
            </Button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
