'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card, StatCard } from '@/components/Card';
import { TextField, Label, Input as AriaInput, TextArea as AriaTextArea } from 'react-aria-components';
import { cn } from '@/lib/utils';
import { useFetch } from '@/hooks/useFetch';
import { Loader2, AlertCircle } from 'lucide-react';

export function StudentDashboard() {
  const { data: bookingsData, isLoading: isFetching, error: fetchError, sendRequest: fetchBookings } = useFetch();
  const { isLoading: isSubmitting, sendRequest: submitBooking } = useFetch();
  const { data: venuesData, sendRequest: fetchVenues } = useFetch();

  const [formData, setFormData] = useState({
    eventName: '',
    eventStart: '',
    eventEnd: '',
    venueId: '',
    remarks: '',
  });

  useEffect(() => {
    fetchBookings('/api/bookings');
    fetchVenues('/api/admin/venues');
  }, [fetchBookings, fetchVenues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitBooking('/api/bookings', {
        method: 'POST',
        body: {
          ...formData,
          venueId: parseInt(formData.venueId),
          eventStart: new Date(formData.eventStart).toISOString(),
          eventEnd: new Date(formData.eventEnd).toISOString(),
        },
      });
      // Reset form and refresh list
      setFormData({
        eventName: '',
        eventStart: '',
        eventEnd: '',
        venueId: '',
        remarks: '',
      });
      fetchBookings('/api/bookings');
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const bookings = bookingsData?.data || [];
  const venues = venuesData?.venues || []; // Adjusted based on backend response

  const stats = {
    pending: bookings.filter((b: any) => b.status.startsWith('PENDING')).length,
    approved: bookings.filter((b: any) => b.status === 'APPROVED').length,
    total: bookings.length,
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Permission Requests</h1>
        <div className="text-sm text-gray-600">
          Welcome back, <span className="font-semibold">Student</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Pending Requests" value={stats.pending.toString()} />
        <StatCard title="Approved" value={stats.approved.toString()} />
        <StatCard title="Total Requests" value={stats.total.toString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 lg:p-6">
          <h2 className="text-xl font-semibold mb-4">Submit New Permission Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-[#7a1f32]">Event Name</Label>
              <AriaInput
                value={formData.eventName}
                onChange={handleInputChange('eventName')}
                placeholder="e.g., Club Meeting, Project Presentation"
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4b90a1] focus:border-transparent"
                required
              />
            </TextField>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-[#7a1f32]">Start Date & Time</Label>
                <AriaInput
                  type="datetime-local"
                  value={formData.eventStart}
                  onChange={handleInputChange('eventStart')}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4b90a1] focus:border-transparent"
                  required
                />
              </TextField>
              
              <TextField className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-[#7a1f32]">End Date & Time</Label>
                <AriaInput
                  type="datetime-local"
                  value={formData.eventEnd}
                  onChange={handleInputChange('eventEnd')}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4b90a1] focus:border-transparent"
                  required
                />
              </TextField>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-[#7a1f32]">Venue</Label>
              <select
                value={formData.venueId}
                onChange={(e) => setFormData(prev => ({ ...prev, venueId: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4b90a1] focus:border-transparent"
                required
              >
                <option value="">Select a venue</option>
                {venues.map((v: any) => (
                  <option key={v.venueId} value={v.venueId}>{v.name}</option>
                ))}
              </select>
            </div>

            <TextField className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-[#7a1f32]">Remarks (Optional)</Label>
              <AriaTextArea
                value={formData.remarks}
                onChange={handleInputChange('remarks')}
                placeholder="Additional information or special requirements"
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4b90a1] focus:border-transparent resize-none"
              />
            </TextField>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" isDisabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Submit Request
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
          {isFetching ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-[#4b90a1]" />
            </div>
          ) : fetchError ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              <p>{fetchError}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No requests found.</p>
              ) : (
                bookings.map((request: any) => (
                  <div key={request.bookingId} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{request.eventName}</h3>
                        <p className="text-sm text-gray-600">
                          {request.venue?.name} • {new Date(request.eventStart).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        request.status === 'APPROVED' && 'bg-green-100 text-green-800',
                        request.status.startsWith('PENDING') && 'bg-blue-100 text-blue-800',
                        request.status === 'REJECTED' && 'bg-red-100 text-red-800'
                      )}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
