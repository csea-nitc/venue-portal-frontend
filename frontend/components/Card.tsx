'use client';

import { cn } from '@/lib/utils';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden', className)}>
      {children}
    </div>
  );
}

export function StatCard({ title, value, variant = 'default' }: {
  title: string;
  value: string | number;
  variant?: 'default' | 'danger';
}) {
  return (
    <div className={cn(
      'bg-[#f4d9c6]/50 rounded-2xl p-4 shadow-sm border border-[#e9ccbf]/45 flex-1 min-w-[180px] transition-all',
      'hover:shadow-md hover:border-[#e9ccbf]',
      variant === 'danger' && 'border-red-200 bg-red-50/50'
    )}>
      <p className="text-xs font-semibold uppercase tracking-wider text-[#8d6e63] mb-1">{title}</p>
      <p className={cn(
        'text-2xl font-bold tracking-tight', 
        variant === 'danger' ? 'text-[#7a1f32]' : 'text-[#7a1f32]'
      )}>
        {value}
      </p>
    </div>
  );
}
