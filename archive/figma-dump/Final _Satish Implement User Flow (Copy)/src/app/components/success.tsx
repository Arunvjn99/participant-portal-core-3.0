import { useNavigate } from "react-router";
import { CheckCircle, Mail, Calendar, BarChart3 } from "lucide-react";

export function Success() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8 max-w-md w-full text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div>
          <h1 className="text-gray-900">Congratulations!</h1>
          <p className="text-gray-500 mt-2" style={{ fontSize: "0.9rem" }}>
            Your retirement plan has been successfully activated.
          </p>
        </div>

        {/* What Happens Next */}
        <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-4">
          <p className="text-gray-700" style={{ fontWeight: 600, fontSize: "0.9rem" }}>What happens next</p>
          {[
            { icon: Calendar, text: "Contributions start next pay period" },
            { icon: Mail, text: "Confirmation email will be sent" },
            { icon: BarChart3, text: "Track savings from dashboard" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-gray-700" style={{ fontSize: "0.85rem" }}>{item.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/plan")}
          className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
