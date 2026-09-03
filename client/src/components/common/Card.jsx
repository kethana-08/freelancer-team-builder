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
      className={`rounded-xl p-5 sm:p-6 transition-all duration-200 ${
        glass ? 'surface-panel shadow-sm' : 'bg-slate-900 border border-slate-800'
      } ${
        hover ? 'hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
