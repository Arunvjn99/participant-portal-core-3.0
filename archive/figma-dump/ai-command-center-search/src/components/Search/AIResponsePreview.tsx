import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Copy, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';
import { useSearchStore } from '../../store/useSearchStore';
import { GoogleGenAI } from '@google/genai';

export const AIResponsePreview: React.FC = () => {
  const { query, aiResponse, setAIResponse, state, setState, addRecentSearch } = useSearchStore();

  useEffect(() => {
    if (state === 'loading') {
      const generateResponse = async () => {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `You are a retirement plan assistant. Answer this query concisely for a participant dashboard: ${query}`,
          });
          setAIResponse(response.text || "I'm sorry, I couldn't process that request.");
          setState('result');
          addRecentSearch(query);
        } catch (error) {
          console.error(error);
          setAIResponse("I'm having trouble connecting to my brain right now. Please try again later.");
          setState('result');
        }
      };
      generateResponse();
    }
  }, [state, query, setAIResponse, setState, addRecentSearch]);

  if (state !== 'result' || !aiResponse) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="absolute top-full left-0 right-0 mt-4 mx-auto max-w-2xl z-50"
      >
        <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl rounded-3xl border border-rose-200/50 dark:border-rose-900/30 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-rose-500/10 to-pink-500/10 px-6 py-4 flex items-center justify-between border-b border-rose-100 dark:border-rose-900/20">
            <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold text-sm tracking-tight uppercase">AI Assistant Response</span>
            </div>
            <button 
              onClick={() => setState('typing')}
              className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="prose prose-rose dark:prose-invert max-w-none">
              <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed font-medium">
                {aiResponse}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-xs font-bold text-zinc-400 hover:text-rose-500 transition-colors uppercase tracking-wider">
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
                <button className="flex items-center space-x-1 text-xs font-bold text-zinc-400 hover:text-rose-500 transition-colors uppercase tracking-wider">
                  <RefreshCw className="w-4 h-4" />
                  <span>Regenerate</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-zinc-400 hover:text-green-500 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
