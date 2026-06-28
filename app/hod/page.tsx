'use client';

import { Header } from '@/components/Header';
import { HODDashboardPage } from '@/components/pages/HODDashboardPage';

export default function HODPage() {
  return (
    <div className="min-h-screen bg-[#fcf0e3]">
      <Header />
      <main className="p-4 lg:p-6 max-w-7xl mx-auto">
        <HODDashboardPage />
      </main>
    </div>
  );
}
