import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = 'bg-brand-600' }) => {
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div 
        className={`${color} h-2 rounded-full transition-all duration-1000 ease-out`} 
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} 
      />
    </div>
  );
};