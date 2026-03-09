import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'motion/react';
import { Coins, ArrowUpRight } from 'lucide-react';

const matchData = [
  { name: 'No Match', value: 5000 },
  { name: 'With Match', value: 7500 },
];

const growthData = [
  { year: 'Yr 1', you: 5000, match: 2500 },
  { year: 'Yr 5', you: 28000, match: 14000 },
  { year: 'Yr 10', you: 65000, match: 32500 },
  { year: 'Yr 20', you: 180000, match: 90000 },
];

export function InsightCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Card 1: Employer Match */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Card className="h-full hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Coins className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Free Money</span>
            </div>
            <CardTitle>Don't miss your employer match</CardTitle>
            <CardDescription className="text-base">
              Your employer matches <span className="font-semibold text-gray-900">50% of contributions up to 6%</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-full h-40 sm:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={matchData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                      {matchData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 1 ? '#10b981' : '#e5e7eb'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                <div className="text-3xl font-bold text-gray-900">+$2,500</div>
                <p className="text-sm text-gray-500">
                  Potential free money added to your account every year.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Card 2: Growth Impact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="h-full hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ArrowUpRight className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Compound Growth</span>
            </div>
            <CardTitle>Annual savings impact</CardTitle>
            <CardDescription className="text-base">
              See how small contributions plus the match grow over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="you" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} name="Your Contribution" />
                  <Bar dataKey="match" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} name="Employer Match" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
