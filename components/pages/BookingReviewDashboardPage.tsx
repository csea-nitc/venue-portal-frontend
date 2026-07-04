'use client';

import { useEffect, useState } from 'react';
import { Card, StatCard } from '@/components/Card';
import { Tabs, TabPanelComponent } from '@/components/Tabs';
import { BookingCard } from '@/components/BookingCard';
import { useFetch } from '@/hooks/useFetch';
import { Booking } from '@/types';

type BookingStatus =
  | 'PENDING_COORDINATOR'
  | 'PENDING_VENUE_HANDLER'
  | 'PENDING_HOD'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'WITHDRAWN';

type ApiBooking = {
  bookingId: number;
  eventName: string;
  eventStart: string;
  eventEnd: string;
  status: BookingStatus;
  createdAt?: string;
  club?: { clubName?: string };
  venue?: { name?: string };
};

type BookingsResponse = {
  success: boolean;
  data?: ApiBooking[];
  message?: string;
};

type BookingActionResponse = {
  success: boolean;
  data?: ApiBooking;
  message?: string;
};

type BookingReviewDashboardPageProps = {
  title: string;
};

function toUiStatus(status: BookingStatus): Booking['status'] {
  if (status === 'APPROVED') return 'approved';
  if (status === 'REJECTED') return 'rejected';
  return 'pending';
}

function toBooking(apiBooking: ApiBooking): Booking {
  return {
    id: String(apiBooking.bookingId),
    title: apiBooking.eventName,
    venue: apiBooking.venue?.name || `Venue #${apiBooking.bookingId}`,
    startDate: new Date(apiBooking.eventStart).toLocaleString(),
    endDate: new Date(apiBooking.eventEnd).toLocaleString(),
    bookingDate: apiBooking.createdAt ? new Date(apiBooking.createdAt).toLocaleDateString() : '',
    status: toUiStatus(apiBooking.status),
    club: apiBooking.club?.clubName,
  };
}

export function BookingReviewDashboardPage({ title }: BookingReviewDashboardPageProps) {
  const { sendRequest: fetchBookings, isLoading } = useFetch<BookingsResponse>();
  const { sendRequest: approveBooking } = useFetch<BookingActionResponse>();
  const { sendRequest: rejectBooking } = useFetch<BookingActionResponse>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings('/bookings')
      .then((res) => {
        if (res) {
          setBookings((res.data || []).map(toBooking));
          setError(null);
        }
      })
      .catch((err) => setError(err.message || 'Unable to load bookings.'));
  }, [fetchBookings]);

  const handleAction = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const endpoint = newStatus === 'approved' ? `/bookings/${id}/approve` : `/bookings/${id}/reject`;
      const body = newStatus === 'approved' ? { remarks: '' } : { reason: 'Rejected from dashboard.' };
      const res = newStatus === 'approved'
        ? await approveBooking(endpoint, { method: 'POST', body })
        : await rejectBooking(endpoint, { method: 'POST', body });

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id && res && res.data ? toBooking(res.data) : booking
        )
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update booking.');
    }
  };

  const pendingRequests = bookings.filter((booking) => booking.status === 'pending');
  const approvedRequests = bookings.filter((booking) => booking.status === 'approved');
  const rejectedRequests = bookings.filter((booking) => booking.status === 'rejected');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">{title}</h1>
        <p className="text-sm text-gray-500">Review and manage venue booking requests</p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-4 flex-wrap">
        <StatCard title="Pending requests" value={isLoading ? '...' : String(pendingRequests.length)} variant="danger" />
        <StatCard title="Approved this month" value={isLoading ? '...' : String(approvedRequests.length)} />
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
            <h3 className="text-base font-bold text-primary mb-4">PENDING REQUESTS</h3>
            {pendingRequests.length === 0 ? (
              <p className="text-text-muted italic text-sm">{isLoading ? 'Loading requests...' : 'No pending requests.'}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingRequests.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    showActions
                    onAccept={() => booking.id && handleAction(booking.id, 'approved')}
                    onReject={() => booking.id && handleAction(booking.id, 'rejected')}
                  />
                ))}
              </div>
            )}
          </TabPanelComponent>

          <TabPanelComponent id="approved">
            <h3 className="text-base font-bold text-primary mb-4">APPROVAL HISTORY</h3>
            {approvedRequests.length === 0 ? (
              <p className="text-text-muted italic text-sm">No approved requests.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedRequests.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabPanelComponent>

          <TabPanelComponent id="rejected">
            <h3 className="text-base font-bold text-primary mb-4">REJECTED REQUESTS</h3>
            {rejectedRequests.length === 0 ? (
              <p className="text-text-muted italic text-sm">No rejected requests.</p>
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
