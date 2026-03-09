import React from 'react';
import { CheckCircle2, Circle, DollarSign, PieChart, Users, FileCheck } from 'lucide-react';
import { motion } from 'motion/react';

const steps = [
  { id: 1, title: 'Contribution', description: 'Choose rate', icon: DollarSign, status: 'current' },
  { id: 2, title: 'Investments', description: 'Select strategy', icon: PieChart, status: 'upcoming' },
  { id: 3, title: 'Beneficiaries', description: 'Add details', icon: Users, status: 'upcoming' },
  { id: 4, title: 'Review', description: 'Activate plan', icon: FileCheck, status: 'upcoming' },
];

export function EnrollmentSteps() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Enrollment takes 4 quick steps</h2>
        <span className="text-sm text-gray-500 hidden sm:block">Approx. 4 minutes</span>
      </div>

      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 hidden md:block z-0" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex md:flex-col items-center gap-4 md:gap-3 md:text-center hover:border-emerald-200 transition-colors cursor-pointer group"
            >
              <div className={`
                h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300
                ${step.status === 'current' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-gray-100 text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600'}
              `}>
                <step.icon className="h-5 w-5" />
              </div>
              
              <div className="flex-1 md:flex-none">
                <h3 className={`font-semibold ${step.status === 'current' ? 'text-gray-900' : 'text-gray-600'}`}>
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>

              {step.status === 'current' && (
                <div className="md:hidden ml-auto">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    Start
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          You can change these settings anytime later.
        </p>
      </div>
    </section>
  );
}
