'use client';

import Link from 'next/link';
import { Shield, Users, Landmark, UserCheck, Briefcase, GraduationCap } from 'lucide-react';

const roles = [
  {
    id: 'club',
    title: 'Club Representative',
    description: 'Submit booking requests for CSEA events and track their approval progress.',
    href: '/club',
    icon: Users,
    color: 'bg-[#4b90a1] text-white',
  },
  {
    id: 'faculty_coordinator',
    title: 'Faculty Coordinator',
    description: 'Review and approve/forward student requests for initial validation.',
    href: '/faculty_coordinator',
    icon: UserCheck,
    color: 'bg-[#7a1f32] text-white',
  },
  {
    id: 'staff_in_charge',
    title: 'Staff in Charge',
    description: 'Manage specific laboratory bookings and verify slot availabilities.',
    href: '/staff_in_charge',
    icon: Briefcase,
    color: 'bg-[#3b6896] text-white',
  },
  {
    id: 'faculty_in_charge',
    title: 'Faculty in Charge',
    description: 'Review venue bookings and provide intermediate clearance.',
    href: '/faculty_in_charge',
    icon: GraduationCap,
    color: 'bg-[#4b90a1] text-white',
  },
  {
    id: 'hod',
    title: 'Head of Department',
    description: 'Grant final approval for department venue utilization requests.',
    href: '/hod',
    icon: Landmark,
    color: 'bg-[#7a1f32] text-white',
  },
  {
    id: 'admin',
    title: 'System Administrator',
    description: 'Manage venues, clubs, staff accounts, system settings, and audit logs.',
    href: '/admin',
    icon: Shield,
    color: 'bg-gray-800 text-white',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fcf0e3] flex flex-col justify-between">
      {/* Hero Section */}
      <header className="py-12 px-6 text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-block px-4 py-1.5 bg-[#7a1f32] text-[#fcf0e3] rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
          CSEA Venue Portal
        </div>
        <h1 className="text-5xl lg:text-6xl font-extrabold text-[#7a1f32] tracking-tight">
          PermsPortal
        </h1>
        <p className="text-lg lg:text-xl text-[#8d6e63] font-medium max-w-2xl mx-auto">
          Simplify venue reservations, workflow approvals, and event scheduling. 
          Please select your role below to access your dashboard.
        </p>
      </header>

      {/* Role Grid */}
      <main className="max-w-6xl mx-auto px-6 pb-20 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((r) => {
            const IconComponent = r.icon;
            return (
              <Link 
                key={r.id} 
                href={r.href}
                className="group flex flex-col justify-between bg-white rounded-[2rem] border-2 border-[#e9ccbf] p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#7a1f32] cursor-pointer"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl ${r.color} flex items-center justify-center mb-6 shadow-md transition-transform duration-300 group-hover:scale-110`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2d2a29] mb-3 group-hover:text-[#7a1f32]">
                    {r.title}
                  </h3>
                  <p className="text-[#8d6e63] text-sm leading-relaxed mb-6">
                    {r.description}
                  </p>
                </div>
                <div className="flex items-center text-sm font-bold text-[#4b90a1] group-hover:text-[#7a1f32] transition-colors duration-200">
                  <span>Enter Dashboard</span>
                  <span className="ml-2 transform transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-[#e9ccbf] text-center text-xs text-[#8d6e63]">
        <p>&copy; {new Date().getFullYear()} CSEA. All rights reserved.</p>
      </footer>
    </div>
  );
}
