'use client';

import { cn } from '@/lib/utils';
import { MapPin, Users, User } from 'lucide-react';

type SidebarProps = {
  active: 'venues' | 'clubs' | 'people';
  onNavigate: (item: 'venues' | 'clubs' | 'people') => void;
};

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const items = [
    { id: 'venues', label: 'Venues', icon: MapPin },
    { id: 'clubs', label: 'Clubs', icon: Users },
    { id: 'people', label: 'People', icon: User },
  ] as const;

  return (
    <aside className="w-72 bg-[#91273c] text-white flex flex-col">
      <nav className="flex-1 pt-12">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-4 px-10 py-4 text-xl transition-colors',
                isActive ? 'bg-primary-light' : 'hover:bg-primary'
              )}
            >
              <Icon className="w-7 h-7" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
