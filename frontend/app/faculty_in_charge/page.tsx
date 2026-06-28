'use client';

import { Header } from '@/components/Header';
import { FacultyDashboard } from '@/components/pages/FacultyDashboard';

export default function FacultyInChargePage() {
  return (
    <div className="min-h-screen bg-[#fcf0e3]">
      <Header />
      <main className="p-4 lg:p-6 max-w-7xl mx-auto">
        <FacultyDashboard />
      </main>
    </div>
  );
}
