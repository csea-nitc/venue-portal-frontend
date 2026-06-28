'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Card, StatCard } from '@/components/Card';
import { TextField, Label, Input as AriaInput, TextArea as AriaTextArea } from 'react-aria-components';
import { cn } from '@/lib/utils';

const mockRequests = [
  {
    id: '1',
    purpose: 'Club Meeting - Coding Workshop',
    dateTime: '2024-03-15 14:00',
    venue: 'CSE Lab 101',
    status: 'pending',
    currentHandler: 'Dr. Smith',
  },
  {
    id: '2',
    purpose: 'Project Presentation',
    dateTime: '2024-03-20 10:00',
    venue: 'Seminar Hall',
    status: 'approved',
    currentHandler: 'Dr. Johnson',
  },
];

export function StudentDashboard() {
  const [formData, setFormData] = useState({
    purpose: '',
    dateTime: '',
    venue: '',
    remarks: '',
    initialReviewer: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit permission request:', formData);
    // Reset form
    setFormData({
      purpose: '',
      dateTime: '',
      venue: '',
      remarks: '',
      initialReviewer: '',
    });
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
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
        <StatCard title="Pending Requests" value="1" />
        <StatCard title="Approved" value="1" />
        <StatCard title="Total Requests" value="2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 lg:p-6">
          <h2 className="text-xl font-semibold mb-4">Submit New Permission Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-[#7a1f32]">Purpose</Label>
              <AriaInput
                value={formData.purpose}
                onChange={handleInputChange('purpose')}
                placeholder="e.g., Club Meeting, Project Presentation"
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4b90a1] focus:border-transparent"
                required
              />
            </TextField>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-[#7a1f32]">Date & Time</Label>
                <AriaInput
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={handleInputChange('dateTime')}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4b90a1] focus:border-transparent"
                  required
                />
              </TextField>
              
              <TextField className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-[#7a1f32]">Venue</Label>
                <AriaInput
                  value={formData.venue}
                  onChange={handleInputChange('venue')}
                  placeholder="e.g., CSE Lab 101, Seminar Hall"
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4b90a1] focus:border-transparent"
                  required
                />
              </TextField>
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

            <TextField className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-[#7a1f32]">Initial Reviewer (Optional)</Label>
              <AriaInput
                value={formData.initialReviewer}
                onChange={handleInputChange('initialReviewer')}
                placeholder="Faculty email or name for auto-assignment"
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4b90a1] focus:border-transparent"
              />
            </TextField>

            <div className="flex justify-end">
              <Button type="submit" variant="primary">
                Submit Request
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
          <div className="space-y-4">
            {mockRequests.map((request) => (
              <div key={request.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{request.purpose}</h3>
                    <p className="text-sm text-gray-600">{request.venue} • {request.dateTime}</p>
                  </div>
                  <span className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    request.status === 'approved' && 'bg-green-100 text-green-800',
                    request.status === 'pending' && 'bg-blue-100 text-blue-800',
                    request.status === 'rejected' && 'bg-red-100 text-red-800'
                  )}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline">View Details</Button>
                  {request.status === 'pending' && (
                    <Button size="sm" variant="danger">Cancel</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}