import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  badgeText?: string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showLabel = true,
  badgeText,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl',
  };

  const svgSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-sm font-bold',
    md: 'text-base font-extrabold',
    lg: 'text-xl font-black',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Dynamic Geometric Gradient Logo Icon */}
      <div
        className={`${iconSizes[size]} bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 flex items-center justify-center text-white shadow-sm ring-1 ring-indigo-500/20 relative overflow-hidden group shrink-0`}
      >
        {/* Subtle glass reflection highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/25 pointer-events-none" />
        <svg
          className={`${svgSizes[size]} text-white transition-transform group-hover:scale-105 duration-200`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 14.5L9.5 20L20 6.5" />
          <circle cx="19" cy="5" r="2" fill="#38BDF8" stroke="#38BDF8" strokeWidth="1" />
        </svg>
      </div>

      {showLabel && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`${textSizes[size]} text-slate-900 tracking-tight`}>
              Task<span className="text-indigo-600">Pulse</span>
            </span>
            {badgeText && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-mono">
                {badgeText}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-medium tracking-normal mt-0.5 hidden sm:block">
            Workspace & Task Engine
          </span>
        </div>
      )}
    </div>
  );
};
