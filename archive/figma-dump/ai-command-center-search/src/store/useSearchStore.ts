import { create } from 'zustand';

export type SearchState = 'idle' | 'hover' | 'focus' | 'typing' | 'loading' | 'result';

export interface Suggestion {
  id: string;
  title: string;
  subtext: string;
  category: 'Actions' | 'Data' | 'Help' | 'Recent';
  icon: string;
}

interface SearchStore {
  query: string;
  state: SearchState;
  suggestions: Suggestion[];
  recentSearches: string[];
  aiResponse: string | null;
  setQuery: (query: string) => void;
  setState: (state: SearchState) => void;
  setSuggestions: (suggestions: Suggestion[]) => void;
  addRecentSearch: (search: string) => void;
  setAIResponse: (response: string | null) => void;
  reset: () => void;
}

const DEFAULT_SUGGESTIONS: Suggestion[] = [
  { id: '1', title: 'Start my enrollment', subtext: 'Begin your retirement journey', category: 'Actions', icon: 'UserPlus' },
  { id: '2', title: 'View investments', subtext: 'Check your current portfolio performance', category: 'Data', icon: 'TrendingUp' },
  { id: '3', title: 'Check transactions', subtext: 'Review recent account activity', category: 'Data', icon: 'History' },
  { id: '4', title: 'Learn about my plan', subtext: 'Understand your benefits and rules', category: 'Help', icon: 'BookOpen' },
];

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  state: 'idle',
  suggestions: DEFAULT_SUGGESTIONS,
  recentSearches: ['401k contribution limits', 'rebalance portfolio'],
  aiResponse: null,
  setQuery: (query) => set({ query }),
  setState: (state) => set({ state }),
  setSuggestions: (suggestions) => set({ suggestions }),
  addRecentSearch: (search) => set((state) => ({
    recentSearches: [search, ...state.recentSearches.filter(s => s !== search)].slice(0, 5)
  })),
  setAIResponse: (aiResponse) => set({ aiResponse }),
  reset: () => set({ query: '', state: 'idle', aiResponse: null }),
}));
