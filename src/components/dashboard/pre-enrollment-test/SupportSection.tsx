/**
 * Support section for the AI Studio prototype test dashboard.
 * Grid: lg:col-span-7 + lg:col-span-5 unchanged — cards are constrained integrations from figma-dump/zip (2).
 */
import { motion } from "framer-motion";
import { AICard } from "@/components/dashboard/AICard";
import { LearningCard } from "@/components/dashboard/LearningCard";
import { openCoreAIAssistant } from "@/core/search/aiBridge";

export function SupportSection() {
  return (
    <section className="mb-32">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full min-w-0 lg:col-span-7"
        >
          <LearningCard
            title="Financial Wellness"
            description="Learn about planning, saving, and investing wisely for your future."
            actionLabel="Know more"
            href="https://external-provider.com"
            topicLabel="Learning"
            recommendLabel="Recommended for you"
            progressHint="Based on your plan"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full min-w-0 lg:col-span-5"
        >
          <AICard
            title="Ask Core AI"
            description="Get instant answers and personalized retirement insights anytime."
            actionLabel="Start chatting"
            onAction={() => openCoreAIAssistant()}
            betaLabel="BETA"
          />
        </motion.div>
      </div>
    </section>
  );
}
