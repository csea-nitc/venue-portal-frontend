'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card, StatCard } from '@/components/Card';
import { TextArea } from '@/components/TextArea';
import { useFetch } from '@/hooks/useFetch';
import { Loader2, AlertCircle } from 'lucide-react';

export function FacultyDashboard() {
  const { data: bookingsData, isLoading: isFetching, error: fetchError, sendRequest: fetchBookings } = useFetch<{ success: boolean; data: any[] }>();
  const { isLoading: isSubmitting, sendRequest: submitAction } = useFetch();

  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [remarks, setRemarks] = useState('');
  useEffect(() => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem("perms_user_id") : null;
    if (userId) {
      fetchBookings(`/bookings/${userId}`, {
        method: 'GET',
      });
    }
  }, [fetchBookings]);

  const handleAction = (request: any, actionType: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setAction(actionType);
    setRemarks('');
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest || !action) return;

    try {
      const endpoint = `/api/bookings/${selectedRequest.bookingId}/${action}`;
      await submitAction(endpoint, {
        method: 'POST',
        body: { remarks: remarks || (action === 'approve' ? 'Approved' : 'Rejected') },
      });

      // Reset and refresh
      setSelectedRequest(null);
      setAction(null);
      setRemarks('');
      fetchBookings('/api/bookings');
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  const bookings = bookingsData?.data || [];
  const pendingRequests = bookings.filter((b: any) => !['APPROVED', 'REJECTED', 'CANCELLED'].includes(b.status));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Welcome, Faculty Dashboard</h1>
        <p className="text-sm text-gray-500">Review and manage pending academic and administrative permission requests</p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <StatCard title="Pending Review" value={pendingRequests.length.toString()} />
        <StatCard title="Approved" value={bookings.filter((b: any) => b.status === 'APPROVED').length.toString()} />
        <StatCard title="Rejected" value={bookings.filter((b: any) => b.status === 'REJECTED').length.toString()} variant="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Pending Permission Requests</h2>

            {isFetching ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : fetchError ? (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                <p>{fetchError}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No pending requests found.</p>
                ) : (
                  pendingRequests.map((request: any) => (
                    <div key={request.bookingId} className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm hover:border-accent transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-bold text-gray-800">{request.eventName}</h3>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200">
                              {request.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">
                            <span className="font-semibold text-gray-700">Club:</span> {request.club?.clubName || 'Unknown Club'}
                          </p>
                          <p className="text-xs text-gray-600 mb-1">
                            <span className="font-semibold text-gray-700">Venue:</span> {request.venue?.name} • {new Date(request.eventStart).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            <span className="font-semibold text-gray-700">Submitted:</span> {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="success"
                          onPress={() => handleAction(request, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onPress={() => handleAction(request, 'reject')}
                        >
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>
        </div>

        <div>
          {selectedRequest && action ? (
            <Card className="p-5 sticky top-6 border-2 border-accent">
              <h2 className="text-base font-semibold text-gray-800 mb-3">
                {action === 'approve' ? 'Approve Request' : 'Reject Request'}
              </h2>

              <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm font-bold text-gray-800">
                  {selectedRequest.eventName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Club: {selectedRequest.club?.clubName}
                </p>
              </div>

              <TextArea
                label="Remarks"
                value={remarks}
                onChange={(e) => setRemarks((e.target as HTMLTextAreaElement).value)}
                placeholder={
                  action === 'approve' ? 'Optional approval remarks...' : 'Please provide justification...'
                }
                rows={3}
                className="mb-4"
              />

              <div className="flex gap-2">
                <Button
                  variant={action === 'approve' ? 'success' : 'danger'}
                  onPress={handleConfirmAction}
                  className="flex-1"
                  isDisabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                </Button>
                <Button
                  variant="outline"
                  onPress={() => {
                    setSelectedRequest(null);
                    setAction(null);
                  }}
                  isDisabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-5">
              <h2 className="text-base font-semibold text-gray-800 mb-3">Quick Actions</h2>
              <div className="space-y-3">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Select a request from the list to view full details and perform approval or rejection reviews.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
