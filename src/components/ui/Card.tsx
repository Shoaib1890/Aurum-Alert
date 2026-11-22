import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        'bg-white rounded-xl border border-slate-200/80 shadow-sm transition-all',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={twMerge('p-5 border-b border-slate-100', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div className={twMerge('p-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={twMerge('p-4 bg-slate-50/70 border-t border-slate-100 rounded-b-xl', className)}
      {...props}
    >
      {children}
    </div>
  );
}
