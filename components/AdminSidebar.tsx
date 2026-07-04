'use client';

import { Button as AriaButton } from 'react-aria-components';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Settings, 
  X,
  Shield,
  LayoutDashboard,
  Building2,
  Users2,
  ScrollText,
  Activity
} from 'lucide-react';

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'venues', label: 'Venues', icon: Building2 },
  { id: 'clubs', label: 'Clubs', icon: Users2 },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'audit', label: 'Audit Logs', icon: ScrollText },
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
        "bg-primary text-white border-r border-primary-dark transition-all duration-300 ease-in-out",
        "fixed lg:static top-0 left-0 h-full w-64 z-50 flex flex-col justify-between",
        "lg:translate-x-0 shadow-2xl lg:shadow-none", 
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div>
          {/* Header area of Sidebar */}
          <div className="p-6 border-b border-primary-dark flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <span className="text-xl font-bold tracking-tight">Admin Panel</span>
            </div>
            {/* Close button for mobile views */}
            <AriaButton
              onPress={onClose}
              className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors text-white focus:outline-none"
              aria-label="Close Sidebar"
            >
              <X size={20} />
            </AriaButton>
          </div>

          <nav className="p-4 space-y-1">
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
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 focus:outline-none group relative overflow-hidden",
                    isActive 
                      ? "bg-white text-primary shadow-lg" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
                  )}
                  <Icon size={18} className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-primary" : "text-white/50 group-hover:text-white"
                  )} />
                  <span>{item.label}</span>
                </AriaButton>
              );
            })}
          </nav>
        </div>

        {/* Footer area */}
        <div className="p-4 border-t border-primary-dark bg-primary-dark/30">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold shadow-inner">
              AD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-sm truncate">Administrator</p>
              <div className="flex items-center gap-1 text-[10px] text-white/50 font-medium">
                <Activity size={10} className="text-green-400" />
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Dimmed Overlay on Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#2d0b13]/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
    </>
  );
}
