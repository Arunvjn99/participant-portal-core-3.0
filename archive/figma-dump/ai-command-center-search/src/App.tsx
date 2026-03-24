import { AISearchBar } from './components/Search/AISearchBar';
import { motion } from 'motion/react';
import { TrendingUp, PieChart, ShieldCheck, Wallet } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-rose-200 dark:selection:bg-rose-900/30">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-pink-500/10 blur-[120px] rounded-full" />
      </div>

      <header className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">RetireSmart</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-bold uppercase tracking-widest text-zinc-500">
          <a href="#" className="hover:text-rose-500 transition-colors">Dashboard</a>
          <a href="#" className="hover:text-rose-500 transition-colors">Investments</a>
          <a href="#" className="hover:text-rose-500 transition-colors">Planning</a>
          <a href="#" className="hover:text-rose-500 transition-colors">Support</a>
        </nav>
        <button className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-sm font-bold uppercase tracking-wider hover:scale-105 transition-transform shadow-xl">
          My Account
        </button>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mt-12 mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-4 bg-linear-to-b from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent"
          >
            Your Future, <span className="italic text-rose-500">Intelligently</span> Managed.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto font-medium"
          >
            Use our AI-powered command center to manage your retirement plan, explore investment options, and get instant answers to your complex financial questions.
          </motion.p>
        </div>

        <AISearchBar />

        {/* Dashboard Preview Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Total Balance', value: '$428,592.12', trend: '+12.4%', icon: Wallet, color: 'rose' },
            { title: 'Investment Growth', value: '+$42,102.00', trend: '+8.2%', icon: TrendingUp, color: 'pink' },
            { title: 'Asset Allocation', value: 'Diversified', trend: 'Optimal', icon: PieChart, color: 'zinc' },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="p-8 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-rose-200 dark:hover:border-rose-900/30 transition-all group"
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors",
                card.color === 'rose' ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600" :
                card.color === 'pink' ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600" :
                "bg-zinc-100 dark:bg-zinc-800 text-zinc-600"
              )}>
                <card.icon className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-1">{card.title}</p>
              <h3 className="text-3xl font-black tracking-tight mb-2">{card.value}</h3>
              <span className={cn(
                "text-xs font-bold px-2 py-1 rounded-full",
                card.trend.startsWith('+') ? "bg-green-100 text-green-600 dark:bg-green-900/30" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800"
              )}>
                {card.trend}
              </span>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 py-12 border-t border-zinc-200 dark:border-zinc-800 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
          &copy; 2026 RetireSmart Financial Services. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
