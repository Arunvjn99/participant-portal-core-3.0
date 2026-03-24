/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import {
  GraduationCap,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-8 font-sans gap-8">
      <div className="w-full max-w-5xl flex flex-col gap-2 mb-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500">Your personalized financial overview and AI assistant.</p>
      </div>
      
      <FinancialWellnessCard />
      <AskCoreAICard />
    </div>
  );
}

function FinancialWellnessCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-[20px] bg-white/90 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(14,165,233,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out group flex flex-col sm:flex-row items-start sm:items-center p-6 sm:p-8 gap-6 sm:gap-8 max-w-5xl mx-auto w-full cursor-pointer focus-within:ring-4 focus-within:ring-blue-500/20"
      tabIndex={0}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-teal-50/20 pointer-events-none" />

      {/* Left: 3D Illustration (Reduced size, soft clay style) */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-[20px] bg-gradient-to-br from-slate-50 to-blue-50/50 border border-white shadow-[inset_0_2px_10px_rgba(255,255,255,1),0_4px_12px_rgba(0,0,0,0.03)] flex items-center justify-center z-10">
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Shield */}
          <div className="absolute z-10 w-12 h-14 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl shadow-[0_8px_16px_rgba(20,184,166,0.25),inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center transform -rotate-6">
            <ShieldCheck className="w-6 h-6 text-white drop-shadow-sm" />
          </div>

          {/* Coin */}
          <motion.div
            animate={{ y: [1.5, -1.5, 1.5] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bottom-3 right-1 w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 shadow-[0_6px_12px_rgba(245,158,11,0.2),inset_0_2px_4px_rgba(255,255,255,0.5)] flex items-center justify-center border border-amber-200/50 z-20"
          >
            <span className="text-amber-700 font-bold text-sm drop-shadow-sm">$</span>
          </motion.div>

          {/* Chart */}
          <motion.div
            animate={{ y: [-1.5, 1.5, -1.5] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
            className="absolute top-2 left-1 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 shadow-[0_6px_12px_rgba(59,130,246,0.2),inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center transform rotate-12 z-0"
          >
            <TrendingUp className="w-5 h-5 text-white drop-shadow-sm" />
          </motion.div>
        </motion.div>
      </div>

      {/* Center: Content (Strict left alignment, 8px grid) */}
      <div className="flex-1 flex flex-col items-start gap-4 z-10 w-full justify-center">
        
        {/* Row 1: Top Meta Row */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold tracking-wide border border-blue-200/50">
            <GraduationCap className="w-3.5 h-3.5" />
            Learning
          </span>
        </div>

        {/* Row 2 & 3: Title and Description */}
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Financial Wellness
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100/80 text-slate-500 text-xs font-semibold border border-slate-200/60">
              <Sparkles className="w-3 h-3 text-slate-400" />
              Recommended for you
            </span>
          </div>
          <p className="text-base text-slate-600 leading-relaxed max-w-lg font-medium">
            Learn about planning, saving, investing wisely
          </p>
        </div>

        {/* Row 4: Progress */}
        <div className="flex items-center gap-3 pt-2">
          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-1/3 rounded-full" />
          </div>
          <span className="text-sm text-slate-500 font-medium">
            Based on your plan
          </span>
        </div>
      </div>

      {/* Right: CTA */}
      <div className="z-10 shrink-0 mt-4 sm:mt-0 self-start sm:self-center w-full sm:w-auto">
        <button className="w-full sm:w-auto relative group/btn inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-semibold text-sm shadow-[0_2px_10px_rgba(37,99,235,0.2)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30">
          Know More
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

function AskCoreAICard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-[24px] bg-[#0B1021] border border-white/10 p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-8 max-w-5xl mx-auto w-full shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_24px_50px_rgba(6,182,212,0.15)] hover:-translate-y-1 transition-all duration-500 ease-out group focus-within:ring-4 focus-within:ring-cyan-500/20"
    >
      {/* Premium Deep Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[24px]">
        {/* Subtle noise texture overlay could go here, using radial gradients for now */}
        <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[150%] bg-gradient-to-br from-blue-600/20 to-cyan-400/5 blur-[100px] rounded-full transform -rotate-12" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[100%] bg-gradient-to-tl from-indigo-600/20 to-purple-500/10 blur-[100px] rounded-full" />
        {/* Inner subtle border glow */}
        <div className="absolute inset-0 rounded-[24px] border border-white/5 group-hover:border-cyan-500/20 transition-colors duration-500" />
      </div>

      {/* Left: Advanced AI Visual (Neural Core) */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center z-10">
        {/* Outer rotating dashed ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-cyan-500/30 border-dashed"
        />
        {/* Inner rotating solid ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border-t-2 border-l-2 border-blue-500/50"
        />
        {/* Pulsing core glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 blur-md group-hover:blur-lg group-hover:from-cyan-300 transition-all duration-500"
        />
        {/* Solid bright core */}
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.9)] flex items-center justify-center">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        </div>
      </div>

      {/* Center: Structured Content */}
      <div className="flex-1 flex flex-col items-start gap-3 z-10 w-full">
        {/* Row 1: Title & Badge */}
        <div className="flex items-center gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-md">
            Ask Core AI
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-cyan-100 text-[10px] sm:text-xs font-bold tracking-wider uppercase shadow-sm backdrop-blur-md">
            BETA
          </span>
        </div>

        {/* Row 2: Description */}
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-medium">
          Get instant answers and personalized retirement insights anytime.
        </p>

        {/* Row 3: Suggested Prompt Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {[
            'How much should I save?',
            'When can I retire?',
            'Optimize my plan',
          ].map((chip) => (
            <button
              key={chip}
              className="group/chip flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-slate-200 hover:text-white text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400/70 group-hover/chip:text-cyan-400 transition-colors" />
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Input Field CTA */}
      <div className="z-10 shrink-0 w-full lg:w-[380px] relative group/input mt-4 lg:mt-0">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask anything about your plan..."
            className="w-full bg-black/40 hover:bg-black/60 focus:bg-black/60 border border-white/10 focus:border-cyan-400/50 rounded-full py-4 pl-6 pr-16 text-white placeholder:text-slate-400 outline-none transition-all duration-300 shadow-inner backdrop-blur-md focus:ring-4 focus:ring-cyan-500/20 text-base"
          />
          <button
            aria-label="Send message"
            className="absolute right-2 w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:scale-105"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
