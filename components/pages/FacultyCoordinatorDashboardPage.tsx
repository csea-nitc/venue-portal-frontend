'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { Tabs, TabPanelComponent } from '@/components/Tabs';
import { BookingCard } from '@/components/BookingCard';
import { StatCard } from '@/components/Card';
import { Booking } from '@/types';

const initialBookings: Booking[] = [
  { id: '1', title: 'CSEA Coding Contest', venue: 'SSL Lab', startDate: 'Day Date xam - ypm', endDate: '', bookingDate: '', status: 'pending', club: 'CSEA', subject: 'Coding Contest request for HOD review' },
  { id: '2', title: 'WebDev Hackathon', venue: 'NSL Lab', startDate: 'Sat 4 Apr: 5pm-8pm', endDate: '', bookingDate: '', status: 'pending', club: 'CSEA', subject: 'Project Expo and Hackathon' },
  { id: '3', title: 'Robotics Workshop', venue: 'Seminar Hall', startDate: 'Day Date xam - ypm', endDate: '', bookingDate: '', status: 'pending', club: 'Robotics Club', subject: 'Hands-on session with microcontrollers' },
  { id: '4', title: 'Executive Committee Meet', venue: 'Meeting Room', startDate: 'Day Date xam - ypm', endDate: '', bookingDate: '', status: 'pending', club: 'CSEA', subject: 'Budget discussion' },
  { id: '5', title: 'Alumni Meet 2026', venue: 'APJ Hall', startDate: 'Day Date xam - ypm', endDate: '', bookingDate: '', status: 'approved', club: 'Alumni Assoc', subject: 'Annual general body meeting' },
  { id: '6', title: 'Placement Talk', venue: 'ELHC 402', startDate: 'Day Date xam - ypm', endDate: '', bookingDate: '', status: 'approved', club: 'Placements', subject: 'Company presentation' },
];

export function FacultyCoordinatorDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const handleAction = (id: string, newStatus: 'approved' | 'rejected') => {
    setBookings(prev => 
      prev.map(b => b.id === id ? { ...b, status: newStatus } : b)
    );
  };

  const pendingRequests = bookings.filter(b => b.status === 'pending');
  const approvedRequests = bookings.filter(b => b.status === 'approved');
  const rejectedRequests = bookings.filter(b => b.status === 'rejected');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#7a1f32]">Welcome, Faculty Coordinator</h1>
        <p className="text-sm text-gray-500">Review and manage pending academic and administrative permission requests</p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <StatCard title="Pending requests" value={String(pendingRequests.length)} variant="danger" />
        <StatCard title="Approved this month" value={String(approvedRequests.length)} />
      </div>

      <Card className="p-6">
        <Tabs
          tabs={[
            { id: 'pending', label: 'Pending' },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' },
          ]}
          defaultTab="pending"
        >
          <TabPanelComponent id="pending">
            <h3 className="text-base font-bold text-[#7a1f32] mb-4">PENDING REQUESTS</h3>
            {pendingRequests.length === 0 ? (
              <p className="text-[#8d6e63] italic text-sm">No pending requests.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingRequests.map((booking) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    showActions 
                    onAccept={() => handleAction(booking.id!, 'approved')}
                    onReject={() => handleAction(booking.id!, 'rejected')}
                  />
                ))}
              </div>
            )}
          </TabPanelComponent>
          
          <TabPanelComponent id="approved">
            <h3 className="text-base font-bold text-[#7a1f32] mb-4">APPROVAL HISTORY</h3>
            {approvedRequests.length === 0 ? (
              <p className="text-[#8d6e63] italic text-sm">No approved requests.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedRequests.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabPanelComponent>

          <TabPanelComponent id="rejected">
            <h3 className="text-base font-bold text-[#7a1f32] mb-4">REJECTED REQUESTS</h3>
            {rejectedRequests.length === 0 ? (
              <p className="text-[#8d6e63] italic text-sm">No rejected requests.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rejectedRequests.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabPanelComponent>
        </Tabs>
      </Card>
    </div>
  );
}
