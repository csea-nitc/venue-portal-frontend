'use client';

import { cn } from '@/lib/utils';
import { Group } from 'react-aria-components';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <Group className={cn('bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden block', className)}>
      {children}
    </Group>
  );
}

export function StatCard({ title, value, variant = 'default' }: {
  title: string;
  value: string | number;
  variant?: 'default' | 'danger';
}) {
  return (
    <Group className={cn(
      'bg-card/50 rounded-2xl p-4 shadow-sm border border-card-header/45 transition-all block',
      'hover:shadow-md hover:border-card-header',
      variant === 'danger' && 'border-red-200 bg-red-50/50'
    )}>
      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">{title}</p>
      <p className={cn(
        'text-2xl sm:text-3xl font-extrabold text-primary',
        variant === 'danger' && 'text-red-700'
      )}>
        {value}
      </p>
    </Group>
  );
}
