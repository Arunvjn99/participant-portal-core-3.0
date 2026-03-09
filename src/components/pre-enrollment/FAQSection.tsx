import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ_KEYS = [
  "faq401k",
  "faqContribute",
  "faqChangeLater",
  "faqLeaveCompany",
  "faqEmployerMatch",
] as const;

export function FAQSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-2xl mx-auto w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--color-text)]">
          {t("dashboard.faqTitle", "Frequently asked questions")}
        </h2>
        <p className="text-[var(--color-textSecondary)] mt-2">
          {t("dashboard.faqSubtitle", "Everything you need to know about enrollment")}
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_KEYS.map((key, index) => {
          const question = t(`dashboard.${key}Question`);
          const answer = t(`dashboard.${key}Answer`);
          const isOpen = openIndex === index;

          return (
            <div
              key={key}
              className="border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] overflow-hidden transition-all duration-200 hover:border-[var(--color-border)]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 rounded-xl"
              >
                <span className="font-medium text-[var(--color-text)] pr-4">{question}</span>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-[var(--color-textSecondary)] shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[var(--color-textSecondary)] shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 text-[var(--color-textSecondary)] leading-relaxed border-t border-[var(--color-border)] pt-4">
                      {answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
