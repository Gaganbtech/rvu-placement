import React from 'react';

interface CircuitBackgroundProps {
  className?: string;
  variant?: 'hero' | 'section' | 'subtle';
}

export const CircuitBackground: React.FC<CircuitBackgroundProps> = ({
  className = '',
  variant = 'hero'
}) => {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`} 
      aria-hidden="true"
    >
      {/* Radial ambient gold glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold-faint rounded-full blur-[140px] opacity-40" />
      {variant === 'hero' && (
        <div className="absolute top-1/3 right-10 w-[500px] h-[350px] bg-gold-muted/10 rounded-full blur-[120px] opacity-30" />
      )}

      {/* Subtle Circuit Vector Network */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="circuit-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="1" fill="#CCAA68" opacity="0.3" />
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#CCAA68" strokeWidth="0.5" opacity="0.08" />
          </pattern>
          <linearGradient id="gold-wire" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CCAA68" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#D8B978" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#CCAA68" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Base Grid */}
        <rect width="100%" height="100%" fill="url(#circuit-grid)" />

        {/* Decorative Circuit Paths */}
        <g stroke="url(#gold-wire)" fill="none" strokeWidth="1">
          {/* Top-Right Circuit Trace */}
          <path d="M 650 40 H 800 L 850 90 V 220 H 980" opacity="0.5" />
          <circle cx="650" cy="40" r="3" fill="#CCAA68" opacity="0.8" />
          <circle cx="980" cy="220" r="3" fill="#CCAA68" opacity="0.8" />

          {/* Left Circuit Trace */}
          <path d="M 50 160 H 180 L 220 200 H 340 V 310" opacity="0.4" />
          <circle cx="50" cy="160" r="2.5" fill="#CCAA68" opacity="0.7" />
          <circle cx="340" cy="310" r="2.5" fill="#CCAA68" opacity="0.7" />

          {/* Animated Flow Line */}
          <path 
            d="M 200 80 H 420 L 480 140 H 680" 
            stroke="#CCAA68" 
            strokeWidth="1.2"
            strokeDasharray="8 12"
            className="animate-circuit"
          />

          {/* Geometric Chip Accent */}
          <g transform="translate(900, 140)" opacity="0.3">
            <rect x="0" y="0" width="36" height="36" rx="4" stroke="#CCAA68" strokeWidth="1" />
            <circle cx="18" cy="18" r="4" fill="#CCAA68" />
            <line x1="-10" y1="18" x2="0" y2="18" stroke="#CCAA68" />
            <line x1="36" y1="18" x2="46" y2="18" stroke="#CCAA68" />
            <line x1="18" y1="-10" x2="18" y2="0" stroke="#CCAA68" />
            <line x1="18" y1="36" x2="18" y2="46" stroke="#CCAA68" />
          </g>
        </g>
      </svg>
    </div>
  );
};
