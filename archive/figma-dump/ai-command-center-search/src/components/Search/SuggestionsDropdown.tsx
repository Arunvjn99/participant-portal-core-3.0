import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { useSearchStore, Suggestion } from '../../store/useSearchStore';
import { cn } from '../../lib/utils';

export const SuggestionsDropdown: React.FC = () => {
  const { query, state, suggestions, recentSearches, setQuery, setState } = useSearchStore();

  if (state === 'idle') return null;

  const filteredSuggestions = query
    ? suggestions.filter(s => 
        s.title.toLowerCase().includes(query.toLowerCase()) || 
        s.category.toLowerCase().includes(query.toLowerCase())
      )
    : suggestions;

  const categories = Array.from(new Set(filteredSuggestions.map(s => s.category)));

  const handleSelect = (title: string) => {
    setQuery(title);
    setState('typing');
  };

  return (
    <AnimatePresence>
      {(state === 'focus' || state === 'typing') && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          className="absolute top-full left-0 right-0 mt-4 mx-auto max-w-2xl z-50 overflow-hidden"
        >
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-4 max-h-[70vh] overflow-y-auto scrollbar-hide">
            
            {/* Recent Searches (Bonus) */}
            {!query && recentSearches.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-4 mb-2">Recent Searches</h3>
                <div className="flex flex-wrap gap-2 px-4">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(search)}
                      className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 transition-colors border border-zinc-200 dark:border-zinc-700"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Suggestion */}
            {query && (
              <button 
                onClick={() => setState('loading')}
                className="w-full flex items-center p-4 mb-4 rounded-2xl bg-linear-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/20 group hover:scale-[1.01] transition-transform"
              >
                <div className="p-2 bg-white/20 rounded-lg mr-4">
                  <Icons.Sparkles className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Ask AI Assistant</p>
                  <p className="text-sm text-white/80">" {query} "</p>
                </div>
                <Icons.ChevronRight className="ml-auto w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}

            {/* Grouped Suggestions */}
            {categories.map(category => (
              <div key={category} className="mb-4 last:mb-0">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-4 mb-2">{category}</h3>
                <div className="space-y-1">
                  {filteredSuggestions
                    .filter(s => s.category === category)
                    .map(item => {
                      const IconComponent = (Icons as any)[item.icon] || Icons.Circle;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.title)}
                          className="w-full flex items-center p-3 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/10 group transition-all"
                        >
                          <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/30 group-hover:text-rose-600 transition-colors">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="ml-4 text-left">
                            <p className="font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors">
                              {item.title}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.subtext}</p>
                          </div>
                          <Icons.ArrowUpLeft className="ml-auto w-4 h-4 text-zinc-300 group-hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all rotate-45" />
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}

            {filteredSuggestions.length === 0 && (
              <div className="p-8 text-center">
                <Icons.SearchX className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <p className="text-zinc-500 font-medium">No results found for "{query}"</p>
                <p className="text-sm text-zinc-400">Try asking AI for help instead.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
