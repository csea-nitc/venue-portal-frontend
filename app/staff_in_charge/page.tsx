'use client';

import { Header } from '@/components/Header';
import { StaffInchargeDashboardPage } from '@/components/pages/StaffInchargeDashboardPage';

export default function StaffInchargePage() {
  return (
    <div className="min-h-screen bg-[#fcf0e3]">
      <Header />
      <main className="p-4 lg:p-6 max-w-7xl mx-auto">
        <StaffInchargeDashboardPage />
      </main>
    </div>
  );
}
