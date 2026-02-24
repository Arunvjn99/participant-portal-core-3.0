import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "framer-motion";

interface DisclosureAccordionProps {
  items: Array<{
    id: string;
    title: string;
    content: React.ReactNode;
    defaultOpen?: boolean;
  }>;
  className?: string;
}

/**
 * Accordion expansion with Framer Motion. Subtle 0.2–0.3s ease.
 */
export function DisclosureAccordion({ items, className = "" }: DisclosureAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items.find((i) => i.defaultOpen)?.id ?? null);
  const reduced = useReducedMotion();

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[var(--color-text)]"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              id={`accordion-heading-${item.id}`}
            >
              {item.title}
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: reduced ? 0 : 0.25, ease: "easeOut" }}
                aria-hidden={true}
              >
                ▼
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-content-${item.id}`}
                  role="region"
                  aria-labelledby={`accordion-heading-${item.id}`}
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="border-t border-[var(--color-border)]"
                >
                  <div className="px-4 py-3 text-sm text-[var(--color-textSecondary)]">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
