'use client';

import { useEffect, useState } from 'react';
import { Card, StatCard } from '@/components/Card';
import { Tabs, TabPanelComponent } from '@/components/Tabs';
import { BookingCard } from '@/components/BookingCard';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { TextArea } from '@/components/TextArea';
import { useFetch } from '@/hooks/useFetch';
import { Booking } from '@/types';

// Roles that are allowed to approve or reject bookings
const ACTION_ROLES = new Set([
  'FACULTY_COORDINATOR',
  'STAFF_IN_CHARGE',
  'FACULTY_IN_CHARGE',
  'HOD',
  'ADMIN',
]);

function canActOnBookings(): boolean {
  if (typeof window === 'undefined') return false;
  const role = localStorage.getItem('perms_user_role')?.toUpperCase() ?? '';
  return ACTION_ROLES.has(role);
}

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
  currentHandlers?: Array<{
    handlerId: number;
    handler?: {
      userId: number;
      name: string;
      email: string;
      role: string;
    };
  }>;
};

type DashboardBooking = Booking & {
  rawStatus: BookingStatus;
  currentHandlers: Array<{
    handlerId: number;
    handler?: {
      userId: number;
      name: string;
      email: string;
      role: string;
    };
  }>;
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

function toBooking(apiBooking: ApiBooking): DashboardBooking {
  return {
    id: String(apiBooking.bookingId),
    title: apiBooking.eventName,
    venue: apiBooking.venue?.name || `Venue #${apiBooking.bookingId}`,
    startDate: new Date(apiBooking.eventStart).toLocaleString(),
    endDate: new Date(apiBooking.eventEnd).toLocaleString(),
    bookingDate: apiBooking.createdAt ? new Date(apiBooking.createdAt).toLocaleDateString() : '',
    status: toUiStatus(apiBooking.status),
    club: apiBooking.club?.clubName,
    rawStatus: apiBooking.status,
    currentHandlers: apiBooking.currentHandlers || [],
  };
}

function canUserActOnBooking(booking: DashboardBooking): boolean {
  if (typeof window === 'undefined') return false;
  const currentUserIdStr = localStorage.getItem('perms_user_id');
  if (!currentUserIdStr) return false;
  const currentUserId = Number(currentUserIdStr);
  return booking.currentHandlers.some((ch) => ch.handlerId === currentUserId);
}

export function BookingReviewDashboardPage({ title }: BookingReviewDashboardPageProps) {
  const { sendRequest: fetchBookings, isLoading } = useFetch<BookingsResponse>();
  const { sendRequest: approveRequest, isLoading: isApproving } = useFetch<BookingActionResponse>();
  const { sendRequest: rejectRequest, isLoading: isRejecting } = useFetch<BookingActionResponse>();

  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userCanAct = canActOnBookings();

  // ── Approve modal state ──────────────────────────────────────────────────
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approveTargetId, setApproveTargetId] = useState<string | null>(null);
  const [approveRemarks, setApproveRemarks] = useState('');

  // ── Reject modal state ───────────────────────────────────────────────────
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectReasonError, setRejectReasonError] = useState('');

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

  // ── Open approve modal ───────────────────────────────────────────────────
  function openApproveModal(id: string) {
    setApproveTargetId(id);
    setApproveRemarks('');
    setApproveModalOpen(true);
  }

  // ── Open reject modal ────────────────────────────────────────────────────
  function openRejectModal(id: string) {
    setRejectTargetId(id);
    setRejectReason('');
    setRejectReasonError('');
    setRejectModalOpen(true);
  }

  // ── Submit approve ───────────────────────────────────────────────────────
  async function handleApproveConfirm() {
    if (!approveTargetId) return;
    setError(null);
    try {
      const res = await approveRequest(`/bookings/${approveTargetId}/approve`, {
        method: 'POST',
        body: { remarks: approveRemarks.trim() },
      });
      if (res?.data) {
        setBookings((prev) =>
          prev.map((b) => (b.id === approveTargetId && res.data ? toBooking(res.data) : b))
        );
      }
      setApproveModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve booking.');
      setApproveModalOpen(false);
    }
  }

  // ── Submit reject ────────────────────────────────────────────────────────
  async function handleRejectConfirm() {
    if (!rejectTargetId) return;
    if (!rejectReason.trim()) {
      setRejectReasonError('A reason is required to reject a booking.');
      return;
    }
    setRejectReasonError('');
    setError(null);
    try {
      const res = await rejectRequest(`/bookings/${rejectTargetId}/reject`, {
        method: 'POST',
        body: { reason: rejectReason.trim() },
      });
      if (res?.data) {
        setBookings((prev) =>
          prev.map((b) => (b.id === rejectTargetId && res.data ? toBooking(res.data) : b))
        );
      }
      setRejectModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject booking.');
      setRejectModalOpen(false);
    }
  }

  const pendingRequests = bookings.filter((b) => b.status === 'pending');
  const approvedRequests = bookings.filter((b) => b.status === 'approved');
  const rejectedRequests = bookings.filter((b) => b.status === 'rejected');

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
              <p className="text-text-muted italic text-sm">
                {isLoading ? 'Loading requests...' : 'No pending requests.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingRequests.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    showActions={userCanAct && canUserActOnBooking(booking)}
                    onAccept={() => booking.id && openApproveModal(booking.id)}
                    onReject={() => booking.id && openRejectModal(booking.id)}
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

      {/* ── Approve confirmation modal ───────────────────────────────────── */}
      <Modal
        isOpen={approveModalOpen}
        onOpenChange={(open) => { if (!isApproving) setApproveModalOpen(open); }}
        title="Approve Booking Request"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You are about to <span className="font-semibold text-green-700">approve</span> this
            booking request. It will be forwarded to the next stage in the workflow.
          </p>
          <TextArea
            label="Remarks (optional)"
            placeholder="Add any remarks or notes for the next handler..."
            value={approveRemarks}
            onChange={(e) => setApproveRemarks(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onPress={() => setApproveModalOpen(false)}
              isDisabled={isApproving}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              size="sm"
              onPress={handleApproveConfirm}
              isDisabled={isApproving}
            >
              {isApproving ? 'Approving…' : 'Confirm Approve'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Reject confirmation modal ────────────────────────────────────── */}
      <Modal
        isOpen={rejectModalOpen}
        onOpenChange={(open) => { if (!isRejecting) setRejectModalOpen(open); }}
        title="Reject Booking Request"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You are about to <span className="font-semibold text-red-700">reject</span> this
            booking request. Please provide a reason — this will be visible to the club.
          </p>
          <div>
            <TextArea
              label="Reason for rejection *"
              placeholder="e.g. Venue not available, clashes with another event..."
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value);
                if (e.target.value.trim()) setRejectReasonError('');
              }}
            />
            {rejectReasonError && (
              <p className="mt-1 text-xs text-red-600 font-medium">{rejectReasonError}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onPress={() => setRejectModalOpen(false)}
              isDisabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onPress={handleRejectConfirm}
              isDisabled={isRejecting}
            >
              {isRejecting ? 'Rejecting…' : 'Confirm Reject'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
