import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] select-none';

  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 focus:ring-indigo-500 border border-indigo-500/30 hover:shadow-indigo-500/35',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 focus:ring-slate-600 shadow-sm',
    accent: 'bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/20 border border-fuchsia-400/30',
    emerald: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 focus:ring-emerald-500 border border-emerald-500/30',
    danger: 'bg-rose-600/90 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 focus:ring-rose-500 border border-rose-500/30',
    ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent focus:ring-slate-600',
    outline: 'bg-transparent hover:bg-indigo-500/10 text-indigo-400 hover:text-indigo-300 border border-indigo-500/40 hover:border-indigo-500/80 focus:ring-indigo-500'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
    icon: 'p-2'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};
