import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  glass = true,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-6 transition-all duration-300 ${
        glass ? 'glass-panel shadow-xl' : 'bg-slate-900 border border-slate-800'
      } ${
        hover ? 'hover:border-indigo-500/40 hover:shadow-glow hover:-translate-y-0.5 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
