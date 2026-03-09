import React from 'react';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Bot, Phone, Calendar } from 'lucide-react';

export function SupportSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Need help deciding?</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Assistant */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Bot className="h-6 w-6 text-purple-600" />
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="font-semibold text-lg text-gray-900">AI Assistant</h3>
              <p className="text-gray-500">Get instant answers about your retirement plan, contribution limits, and vesting.</p>
              <Button variant="secondary" className="w-full sm:w-auto text-purple-700 bg-purple-50 hover:bg-purple-100">
                Ask AI Assistant
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Human Advisor */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="font-semibold text-lg text-gray-900">Retirement Specialist</h3>
              <p className="text-gray-500">Schedule a 1-on-1 conversation with a certified financial advisor.</p>
              <Button variant="secondary" className="w-full sm:w-auto text-blue-700 bg-blue-50 hover:bg-blue-100">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
