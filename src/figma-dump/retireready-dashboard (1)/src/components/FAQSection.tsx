import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

const faqs = [
  {
    question: "What is a 401(k) plan?",
    answer: "A 401(k) is a retirement savings plan sponsored by your employer. It lets you save and invest a piece of your paycheck before taxes are taken out. Taxes aren't paid until the money is withdrawn from the account."
  },
  {
    question: "How much should I contribute?",
    answer: "Most financial experts recommend saving 10% to 15% of your income. However, a great starting point is to contribute at least enough to get your full employer match, as that is essentially free money."
  },
  {
    question: "Can I change my contribution later?",
    answer: "Yes, absolutely. You can change your contribution rate or investment choices at any time through this dashboard. Changes usually take 1-2 pay periods to go into effect."
  },
  {
    question: "What happens if I leave the company?",
    answer: "Your money is yours to keep. You can leave it in this plan (if the balance meets the minimum), roll it over to an IRA or your new employer's plan, or cash it out (though taxes and penalties may apply)."
  },
  {
    question: "How does employer matching work?",
    answer: "Your employer puts money into your account based on how much you contribute. For example, if they match 50% up to 6%, and you contribute 6% of your salary, they will add an extra 3% of your salary to your account."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Frequently asked questions</h2>
        <p className="text-gray-500 mt-2">Everything you need to know about enrollment</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-xl bg-white overflow-hidden transition-all duration-200 hover:border-gray-300"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
