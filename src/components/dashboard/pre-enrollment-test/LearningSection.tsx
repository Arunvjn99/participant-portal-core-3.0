/**
 * Recommended learning section for the AI Studio prototype test dashboard.
 * Extracted from figma-dump/retiresmart-pre-enrollment-portal – for test use only.
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { LEARNING_RESOURCES } from "./learningData";

export function LearningSection() {
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentResourceIndex((prev) => (prev + 1) % LEARNING_RESOURCES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentResource = LEARNING_RESOURCES[currentResourceIndex];

  return (
    <section className="mb-32">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-[32px] font-bold text-[var(--color-text)] tracking-tight">
          Recommended Learning
        </h2>
      </div>

      <motion.div
        key={currentResource.id}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative group cursor-pointer"
        onClick={() => window.open("https://external-provider.com", "_blank")}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-violet-600/5 rounded-[2.5rem] -z-10 group-hover:from-blue-600/10 group-hover:to-violet-600/10 transition-colors" />
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-10 md:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center gap-10 hover:shadow-lg transition-all">
          <div className="w-20 h-20 rounded-3xl bg-[var(--color-surface)] shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            {currentResource.icon}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                Featured Topic
              </span>
              <div className="flex items-center gap-1.5 text-[var(--color-text-tertiary)] text-xs font-bold uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5" />
                {currentResource.readTime}
              </div>
            </div>
            <h3 className="text-3xl font-black text-[var(--color-text)] mb-3 tracking-tight">
              {currentResource.title}
            </h3>
            <p className="text-[var(--color-text-secondary)] text-xl leading-relaxed max-w-2xl">
              {currentResource.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3 text-blue-600 font-bold text-lg group-hover:translate-x-2 transition-transform">
            Explore learning resources
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {LEARNING_RESOURCES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === currentResourceIndex ? "w-8 bg-blue-600" : "w-2 bg-[var(--color-border)]"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
