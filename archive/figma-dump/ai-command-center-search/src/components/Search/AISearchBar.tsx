import React from 'react';
import { SearchInput } from './SearchInput';
import { SuggestionsDropdown } from './SuggestionsDropdown';
import { AIResponsePreview } from './AIResponsePreview';
import { useSearchStore } from '../../store/useSearchStore';

export const AISearchBar: React.FC = () => {
  const { state, setState } = useSearchStore();

  return (
    <div className="relative w-full max-w-4xl mx-auto pt-20 px-4">
      {/* Backdrop overlay when focused */}
      {(state === 'focus' || state === 'typing' || state === 'loading' || state === 'result') && (
        <div 
          className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-40 transition-all duration-500"
          onClick={() => setState('idle')}
        />
      )}
      
      <div className="relative z-50">
        <SearchInput />
        <SuggestionsDropdown />
        <AIResponsePreview />
      </div>
    </div>
  );
};
