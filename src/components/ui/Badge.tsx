import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'navy' | 'outline' | 'success';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'gold',
  className = '' 
}) => {
  const variantStyles = {
    gold: 'bg-gold-faint text-gold border border-gold/30',
    navy: 'bg-navy-card text-rvu-text border border-white/10',
    outline: 'bg-transparent text-rvu-muted border border-gold-border',
    success: 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
