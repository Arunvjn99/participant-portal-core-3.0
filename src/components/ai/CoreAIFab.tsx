import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { CoreAssistantModal } from "../core-ai/CoreAssistantModal";

/**
 * CoreAIFab — Single floating "Ask Core AI" pill button.
 * Opens the unified CoreAssistantModal.
 *
 * This is the ONLY entry point to Core AI.
 * Entrance: slide-up + fade-in. Idle: subtle glow pulse ring.
 */
export const CoreAIFab = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16, transition: { duration: 0.15 } }}
            transition={{ duration: 0.45, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Glow pulse ring */}
            <span
              className="absolute inset-0 rounded-full opacity-0"
              style={{ animation: "core-ai-glow 3s ease-in-out infinite" }}
              aria-hidden="true"
            />

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="core-ai-fab-btn relative flex items-center gap-2.5 rounded-full px-5 py-3 text-white shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-transparent"
              aria-label={t("coreAi.fabAria")}
            >
              <motion.img
                src="/image/bella-icon.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
                aria-hidden="true"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-sm font-semibold">{t("coreAi.fabLabel")}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <CoreAssistantModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
