import { BookOpen, FileText, TrendingUp } from "lucide-react";

export function LearningHubCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-8">
      {/* Learning Items */}
      <div className="px-4 py-6 space-y-4">
        {/* Item 1 */}
        <button className="w-full flex items-start gap-2 px-2 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 mb-1">401(k) Basics: Getting Started</div>
            <div className="text-xs text-gray-500">5 min read</div>
          </div>
        </button>

        {/* Item 2 */}
        <button className="w-full flex items-start gap-2 px-2 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 mb-1">Understanding Employer Match</div>
            <div className="text-xs text-gray-500">3 min read</div>
          </div>
        </button>

        {/* Item 3 */}
        <button className="w-full flex items-start gap-2 px-2 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 mb-1">Choosing Your Investment Strategy</div>
            <div className="text-xs text-gray-500">8 min read</div>
          </div>
        </button>
      </div>
    </div>
  );
}