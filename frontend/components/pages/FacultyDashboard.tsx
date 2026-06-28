'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Card, StatCard } from '@/components/Card';
import { TextArea } from '@/components/TextArea';
import { cn } from '@/lib/utils';

const mockPendingRequests = [
  {
    id: '1',
    studentName: 'John Doe',
    purpose: 'Club Meeting - Coding Workshop',
    dateTime: '2024-03-15 14:00',
    venue: 'CSE Lab 101',
    remarks: 'Need projector and whiteboard',
    status: 'pending',
    submittedOn: '2024-03-10',
  },
  {
    id: '2',
    studentName: 'Jane Smith',
    purpose: 'Research Presentation',
    dateTime: '2024-03-18 11:00',
    venue: 'Conference Room',
    status: 'pending',
    submittedOn: '2024-03-11',
  },
  {
    id: '3',
    studentName: 'Bob Wilson',
    purpose: 'Cultural Event Rehearsal',
    dateTime: '2024-03-20 18:00',
    venue: 'Auditorium',
    status: 'pending',
    submittedOn: '2024-03-09',
  },
];

export function FacultyDashboard() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [remarks, setRemarks] = useState('');

  const handleAction = (requestId: string, actionType: 'approve' | 'reject') => {
    setSelectedRequest(requestId);
    setAction(actionType);
    setRemarks('');
  };

  const submitAction = () => {
    if (!selectedRequest) return;
    
    console.log('Submit action:', {
      requestId: selectedRequest,
      action,
      remarks,
    });
    
    // Reset
    setSelectedRequest(null);
    setAction(null);
    setRemarks('');
  };

  const getRequestById = (id: string) => {
    return mockPendingRequests.find(req => req.id === id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#7a1f32]">Welcome, Faculty Coordinator</h1>
        <p className="text-sm text-gray-500">Review and manage pending academic and administrative permission requests</p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <StatCard title="Pending Review" value="3" />
        <StatCard title="Approved Today" value="5" />
        <StatCard title="Rejected Today" value="2" variant="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Pending Permission Requests</h2>
            <div className="space-y-3">
              {mockPendingRequests.map((request) => (
                <div key={request.id} className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-bold text-gray-800">{request.purpose}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200">
                          Pending
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        <span className="font-semibold text-gray-700">Student:</span> {request.studentName}
                      </p>
                      <p className="text-xs text-gray-600 mb-1">
                        <span className="font-semibold text-gray-700">Venue:</span> {request.venue} • {request.dateTime}
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">Submitted:</span> {request.submittedOn}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="success"
                      onPress={() => handleAction(request.id, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="danger"
                      onPress={() => handleAction(request.id, 'reject')}
                    >
                      Reject
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          {selectedRequest && action && (
            <Card className="p-5 sticky top-6">
              <h2 className="text-base font-semibold text-gray-800 mb-3">
                {action === 'approve' ? 'Approve Request' : 'Reject Request'}
              </h2>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm font-bold text-gray-800">
                  {getRequestById(selectedRequest)?.purpose}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Student: {getRequestById(selectedRequest)?.studentName}
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
                required={action === 'reject'}
              />

              <div className="flex gap-2">
                <Button 
                  variant={action === 'approve' ? 'success' : 'danger'}
                  onPress={submitAction}
                  className="flex-1"
                >
                  {action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                </Button>
                <Button 
                  variant="outline"
                  onPress={() => {
                    setSelectedRequest(null);
                    setAction(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          )}
          
          {!selectedRequest && (
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