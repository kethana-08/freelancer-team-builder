import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  color = 'indigo',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizes = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colors = {
    indigo: 'bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-glow',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-glow-emerald',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-500',
    rose: 'bg-gradient-to-r from-rose-500 to-pink-500',
    accent: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium text-slate-300">
          {label && <span>{label}</span>}
          {showValue && <span className="text-slate-400 font-mono">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50`}>
        <div
          className={`${sizes[size]} rounded-full transition-all duration-500 ease-out ${colors[color] || colors.indigo}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
