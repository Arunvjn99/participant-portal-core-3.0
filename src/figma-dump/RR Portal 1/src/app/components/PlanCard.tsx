import { Check, Sparkles, TrendingUp, Shield, PiggyBank, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { AskAIButton } from "./AskAIButton";

interface PlanCardProps {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  isSelected: boolean;
  onSelect: () => void;
}

export function PlanCard({ id, title, description, benefits, isSelected, onSelect }: PlanCardProps) {
  // Determine icon and color based on plan type
  const isRoth = id.includes("roth");
  const PlanIcon = isRoth ? TrendingUp : Shield;
  const accentColor = isRoth ? "blue" : "purple";
  
  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-gradient-to-br from-white via-white to-gray-50/30 rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected
          ? "border-blue-600 shadow-xl ring-4 ring-blue-100"
          : "border-gray-200 hover:border-blue-300"
      }`}
    >
      {/* Elegant gradient overlay */}
      <div className={`absolute top-0 right-0 w-96 h-96 opacity-[0.07] pointer-events-none ${
        isRoth ? "bg-gradient-to-br from-blue-300 via-blue-400 to-indigo-500" : "bg-gradient-to-br from-purple-300 via-purple-400 to-pink-500"
      } rounded-full blur-3xl -translate-y-1/3 translate-x-1/3`} />
      
      {/* Secondary gradient */}
      <div className={`absolute bottom-0 left-0 w-72 h-72 opacity-[0.05] pointer-events-none ${
        isRoth ? "bg-gradient-to-tr from-cyan-300 to-blue-400" : "bg-gradient-to-tr from-indigo-300 to-purple-400"
      } rounded-full blur-3xl translate-y-1/3 -translate-x-1/4`} />
      
      {/* Decorative circles */}
      <div className={`absolute -bottom-8 -left-8 w-32 h-32 ${
        isRoth ? "bg-gradient-to-br from-blue-100 to-blue-200" : "bg-gradient-to-br from-purple-100 to-purple-200"
      } rounded-full opacity-20 blur-2xl`} />
      <div className={`absolute top-1/2 right-12 w-20 h-20 ${
        isRoth ? "bg-gradient-to-br from-blue-200 to-cyan-200" : "bg-gradient-to-br from-purple-200 to-pink-200"
      } rounded-full opacity-15 blur-xl`} />
      
      {/* Additional small decorative dots */}
      <div className={`absolute top-8 right-24 w-12 h-12 ${
        isRoth ? "bg-blue-100" : "bg-purple-100"
      } rounded-full opacity-30 blur-lg`} />
      <div className={`absolute bottom-16 right-8 w-16 h-16 ${
        isRoth ? "bg-cyan-100" : "bg-pink-100"
      } rounded-full opacity-25 blur-xl`} />
      
      {/* Subtle line pattern overlay */}
      <div className="absolute inset-0 opacity-[0.005] pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(60deg, transparent, transparent 25px, rgba(0,0,0,0.01) 25px, rgba(0,0,0,0.01) 50px)'
      }} />
      
      {/* Selected Badge */}
      {isSelected && (
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute -top-3 -right-3 z-30"
        >
          <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 shadow-lg">
            <Check className="w-4 h-4 mr-1" />
            Selected
          </Badge>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-6 relative z-10">
        {/* Left Side - Plan Header */}
        <div className="md:w-1/3">
          {/* Icon and Title Row */}
          <div className="flex items-center gap-3 mb-3">
            {/* Icon Badge with animation */}
            <motion.div 
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className={`flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 relative ${
              isRoth ? "bg-gradient-to-br from-blue-50 to-blue-100" : "bg-gradient-to-br from-purple-50 to-purple-100"
            }`}>
              <PlanIcon className={`w-6 h-6 ${
                isRoth ? "text-blue-600" : "text-purple-600"
              }`} />
              {/* Small decorative dot */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute -top-1 -right-1 w-3 h-3 ${
                  isRoth ? "bg-blue-500" : "bg-purple-500"
                } rounded-full`}
              />
            </motion.div>
            
            <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 md:mb-6">{description}</p>
          
          {/* Ask AI Button - Enhanced with animations */}
          <AskAIButton
            fullWidth
            className="mb-3"
            onClick={(e) => {
              e.stopPropagation();
              // Handle Ask AI action
            }}
          />

          {/* Select This Plan Button */}
          <Button
            variant="secondary"
            className={`w-full transition-all duration-300 ${
              isSelected
                ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-2 border-green-600 hover:from-green-200 hover:to-emerald-200"
                : "hover:shadow-md"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <div className="flex items-center justify-center gap-2">
              {isSelected ? (
                <>
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">Selected</span>
                </>
              ) : (
                <>
                  <span className="font-semibold">Select Plan</span>
                </>
              )}
            </div>
          </Button>
        </div>

        {/* Right Side - Benefits List */}
        <div className="md:w-2/3 md:border-l md:border-gray-200 md:pl-6">
          <div className="flex items-center gap-2 mb-4">
            <PiggyBank className="w-5 h-5 text-green-600" />
            <h4 className="text-sm font-semibold text-gray-900">Key Benefits</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {benefits.slice(0, 4).map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="inline-flex items-center gap-2 bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-lg px-3 py-2 hover:shadow-sm transition-shadow"
              >
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}