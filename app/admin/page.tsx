'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminDashboard } from '@/components/pages/AdminDashboard';

export default function AdminPage() {
  const [adminSection, setAdminSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-[#fcf0e3] overflow-hidden">
      <Header onMenuPress={() => setSidebarOpen(true)} />
      <div className="flex flex-grow flex-1 overflow-hidden">
        <AdminSidebar 
          activeItem={adminSection} 
          setActiveItem={setAdminSection} 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-grow overflow-y-auto p-4 lg:p-6 transition-all duration-300">
          <AdminDashboard activeSection={adminSection} />
        </main>
      </div>
    </div>
  );
}
