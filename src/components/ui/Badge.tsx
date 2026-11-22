import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'slate' | 'rose' | 'blue';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export function Badge({
  children,
  variant = 'slate',
  size = 'sm',
  className,
  dot = false,
}: BadgeProps) {
  const variantStyles = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    rose: 'bg-rose-50 text-rose-800 border-rose-200',
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const dotColors = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    slate: 'bg-slate-400',
    rose: 'bg-rose-500',
    blue: 'bg-blue-500',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={twMerge(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
}
