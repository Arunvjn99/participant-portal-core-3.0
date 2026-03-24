/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  UserCircle, 
  ChevronRight,
  BookOpen,
  Calendar,
  Sparkles,
  TrendingUp,
  ArrowRightLeft,
  FileText,
  PieChart,
  Zap
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

// --- Types ---

interface UserData {
  name: string;
  company: string;
}

interface LearningResource {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
  icon: React.ReactNode;
}

// --- Mock Data ---

const MOCK_USER: UserData = {
  name: "Alex",
  company: "Acme Corp",
};

const LEARNING_RESOURCES: LearningResource[] = [
  {
    id: '1',
    title: 'The Magic of Compound Interest',
    subtitle: 'Learn how your savings grow exponentially over time.',
    readTime: '3 min read',
    icon: <Zap className="w-5 h-5 text-amber-500" />
  },
  {
    id: '2',
    title: 'Roth vs Traditional',
    subtitle: 'A simple guide to choosing the right tax advantage.',
    readTime: '4 min read',
    icon: <ArrowRightLeft className="w-5 h-5 text-blue-500" />
  },
  {
    id: '3',
    title: 'How Much Should I Save?',
    subtitle: 'Finding the perfect contribution rate for your goals.',
    readTime: '5 min read',
    icon: <PieChart className="w-5 h-5 text-teal-500" />
  },
  {
    id: '4',
    title: 'Sustainable Investing 101',
    subtitle: 'Aligning your portfolio with your personal values.',
    readTime: '3 min read',
    icon: <TrendingUp className="w-5 h-5 text-emerald-500" />
  }
];

// --- Components ---

export default function App() {
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);
  const { scrollY } = useScroll();
  
  // Parallax effect for the background video
  const videoY = useTransform(scrollY, [0, 500], [0, 150]);
  const videoScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentResourceIndex((prev) => (prev + 1) % LEARNING_RESOURCES.length);
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const currentResource = LEARNING_RESOURCES[currentResourceIndex];

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden">
      {/* HEADER */}
      <nav className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-800">RetireSmart</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-full border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden">
            <UserCircle className="text-slate-400 w-8 h-8" />
          </div>
        </div>
      </nav>

      <main>
        {/* HERO SECTION - Full Background Image Redesign */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden isolate">
          {/* Background Image Layer with Parallax */}
          <motion.div 
            style={{ y: videoY, scale: videoScale }}
            className="absolute inset-0 w-full h-full -z-10 bg-slate-100"
          >
            <img 
              src="https://labs.google/fx/api/og-image/2bml8n3o0g000"
              alt="Hero Background"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Refined Gradient Overlay Layer */}
          {/* Left side focus for readability - specific requested gradient */}
          <div 
            className="absolute inset-0 z-0" 
            style={{ 
              background: 'linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.75) 40%, rgba(255,255,255,0.0) 70%)' 
            }} 
          />
          
          {/* Bottom fade transition to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F4F7FB] to-transparent z-10" />
          
          <div className="max-w-7xl mx-auto px-8 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Hero Content */}
              <div className="lg:col-span-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-blue-600 font-bold text-xl mb-4"
                  >
                    Good morning, {MOCK_USER.name}
                  </motion.p>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-[60px] font-black tracking-tighter mb-6 text-slate-900 leading-[1.1]"
                  >
                    Let’s build your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">future together.</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-slate-600 text-[18px] leading-relaxed mb-10 max-w-2xl font-medium"
                  >
                    {MOCK_USER.company} offers a premium 401(k) retirement plan designed to help your wealth grow effortlessly through smart, automated investing.
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-10"
                  >
                    <div className="flex flex-col gap-3">
                      <motion.button 
                        whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-14 py-7 bg-blue-600 text-white font-bold rounded-3xl shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:bg-blue-700 transition-all text-2xl flex items-center justify-center gap-4 group"
                      >
                        Start Enrollment
                        <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                      <p className="text-slate-400 text-sm font-semibold pl-2 tracking-wide">Secure 3-minute setup.</p>
                    </div>
                    <button className="text-slate-700 font-bold text-xl hover:text-blue-600 transition-all flex items-center gap-2 group">
                      Learn about the plan
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-8 py-24">
          {/* RECOMMENDED LEARNING - Single High-Attention Card */}
          <section className="mb-32">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-[32px] font-bold text-slate-800 tracking-tight">Recommended Learning</h2>
            </div>
            
            <motion.div
              key={currentResource.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative group cursor-pointer"
              onClick={() => window.open('https://external-provider.com', '_blank')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-violet-600/5 rounded-[2.5rem] -z-10 group-hover:from-blue-600/10 group-hover:to-violet-600/10 transition-colors" />
              <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-10 md:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center gap-10 hover:shadow-lg transition-all">
                <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {currentResource.icon}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                      Featured Topic
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5" />
                      {currentResource.readTime}
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
                    {currentResource.title}
                  </h3>
                  <p className="text-slate-500 text-xl leading-relaxed max-w-2xl">
                    {currentResource.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-blue-600 font-bold text-lg group-hover:translate-x-2 transition-transform">
                  Explore learning resources
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
              
              {/* Progress Indicators for Rotation */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {LEARNING_RESOURCES.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-500 ${idx === currentResourceIndex ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`}
                  />
                ))}
              </div>
            </motion.div>
          </section>

          {/* SUPPORT SECTION - Bento Style Asymmetry */}
          <section className="mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Specialist Card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-7 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center gap-10 group cursor-pointer hover:shadow-md transition-all"
              >
                <div className="w-24 h-24 bg-teal-50 rounded-[2rem] flex items-center justify-center shrink-0 group-hover:bg-teal-500 transition-colors">
                  <Calendar className="text-teal-600 w-10 h-10 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-[24px] mb-2">Speak with a retirement specialist</h4>
                  <p className="text-slate-500 text-lg leading-relaxed mb-6">Schedule a free 15-minute call to discuss your options and get personalized guidance.</p>
                  <div className="flex items-center gap-2 text-teal-600 font-bold group-hover:translate-x-1 transition-transform">
                    Schedule call <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>

              {/* AI Assistant Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-5 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm flex flex-col justify-between group cursor-pointer hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200">
                  <MessageSquare className="text-white w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-[24px] mb-2">Ask our AI Assistant</h4>
                  <p className="text-slate-500 leading-relaxed mb-8 text-lg">Get instant answers to your retirement questions 24/7.</p>
                  <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                    Start chatting <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3 opacity-50">
              <ShieldCheck className="text-slate-400 w-6 h-6" />
              <span className="font-bold text-xl tracking-tight text-slate-400">RetireSmart</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">
              &copy; 2026 RetireSmart by {MOCK_USER.company}. All rights reserved.
            </p>
            <div className="flex items-center gap-8 text-slate-400 text-sm font-bold uppercase tracking-widest">
              <button className="hover:text-slate-600 transition-colors">Privacy</button>
              <button className="hover:text-slate-600 transition-colors">Terms</button>
              <button className="hover:text-slate-600 transition-colors">Support</button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
