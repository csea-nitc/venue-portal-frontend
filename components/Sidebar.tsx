'use client';

import { cn } from '@/lib/utils';
import { MapPin, Users, User, X } from 'lucide-react';

type SidebarProps = {
  active: 'venues' | 'clubs' | 'people';
  onNavigate: (item: 'venues' | 'clubs' | 'people') => void;
  isOpen?: boolean;
  onClose?: () => void;
};

export function Sidebar({ active, onNavigate, isOpen = false, onClose }: SidebarProps) {
  const items = [
    { id: 'venues', label: 'Venues', icon: MapPin },
    { id: 'clubs', label: 'Clubs', icon: Users },
    { id: 'people', label: 'People', icon: User },
  ] as const;

  return (
    <>
      {/* Sidebar Drawer */}
      <aside className={cn(
        'bg-[#91273c] text-white flex flex-col',
        'fixed lg:static top-0 left-0 h-full w-72 z-50 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none',
        'lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Close button for mobile */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-white/20">
          <span className="text-lg font-bold">Navigation</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 pt-4 lg:pt-12">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose?.();
                }}
                className={cn(
                  'w-full flex items-center gap-4 px-8 lg:px-10 py-4 text-xl transition-colors',
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

      {/* Dimmed overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
    </>
  );
}
