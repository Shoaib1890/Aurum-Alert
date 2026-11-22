import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary:
      'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 shadow-sm',
    secondary:
      'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 disabled:bg-slate-200 disabled:text-slate-400',
    outline:
      'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300 disabled:border-slate-200',
    ghost:
      'text-slate-600 hover:bg-slate-100 active:bg-slate-200 disabled:text-slate-300',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg font-medium',
    md: 'text-sm px-4 py-2 rounded-lg font-medium',
    lg: 'text-base px-5 py-2.5 rounded-xl font-medium',
  };

  return (
    <button
      className={twMerge(
        'inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}
