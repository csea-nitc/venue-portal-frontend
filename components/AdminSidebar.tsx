'use client';

import { Button as AriaButton } from 'react-aria-components';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  Settings, 
  FileText, 
  X,
  MapPin,
  User,
  Shield
} from 'lucide-react';

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'venues', label: 'Venues', icon: MapPin },
  { id: 'clubs', label: 'Clubs', icon: Users },
  { id: 'people', label: 'People', icon: User },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'audit', label: 'Audit Logs', icon: FileText },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

type AdminSidebarProps = {
  activeItem: string;
  setActiveItem: (item: string) => void;
  isOpen: boolean;
  onClose: () => void;
};

export function AdminSidebar({ activeItem, setActiveItem, isOpen, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Sidebar Drawer */}
      <aside className={cn(
        "bg-[#7a1f32] text-white border-r border-[#5a1725] transition-transform duration-300 ease-in-out",
        "fixed lg:static top-0 left-0 h-full lg:h-full w-64 z-50 flex flex-col justify-between",
        "lg:translate-x-0", 
        isOpen ? "translate-x-0" : "-translate-x-full" // Toggle translation on mobile
      )}>
        <div>
          {/* Header area of Sidebar */}
          <div className="p-6 border-b border-[#5a1725] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#4b90a1]" />
              <span className="text-xl font-bold tracking-wide">Admin Panel</span>
            </div>
            {/* Close button for mobile views */}
            <AriaButton
              onPress={onClose}
              className="lg:hidden p-1.5 hover:bg-white/10 rounded transition-colors text-white/80 hover:text-white focus:outline-none"
              aria-label="Close Sidebar"
            >
              <X size={20} />
            </AriaButton>
          </div>

          <nav className="p-4 space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <AriaButton
                  key={item.id}
                  onPress={() => {
                    setActiveItem(item.id);
                    onClose(); // Auto close on select on mobile
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-150 focus:outline-none",
                    isActive 
                      ? "bg-[#b76f7c] text-white shadow-inner" 
                      : "text-white/80 hover:bg-[#5a1725] hover:text-white"
                  )}
                >
                  <Icon size={18} className={isActive ? "text-white" : "text-white/70"} />
                  <span>{item.label}</span>
                </AriaButton>
              );
            })}
          </nav>
        </div>

      </aside>

      {/* Dimmed Overlay on Mobile when sidebar drawer is active */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
    </>
  );
}