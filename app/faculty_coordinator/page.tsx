'use client';

import { Header } from '@/components/Header';
import { FacultyCoordinatorDashboardPage } from '@/components/pages/FacultyCoordinatorDashboardPage';

export default function FacultyCoordinatorPage() {
  return (
    <div className="min-h-screen bg-[#fcf0e3]">
      <Header />
      <main className="p-4 lg:p-6 max-w-7xl mx-auto">
        <FacultyCoordinatorDashboardPage />
      </main>
    </div>
  );
}
