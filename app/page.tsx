'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const loggedIn = localStorage.getItem('perms_logged_in');
    if (!loggedIn) {
      router.push('/login');
      return;
    }

    const role = localStorage.getItem('perms_user_role');

    if (role) {
      const normalizedRole = role.toUpperCase();
      const routeMap: Record<string, string> = {
        'ADMIN': '/admin',
        'CLUB': '/club',
        'FACULTY_COORDINATOR': '/faculty_coordinator',
        'STAFF_IN_CHARGE': '/staff_in_charge',
        'FACULTY_IN_CHARGE': '/faculty_in_charge',
        'HOD': '/hod'
      };

      const targetRoute = routeMap[normalizedRole] || '/login';
      router.replace(targetRoute);
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-md rounded-[2rem] border-2 border-card-header p-10 max-w-md w-full text-center shadow-xl space-y-4">
        <div className="flex justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-800 animate-pulse">Welcome back</h2>
          <p className="text-sm text-gray-500">Routing you to your dashboard...</p>
        </div>
      </div>
    </div>
  );
}
