'use client';

import { Menu } from 'lucide-react';

type HeaderProps = {
  onMenuPress?: () => void;
};

export function Header({ onMenuPress }: HeaderProps) {
  return (
    <header className="bg-[#3b6896] text-white py-6 px-8 shadow-md flex items-center justify-between">
      <div className="flex items-center gap-4">
        {onMenuPress && (
          <button 
            onClick={onMenuPress}
            className="lg:hidden p-1.5 hover:bg-white/10 rounded transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            <Menu className="w-6.5 h-6.5" />
          </button>
        )}
        <h1 className="text-4xl font-extrabold tracking-tight">PermsPortal</h1>
      </div>
    </header>
  );
}
