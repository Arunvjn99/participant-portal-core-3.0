import React from 'react';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { BookOpen, ChevronRight } from 'lucide-react';

export function LearningSection() {
  return (
    <section>
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-none overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center rounded-lg bg-white/10 px-3 py-1 text-sm text-white/90 backdrop-blur-sm">
              <BookOpen className="mr-2 h-4 w-4" />
              Featured Guide
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Understanding your retirement plan</h2>
            <p className="text-gray-300 text-lg">
              Learn how contributions, investments, and employer matching work together to build your future wealth.
            </p>
          </div>
          
          <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-gray-900 min-w-[200px] h-14 text-lg backdrop-blur-sm">
            Explore Learning Center
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
