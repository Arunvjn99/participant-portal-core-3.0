import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send } from 'lucide-react';

interface Message {
    id: string;
    type: 'question' | 'answer';
    text: string;
    timestamp: Date;
}

const knowledgeBase: Record<string, string> = {
    'what is a roth 401(k)': 'A Roth 401(k) is a retirement savings account where you contribute after-tax dollars. The major benefit is that your withdrawals in retirement are completely tax-free, including all the investment growth! This is ideal if you expect to be in a higher tax bracket in retirement.',
    'what is a traditional 401(k)': 'A Traditional 401(k) lets you contribute pre-tax dollars, which reduces your taxable income today. You\'ll pay taxes on withdrawals in retirement. This is great if you\'re in a higher tax bracket now and expect to be in a lower one when you retire.',
    'how much should i contribute': 'I recommend starting with at least 6% to capture your full employer match - that\'s free money! Ideally, aim for 10-15% of your salary including the match. You can always start smaller and increase 1% each year with our auto-increase feature.',
    'what are my investment options': 'You can choose from three portfolio strategies: Conservative (70% bonds, 30% stocks) for stability, Moderate (60% stocks, 40% bonds) for balanced growth, or Aggressive (90% stocks, 10% bonds) for maximum long-term growth. I\'ll help you pick based on your risk tolerance and time horizon!',
    'what is employer match': 'Your employer match is free money added to your 401(k)! Your company matches 50% of your contributions up to 6% of your salary. For example, if you contribute 6%, your employer adds another 3%. That\'s an instant 50% return on your investment!',
    'can i change my contribution': 'Absolutely! You can adjust your contribution percentage anytime. Many people start with the employer match amount (6%) and increase by 1% each year. Our auto-increase feature can do this automatically for you.',
    'what is a retirement score': 'Your Retirement Score (0-100) shows how well you\'re positioned for retirement based on your contributions, investment strategy, time horizon, and savings goals. Scores above 70 are considered "On Track" - the higher the better!',
    'when can i withdraw': 'You can start penalty-free withdrawals at age 59½. For Roth 401(k), withdrawals are completely tax-free. For Traditional 401(k), you\'ll pay income tax on withdrawals. There are some exceptions for hardship withdrawals, but early withdrawal generally includes a 10% penalty.',
    'what is asset allocation': 'Asset allocation is how your money is divided between stocks (higher risk, higher growth potential) and bonds (lower risk, steadier returns). A younger investor might choose 90% stocks, while someone closer to retirement might prefer 70% bonds for stability.',
    'should i choose roth or traditional': 'Great question! If you\'re younger or in a lower tax bracket now, Roth is often better - you\'ll likely be in a higher bracket later. If you\'re in a high tax bracket now and want immediate tax savings, Traditional might be better. I can analyze your specific situation!',
    'what happens if market drops': 'Market drops are temporary! History shows markets always recover and grow over time. If you have 20+ years until retirement, market dips are actually buying opportunities. Stay the course - your diversified portfolio is designed to handle volatility.',
    'how do i enroll': 'I\'m guiding you through enrollment right now! Just complete each step: Choose your plan type, set your contribution amount, select your investment strategy, and review everything. The whole process takes about 5-10 minutes.',
    'what fees do i pay': 'Your 401(k) has very low administrative fees (typically 0.1-0.5% annually) and fund expense ratios that vary by investment choice. These are built into your returns and are among the lowest in the industry. The employer match more than makes up for any fees!',
    'can i take a loan': 'Yes, most plans allow you to borrow up to 50% of your vested balance (max $50,000). You\'ll pay yourself back with interest. However, I generally recommend keeping this for true emergencies only, as it can impact your retirement savings growth.',
    'what is vesting': 'Vesting determines when you own your employer\'s matching contributions. You always own 100% of what YOU contribute. Employer contributions may vest over time (typically 3-6 years). Check your plan details for your specific vesting schedule.',
};

function findAnswer(question: string): string {
    const normalizedQuestion = question.toLowerCase().trim();

    if (knowledgeBase[normalizedQuestion]) {
        return knowledgeBase[normalizedQuestion];
    }

    const keywords = normalizedQuestion.split(' ').filter(word => word.length > 3);
    let bestMatch = '';
    let highestScore = 0;

    Object.entries(knowledgeBase).forEach(([key, value]) => {
        const matchScore = keywords.filter(keyword => key.includes(keyword)).length;
        if (matchScore > highestScore) {
            highestScore = matchScore;
            bestMatch = value;
        }
    });

    if (highestScore > 0) {
        return bestMatch;
    }

    return "That's a great question! While I'm still learning, I can help with questions about: plan types (Roth vs Traditional), contribution amounts, investment options, employer match, retirement scores, and the enrollment process. Feel free to ask me anything about these topics!";
}

