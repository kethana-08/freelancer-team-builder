import React from 'react';

export const Avatar = ({
  src,
  name = 'User',
  size = 'md',
  status, // 'online', 'offline', 'busy'
  className = '',
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base font-semibold',
    xl: 'w-16 h-16 text-lg font-bold',
    '2xl': 'w-24 h-24 text-2xl font-bold',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1.5',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-4 h-4 ring-2',
    '2xl': 'w-5 h-5 ring-4',
  };

  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  // Generate deterministic gradient based on name string
  const getGradient = (n) => {
    const charCode = (n || 'U').charCodeAt(0) + (n || 'U').charCodeAt(1 || 0);
    const gradients = [
      'from-indigo-600 to-purple-600',
      'from-emerald-600 to-teal-600',
      'from-rose-600 to-pink-600',
      'from-amber-600 to-orange-600',
      'from-cyan-600 to-blue-600',
      'from-fuchsia-600 to-pink-600'
    ];
    return gradients[charCode % gradients.length];
  };

  return (
    <div className={`relative inline-flex shrink-0 ${sizes[size]} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover rounded-full ring-1 ring-white/10"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div
          className={`w-full h-full rounded-full bg-gradient-to-tr ${getGradient(name)} flex items-center justify-center text-white font-medium shadow-inner ring-1 ring-white/15`}
        >
          {getInitials(name)}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-slate-950 ${statusSizes[size]} ${
            status === 'online'
              ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
              : status === 'busy'
              ? 'bg-amber-500'
              : 'bg-slate-500'
          }`}
        />
      )}
    </div>
  );
};
