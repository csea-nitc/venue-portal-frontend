'use client';

import { Header } from '@/components/Header';
import { ClubDashboardPage } from '@/components/pages/ClubDashboardPage';

export default function ClubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-4 lg:p-6 max-w-7xl mx-auto">
        <ClubDashboardPage />
      </main>
    </div>
  );
}
