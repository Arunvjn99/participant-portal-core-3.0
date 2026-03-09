import { motion } from "motion/react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  Gift,
  Mic,
  PhoneCall,
  PlayCircle,
  Send,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { Button } from "./ui/button";
import { useBranding } from "../../hooks/useBranding";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useRef, useEffect } from "react";

interface PreEnrollmentDashboardProps {
  userName: string;
  onStartEnrollment: () => void;
}

export function PreEnrollmentDashboard({
  userName,
  onStartEnrollment,
}: PreEnrollmentDashboardProps) {
  const branding = useBranding();
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: "Hi Sarah! I'm your AI retirement assistant. Ask me anything about your enrollment options, employer match, investment strategies, or tax benefits.",
    },
  ]);
  const [aiTyping, setAiTyping] = useState(false);
  const aiChatRef = useRef<HTMLDivElement>(null);
  const [coreAiQuery, setCoreAiQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const planHighlights = [
    {
      icon: Shield,
      title: "Traditional 401(k)",
      description: "Pre-tax contributions lower your taxable income today",
      tag: "Tax-deferred growth",
    },
    {
      icon: Zap,
      title: "Roth 401(k)",
      description: "After-tax contributions grow and withdraw tax-free",
      tag: "Tax-free withdrawals",
    },
  ];

  const checklistItems = [
    {
      id: 1,
      text: "Review your current financial goals",
      detail: "Understand how much you'll need for retirement",
      done: true,
    },
    {
      id: 2,
      text: "Know your employer match details",
      detail: "Your employer matches 100% up to 6%",
      done: true,
    },
    {
      id: 3,
      text: "Choose a plan type (Roth or Traditional)",
      detail: "We'll help you pick the right one",
      done: false,
    },
    {
      id: 4,
      text: "Set your contribution percentage",
      detail: "Decide how much of your paycheck to save",
      done: false,
    },
    {
      id: 5,
      text: "Select your investment strategy",
      detail: "Pick funds that match your risk tolerance",
      done: false,
    },
  ];

  useEffect(() => {
    if (aiChatRef.current) {
      aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
    }
  }, [aiMessages]);

  const handleAiInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAiInput(e.target.value);
  };

  const handleAiSubmit = async () => {
    if (aiInput.trim() === "") return;
    const userMsg = aiInput.trim();
    setAiMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setAiInput("");
    setAiTyping(true);

    const mockResponses: Record<string, string> = {
      match:
        "Your employer matches 100% of your contributions up to 6% of your salary. At your $45,000 salary, that's up to $2,700 per year in free money! Make sure you contribute at least 6% to get the full match.",
      roth: "A Roth 401(k) lets you contribute after-tax dollars. The big advantage? Your withdrawals in retirement are completely tax-free, including all investment gains. It's a great choice if you expect to be in a higher tax bracket later.",
      traditional:
        "A Traditional 401(k) uses pre-tax dollars, which lowers your taxable income now. You'll pay taxes when you withdraw in retirement. It's ideal if you expect to be in a lower tax bracket when you retire.",
      contribution:
        "Financial experts typically recommend contributing at least enough to get your full employer match (6% in your case). If possible, aim for 10-15% of your salary. You can always start lower and use auto-increase to ramp up over time.",
      invest:
        "Your plan offers several investment options from target-date funds to individual index funds. Target-date funds automatically adjust your allocation as you approach retirement — they're a great hands-off option.",
      tax: "Both plan types offer tax advantages. Traditional gives you a tax break now (pre-tax contributions), while Roth gives you tax-free withdrawals in retirement. The best choice depends on your current vs. expected future tax bracket.",
    };

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const lowerMsg = userMsg.toLowerCase();
    let reply =
      "Great question! Based on your profile, I'd recommend starting with at least 6% contribution to maximize your employer match. Would you like me to explain the differences between Roth and Traditional plans, or help you understand the investment options?";

    for (const [keyword, response] of Object.entries(mockResponses)) {
      if (lowerMsg.includes(keyword)) {
        reply = response;
        break;
      }
    }

    setAiMessages((prev) => [...prev, { role: "ai", text: reply }]);
    setAiTyping(false);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      setCoreAiQuery("Enroll me in a Roth 401k plan");
    } else {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setCoreAiQuery("Enroll me in a Roth 401k plan");
      }, 4000);
    }
  };

  const handleCoreAiSearch = () => {
    if (coreAiQuery.trim()) {
      setAiOpen(true);
      setAiInput(coreAiQuery);
      setCoreAiQuery("");
    }
  };

  const completedCount = checklistItems.filter((i) => i.done).length;
  const totalCount = checklistItems.length;
  const progressPct = (completedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-[#F7F8FA] relative">
      {/* Top navigation bar */}
      <div className="bg-white border-b border-gray-200/80">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: branding.colors.primary }}
            >
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
              {branding.brand.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:inline">
              {branding.brand.companyName}
            </span>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
              S
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-8">
        {/* Two-column grid: 70/30 split */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* ===== LEFT COLUMN (7 of 10 = 70%) ===== */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* ── Hero Section ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.primary}dd)`,
              }}
            >
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-[0.08] bg-white -translate-y-12 translate-x-12" />
              <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full opacity-[0.05] bg-white translate-y-6 -translate-x-4" />

              <div className="relative px-6 py-5 flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-white mb-1 tracking-tight leading-tight">
                    Welcome back, {userName}!
                  </h1>

                  <p className="text-sm text-white/80 mb-4 max-w-lg leading-relaxed">
                    Your enrollment window is open. Let's set up your retirement
                    plan and start building your future today.
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      onClick={onStartEnrollment}
                      className="bg-white hover:bg-gray-50 shadow-lg px-5 py-2 text-sm cursor-pointer"
                      style={{ color: branding.colors.primary }}
                    >
                      Start Enrollment
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                    <span className="flex items-center gap-1.5 text-white/70 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      Takes about 5–10 minutes
                    </span>
                  </div>
                </div>

                {/* Hero image - smaller */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex-shrink-0 hidden md:block"
                >
                  <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBncm93dGglMjBzYXZpbmdzJTIwZnV0dXJlfGVufDF8fHx8MTc3Mjc4NTM3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Retirement planning"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* ── Core AI Widget ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              <div className="p-5">
                {/* Header row */}
                <div className="flex items-center gap-2.5 mb-3">
                  <motion.div
                    className="relative w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.primary}cc)`,
                    }}
                  >
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        repeatDelay: 5,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                    />
                    <Sparkles className="w-4 h-4 text-white relative z-10" />
                  </motion.div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      Core AI
                    </span>
                    <span
                      className="px-1.5 py-px rounded text-[9px] font-bold tracking-wider uppercase"
                      style={{
                        backgroundColor: branding.colors.primary + "10",
                        color: branding.colors.primary,
                      }}
                    >
                      Beta
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-gray-900 tracking-tight leading-snug mb-0.5">
                  How can I help with your enrollment?
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Ask me anything about plans, contributions, or say{" "}
                  <span className="text-gray-700 font-medium">"enroll me"</span>{" "}
                  to start.
                </p>

                {/* Input field */}
                <div className="relative mb-4">
                  <div className="relative flex items-center rounded-xl border border-gray-200 bg-gray-50/60 overflow-hidden transition-all duration-200 focus-within:bg-white focus-within:border-gray-300 focus-within:shadow-sm">
                    <div className="pl-3.5 pr-2 flex items-center">
                      <Bot className="w-[18px] h-[18px] text-gray-400" />
                    </div>

                    <input
                      type="text"
                      value={coreAiQuery}
                      onChange={(e) => setCoreAiQuery(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleCoreAiSearch()
                      }
                      placeholder='Try "Enroll me in a Roth 401k"'
                      className="flex-1 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                    />

                    <div className="flex items-center gap-0.5 pr-1.5">
                      <motion.button
                        onClick={handleVoiceToggle}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors relative cursor-pointer"
                        style={{
                          backgroundColor: isListening
                            ? branding.colors.primary + "12"
                            : "transparent",
                          color: isListening
                            ? branding.colors.primary
                            : "#d1d5db",
                        }}
                      >
                        {isListening && (
                          <motion.span
                            animate={{
                              scale: [1, 1.8, 1],
                              opacity: [0.4, 0, 0.4],
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute inset-0 rounded-lg"
                            style={{
                              backgroundColor:
                                branding.colors.primary + "15",
                            }}
                          />
                        )}
                        <Mic className="w-4 h-4 relative z-10" />
                      </motion.button>

                      <motion.button
                        onClick={handleCoreAiSearch}
                        disabled={!coreAiQuery.trim()}
                        whileHover={
                          coreAiQuery.trim() ? { scale: 1.06 } : {}
                        }
                        whileTap={
                          coreAiQuery.trim() ? { scale: 0.94 } : {}
                        }
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        style={{
                          backgroundColor: coreAiQuery.trim()
                            ? branding.colors.primary
                            : "transparent",
                          color: coreAiQuery.trim() ? "white" : "#d1d5db",
                        }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Listening state */}
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="-mt-2 mb-3 flex items-center gap-3 px-4 py-2 rounded-xl border border-dashed"
                    style={{
                      borderColor: branding.colors.primary + "30",
                      backgroundColor: branding.colors.primary + "06",
                    }}
                  >
                    <div className="flex items-center gap-0.5">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scaleY: [0.3, 1.4, 0.3] }}
                          transition={{
                            duration: 0.7,
                            repeat: Infinity,
                            delay: i * 0.08,
                          }}
                          className="w-0.5 h-4 rounded-full"
                          style={{
                            backgroundColor: branding.colors.primary,
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: branding.colors.primary }}
                    >
                      Listening...
                    </span>
                    <button
                      onClick={() => setIsListening(false)}
                      className="ml-auto text-xs font-medium px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                      Stop
                    </button>
                  </motion.div>
                )}

                {/* 2×2 suggestion cards */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    {
                      label: "Start enrollment",
                      icon: ArrowRight,
                      desc: "Begin setup",
                    },
                    {
                      label: "Roth vs Traditional",
                      icon: Shield,
                      desc: "Compare plans",
                    },
                    {
                      label: "Employer match",
                      icon: Gift,
                      desc: "Free money",
                    },
                    {
                      label: "Investment picks",
                      icon: TrendingUp,
                      desc: "Get recommendations",
                    },
                  ].map((action) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={action.label}
                        onClick={() => setCoreAiQuery(action.label)}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="group flex items-start gap-2.5 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all text-left cursor-pointer"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor:
                              branding.colors.primary + "0a",
                          }}
                        >
                          <Icon
                            className="w-4 h-4"
                            style={{ color: branding.colors.primary }}
                          />
                        </div>
                        <div className="min-w-0 pt-px">
                          <p className="text-[13px] font-semibold text-gray-900 mb-px leading-snug">
                            {action.label}
                          </p>
                          <p className="text-xs text-gray-400">
                            {action.desc}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* ── Quick Actions ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-sm font-semibold text-gray-900 mb-3 px-0.5">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    icon: Gift,
                    title: "Learn About Matching",
                    desc: "Get up to $2,700/yr in free money",
                    color: "#10B981",
                    bg: "#ECFDF5",
                  },
                  {
                    icon: Shield,
                    title: "Compare Plan Types",
                    desc: "Roth vs Traditional explained",
                    color: "#3B82F6",
                    bg: "#EFF6FF",
                  },
                  {
                    icon: TrendingUp,
                    title: "Investment Options",
                    desc: "Explore fund choices",
                    color: "#8B5CF6",
                    bg: "#F5F3FF",
                  },
                  {
                    icon: PlayCircle,
                    title: "Watch Tutorial",
                    desc: "5-minute enrollment guide",
                    color: "#F59E0B",
                    bg: "#FFFBEB",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.06 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-gray-200/80 hover:border-gray-300 hover:shadow-sm transition-all text-left cursor-pointer"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: item.bg }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: item.color }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-px">
                          {item.title}
                        </p>
                        <p className="text-[13px] text-gray-500">
                          {item.desc}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* ===== RIGHT COLUMN (3 of 10 = 30%) ===== */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* ── Enrollment Progress Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Target className="w-[18px] h-[18px] text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                        Enrollment Progress
                      </h3>
                    </div>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: branding.colors.primary + "10",
                      color: branding.colors.primary,
                    }}
                  >
                    {Math.round(progressPct)}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: branding.colors.primary }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {completedCount} of {totalCount} steps completed
                </p>
              </div>

              <div className="p-3 space-y-0.5">
                {checklistItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-start gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50/70 transition-colors"
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {item.done ? (
                        <CheckCircle2
                          className="w-[18px] h-[18px]"
                          style={{ color: branding.colors.primary }}
                        />
                      ) : (
                        <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium leading-snug ${
                          item.done
                            ? "text-gray-400 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {item.text}
                      </p>
                      <p className="text-xs text-gray-400 mt-px">
                        {item.detail}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── Retirement Plan Highlights ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Shield className="w-[18px] h-[18px] text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                      Plan Options
                    </h3>
                    <p className="text-xs text-gray-500">
                      Choose what's right for you
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {planHighlights.map((plan, index) => {
                  const Icon = plan.icon;
                  return (
                    <motion.div
                      key={plan.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + index * 0.08 }}
                      className="p-4 rounded-xl border border-gray-100 bg-gray-50/40 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor:
                              index === 0 ? "#EFF6FF" : "#F5F3FF",
                          }}
                        >
                          <Icon
                            className="w-[18px] h-[18px]"
                            style={{
                              color: index === 0 ? "#3B82F6" : "#8B5CF6",
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
                            {plan.title}
                          </h4>
                          <p className="text-xs text-gray-600 leading-relaxed mb-2">
                            {plan.description}
                          </p>
                          <span
                            className="inline-block text-[10px] font-bold px-2 py-1 rounded-md"
                            style={{
                              backgroundColor:
                                index === 0
                                  ? branding.colors.primary + "10"
                                  : "#8B5CF610",
                              color:
                                index === 0
                                  ? branding.colors.primary
                                  : "#8B5CF6",
                            }}
                          >
                            {plan.tag}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ===== Floating Ask AI Chat Widget ===== */}
      <div className="fixed bottom-6 right-6 z-50">
        {aiOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="mb-4 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
            style={{ maxHeight: "520px" }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{
                background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.primary}cc)`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Ask AI Assistant
                  </h4>
                  <p className="text-xs text-white/70">Powered by AI</p>
                </div>
              </div>
              <button
                onClick={() => setAiOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Suggested Questions */}
            {aiMessages.length <= 1 && (
              <div className="px-4 pt-3 pb-1 flex flex-wrap gap-1.5">
                {[
                  "How does matching work?",
                  "Roth vs Traditional?",
                  "How much to contribute?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setAiInput(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            <div
              ref={aiChatRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
              style={{ minHeight: "200px", maxHeight: "340px" }}
            >
              {aiMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[85%] ${
                      msg.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {msg.role === "ai" && (
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          backgroundColor: branding.colors.primary + "12",
                        }}
                      >
                        <Bot
                          className="w-4 h-4"
                          style={{ color: branding.colors.primary }}
                        />
                      </div>
                    )}
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "text-white rounded-br-md"
                          : "bg-gray-100 text-gray-800 rounded-bl-md"
                      }`}
                      style={
                        msg.role === "user"
                          ? { backgroundColor: branding.colors.primary }
                          : undefined
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {aiTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-2"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: branding.colors.primary + "12",
                    }}
                  >
                    <Bot
                      className="w-4 h-4"
                      style={{ color: branding.colors.primary }}
                    />
                  </div>
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
                    {[0, 0.2, 0.4].map((delay, idx) => (
                      <motion.div
                        key={idx}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay,
                        }}
                        className="w-1.5 h-1.5 rounded-full bg-gray-400"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={handleAiInput}
                  onKeyDown={(e) => e.key === "Enter" && handleAiSubmit()}
                  placeholder="Ask about your retirement plan..."
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={
                    {
                      "--tw-ring-color": branding.colors.primary,
                    } as React.CSSProperties
                  }
                />
                <button
                  onClick={handleAiSubmit}
                  disabled={!aiInput.trim() || aiTyping}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  style={{ backgroundColor: branding.colors.primary }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Floating Button */}
        <motion.button
          onClick={() => setAiOpen(!aiOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white cursor-pointer overflow-hidden"
          style={{ backgroundColor: branding.colors.primary }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg]"
            />
          </div>
          {!aiOpen && (
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ backgroundColor: branding.colors.primary }}
            />
          )}
          {aiOpen ? (
            <X className="w-6 h-6 relative z-10" />
          ) : (
            <Sparkles className="w-6 h-6 relative z-10" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
