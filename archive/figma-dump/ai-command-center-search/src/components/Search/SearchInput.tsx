import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Search, ArrowRight, Loader2, X, Command } from 'lucide-react';
import { useSearchStore } from '../../store/useSearchStore';
import { cn } from '../../lib/utils';

export const SearchInput: React.FC = () => {
  const { query, setQuery, state, setState, reset } = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setState('idle');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length > 0) {
      setState('typing');
    } else {
      setState('focus');
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      {/* Animated Glow Border */}
      <motion.div
        className={cn(
          "absolute -inset-[2px] rounded-full blur-sm opacity-50 transition-all duration-500",
          "bg-linear-to-r from-rose-400 via-pink-500 to-rose-400 bg-[length:200%_auto]",
          state === 'focus' || state === 'typing' ? "opacity-100 blur-md scale-[1.02]" : "group-hover:opacity-75"
        )}
        animate={{
          backgroundPosition: ["0% center", "200% center"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Main Container */}
      <div 
        className={cn(
          "relative flex items-center w-full h-16 px-6 rounded-full transition-all duration-300",
          "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 shadow-2xl",
          state === 'focus' || state === 'typing' ? "scale-[1.02]" : ""
        )}
      >
        {/* Left Icon: AI Sparkle */}
        <motion.div
          animate={state === 'loading' ? { rotate: 360 } : { scale: [1, 1.1, 1] }}
          transition={state === 'loading' ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 2, repeat: Infinity }}
          className="mr-4 text-rose-500"
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setState('focus')}
          onBlur={() => !query && setState('idle')}
          placeholder="Ask anything about your retirement..."
          className="flex-1 bg-transparent border-none outline-hidden text-lg font-medium text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400"
        />

        {/* Right Icons */}
        <div className="flex items-center ml-4 space-x-3">
          <AnimatePresence mode="wait">
            {query.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={reset}
                className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-700 mx-2" />

          <AnimatePresence mode="wait">
            {state === 'loading' ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
              </motion.div>
            ) : state === 'typing' ? (
              <motion.button
                key="send"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="p-2 rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.div
                key="command"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center text-zinc-400 text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700"
              >
                <Command className="w-3 h-3 mr-1" />
                <span>/</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Waveform animation inside bar when typing */}
        {state === 'typing' && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end space-x-1 pb-1 opacity-30">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                animate={{ height: [4, 12, 4] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                className="w-1 bg-rose-500 rounded-full"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