export function FuturisticSearch({ onVoiceTrigger, className, isDashboard }: { onVoiceTrigger?: () => void, className?: string, isDashboard?: boolean }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            const question: Message = {
                id: `q-${Date.now()}`,
                type: 'question',
                text: inputValue.trim(),
                timestamp: new Date(),
            };

            const answer: Message = {
                id: `a-${Date.now()}`,
                type: 'answer',
                text: findAnswer(inputValue.trim()),
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, question, answer]);
            setInputValue('');
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
        setTimeout(() => {
            const question: Message = {
                id: `q-${Date.now()}`,
                type: 'question',
                text: suggestion,
                timestamp: new Date(),
            };

            const answer: Message = {
                id: `a-${Date.now()}`,
                type: 'answer',
                text: findAnswer(suggestion),
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, question, answer]);
            setInputValue('');
        }, 100);
    };

    const handleClose = () => {
        setIsExpanded(false);
        setTimeout(() => setMessages([]), 300);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed bottom-10 left-1/2 z-50 w-full max-w-3xl px-4 pointer-events-none ${className || ''}`}
            style={{ transform: 'translateX(-50%)', left: '50%' }}
        >
            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    <motion.button
                        key="collapsed"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => setIsExpanded(true)}
                        className="relative mx-auto block pointer-events-auto"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/10 via-[var(--color-accent)]/10 to-[var(--color-primary)]/10 rounded-full blur-2xl" />
                        <div className="relative backdrop-blur-xl bg-[var(--color-surface)]/95 rounded-full border border-[var(--color-primary)]/20 shadow-lg px-6 py-4 flex items-center gap-3 hover:shadow-xl transition-all hover:scale-105">
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="text-[var(--color-primary)]" size={20} />
                            </motion.div>
                            <span className="text-[var(--color-primary)]">Ask Core AI anything</span>
                        </div>
                    </motion.button>
                ) : (
                    <motion.div
                        key="expanded"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="relative pointer-events-auto"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/10 via-[var(--color-accent)]/10 to-[var(--color-primary)]/10 rounded-2xl blur-2xl" />
                        <div className="relative backdrop-blur-xl bg-[var(--color-surface)]/95 rounded-2xl border border-[var(--color-primary)]/20 shadow-xl overflow-hidden">
                            <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-secondary)]">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-sm"
                                    >
                                        <Sparkles className="text-white" size={20} />
                                    </motion.div>
                                    <div className="flex-1">
                                        <h3 className="text-[var(--color-text)] font-medium text-sm">Core AI Assistant</h3>
                                        <p className="text-[var(--color-textSecondary)] text-xs">Your retirement planning guide</p>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="text-[var(--color-textSecondary)] hover:text-[var(--color-text)] transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {messages.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="max-h-[400px] overflow-y-auto p-4 space-y-4"
                                >
                                    {messages.map((message) => (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`flex ${message.type === 'question' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            {message.type === 'answer' && (
                                                <div className="flex items-start gap-2 max-w-[85%]">
                                                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 shadow-sm">
                                                        <Sparkles className="text-white" size={14} />
                                                    </div>
                                                    <div className="bg-[var(--color-secondary)] rounded-2xl rounded-tl-sm p-3 border border-[var(--color-primary)]/20">
                                                        <p className="text-[var(--color-text)] text-sm leading-relaxed">{message.text}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {message.type === 'question' && (
                                                <div className="bg-[var(--color-primary)] text-white rounded-2xl rounded-tr-sm p-3 max-w-[85%] shadow-sm">
                                                    <p className="text-sm">{message.text}</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-background)]">
                                <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Ask me anything about your 401(k)..."
                                        className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full px-4 py-2.5 outline-none text-[var(--color-text)] placeholder-[var(--color-textSecondary)] text-sm focus:border-[var(--color-primary)] transition-colors"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputValue.trim()}
                                        className="w-10 h-10 rounded-full bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-40 flex items-center justify-center transition-all disabled:cursor-not-allowed shadow-sm"
                                    >
                                        <Send size={16} className="text-white" />
                                    </button>
                                </form>

                                {messages.length === 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs text-[var(--color-textSecondary)] mb-2">Popular questions:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                'What is a Roth 401(k)?',
                                                'How much should I contribute?',
                                                'What are my investment options?',
                                                'What is employer match?',
                                                'Should I choose Roth or Traditional?',
                                            ].map((suggestion, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                    className="text-xs px-3 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-secondary)] hover:border-[var(--color-primary)] transition-all"
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
