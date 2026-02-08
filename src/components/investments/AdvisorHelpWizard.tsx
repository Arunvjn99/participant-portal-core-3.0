import { useState, useCallback, useEffect } from "react";

interface AdvisorHelpWizardProps {
  open: boolean;
  onClose: () => void;
  /** Optional user name for greeting (e.g. from profile) */
  userName?: string;
}

const ADVISORS = [
  {
    id: "sarah",
    name: "Sarah Jenkins",
    certifications: "CFP® CFA",
    rating: 4.9,
    nextAvailable: "Today, 2:00 PM",
    avatarSrc: "/image/avatars/advisor-1.svg",
    isOnline: true,
  },
  {
    id: "michael",
    name: "Michael Ross",
    certifications: "CFP®",
    rating: 4.8,
    nextAvailable: "Tomorrow, 10:00 AM",
    avatarSrc: "/image/avatars/advisor-2.svg",
    isOnline: false,
  },
] as const;

const QUICK_ACTIONS = [
  "Recommend portfolio",
  "Explain risk",
  "Simulate +2%",
] as const;

export const AdvisorHelpWizard = ({
  open,
  onClose,
  userName = "there",
}: AdvisorHelpWizardProps) => {
  const [inputValue, setInputValue] = useState("");
  const initialMessage = `Hi ${userName} — I can recommend a portfolio or manage funds with you. What would you like to do?`;
  const [messages, setMessages] = useState([
    { id: "1", role: "assistant" as const, text: initialMessage },
  ]);

  useEffect(() => {
    if (open) {
      setMessages([{ id: "1", role: "assistant", text: `Hi ${userName} — I can recommend a portfolio or manage funds with you. What would you like to do?` }]);
    }
  }, [open, userName]);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, handleEscape]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSend = (text?: string) => {
    const toSend = (text ?? inputValue).trim();
    if (!toSend) return;
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text: toSend },
    ]);
    setInputValue("");
    // Simulate AI response (placeholder)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "I'll help you with that. You can also connect with a human advisor from the list.",
        },
      ]);
    }, 500);
  };

  const handleQuickAction = (action: string) => {
    handleSend(action);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="advisor-wizard-title"
    >
      <div
        className="relative flex w-full max-w-5xl h-[min(90vh,600px)] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
        role="document"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Left panel - RetireReady AI branding */}
        <div className="w-64 shrink-0 bg-[#2563eb] flex flex-col justify-between p-6 rounded-l-2xl">
          <div>
            <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" aria-hidden="true">
                <path d="M12 2a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">RetireReady AI</h2>
            <p className="mt-2 text-sm text-white/90 leading-relaxed">
              24/7 personalized portfolio guidance driven by market data.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
            <span className="text-sm font-medium text-white">Online Now</span>
          </div>
        </div>

        {/* Center - Chat */}
        <div className="flex-1 min-w-0 flex flex-col bg-white dark:bg-slate-900">
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  }`}
                >
                  <p className="text-sm">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                className="shrink-0 w-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition-colors"
                aria-label="Send"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => handleQuickAction(action)}
                  className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel - Advisors */}
        <div className="w-72 shrink-0 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-y-auto p-4 rounded-r-2xl">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Human Advisors
          </h3>
          <div className="flex flex-col gap-4">
            {ADVISORS.map((advisor) => (
              <div
                key={advisor.id}
                className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50/50 dark:bg-slate-800/50"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={advisor.avatarSrc}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover bg-slate-200"
                      />
                      {advisor.isOnline && (
                        <span
                          className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800"
                          aria-hidden
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                            {advisor.name}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {advisor.certifications}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {advisor.rating}
                          </span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" strokeWidth="1">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Rating</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Next Available</p>
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {advisor.nextAvailable}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mt-2"
                  >
                    Contact advisor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
