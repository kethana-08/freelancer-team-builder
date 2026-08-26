import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  icon: Icon
}) => {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/30',
    emerald: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-950/80 text-amber-300 border-amber-500/30',
    rose: 'bg-rose-950/80 text-rose-300 border-rose-500/30',
    purple: 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-500/30',
    cyan: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30',
    high: 'bg-rose-950/90 text-rose-300 border-rose-500/40 font-semibold',
    medium: 'bg-amber-950/90 text-amber-300 border-amber-500/40 font-semibold',
    low: 'bg-sky-950/90 text-sky-300 border-sky-500/40 font-semibold',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span className={`inline-flex items-center rounded-lg border font-medium ${variants[variant] || variants.default} ${sizes[size]} ${className}`}>
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
};
