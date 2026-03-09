/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navbar } from '@/src/components/Navbar';
import { Hero } from '@/src/components/Hero';
import { InsightCards } from '@/src/components/InsightCards';
import { EnrollmentSteps } from '@/src/components/EnrollmentSteps';
import { LearningSection } from '@/src/components/LearningSection';
import { SupportSection } from '@/src/components/SupportSection';
import { FAQSection } from '@/src/components/FAQSection';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Hero />
        
        <div className="mt-6 space-y-8">
          <InsightCards />
          <EnrollmentSteps />
          <LearningSection />
          <SupportSection />
          <FAQSection />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gray-900 flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="font-semibold text-gray-900">RetireReady</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2024 RetireReady Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-900">Privacy</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
