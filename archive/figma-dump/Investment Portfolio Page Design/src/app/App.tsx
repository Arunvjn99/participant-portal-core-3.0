import { Bell, Settings, User, ChevronDown, Menu } from "lucide-react";
import { PortfolioSnapshot } from "./components/PortfolioSnapshot";
import { PortfolioPerformance } from "./components/PortfolioPerformance";
import { PortfolioAllocation } from "./components/PortfolioAllocation";
import { RetirementPlanning } from "./components/RetirementPlanning";
import { RecommendedActions } from "./components/RecommendedActions";

function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs" style={{ fontWeight: 700 }}>R</span>
            </div>
            <div>
              <p className="text-sm text-gray-900 hidden sm:block" style={{ fontWeight: 600 }}>RetireWell</p>
              <p className="text-xs text-gray-500 hidden sm:block">Participant Portal</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {["Dashboard", "Investments", "Contributions", "Documents"].map((item, i) => (
              <button
                key={item}
                className={`px-3.5 py-2 rounded-lg text-sm transition-colors ${
                  i === 1 ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
                style={{ fontWeight: i === 1 ? 500 : 400 }}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="md:hidden w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center">
              <Menu className="w-4.5 h-4.5 text-gray-500" />
            </button>
            <button className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors relative">
              <Bell className="w-4.5 h-4.5 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <button className="hidden sm:flex w-9 h-9 rounded-lg hover:bg-gray-100 items-center justify-center transition-colors">
              <Settings className="w-4.5 h-4.5 text-gray-500" />
            </button>
            <div className="hidden sm:flex items-center gap-2 ml-1 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden lg:block">
                <p className="text-sm text-gray-900" style={{ fontWeight: 500 }}>Sarah Chen</p>
                <p className="text-xs text-gray-500">Acme Corp</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function PageHeader() {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <p className="text-sm text-gray-500 mb-0.5">Good morning, Sarah</p>
          <h1 className="text-gray-900">Investment Portfolio</h1>
        </div>
        <p className="text-xs text-gray-400">Updated Mar 16, 2026 · 9:41 AM EST</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50/80">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <PageHeader />

        {/* Narrative Flow: Data → Insights → Actions */}
        <div className="space-y-5 sm:space-y-6">

          {/* Section 1 — How much do I have? */}
          <PortfolioSnapshot />

          {/* Section 2 — How is it performing? */}
          <PortfolioPerformance />

          {/* Section 3 — How is my money allocated? */}
          <PortfolioAllocation />

          {/* Section 4 — What does this mean for retirement? */}
          <RetirementPlanning />

          {/* Section 5 — What should I do? */}
          <RecommendedActions />

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <p>© 2026 RetireWell · Acme Corp 401(k) Plan</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
