'use client';

import { Button } from '@/components/Button';
import { StatCard } from '@/components/Card';
import { Table, TableCell, TableRow, StatusBadge, RoleBadge } from '@/components/Table';
import { Plus } from 'lucide-react';
import { Venue } from '@/types';

const mockVenues: Venue[] = [
  { id: '1', name: 'Seminar Hall', type: 'hall', location: 'Main Building', capacity: 100, staffIncharge: 'VP', status: 'available' },
  { id: '2', name: 'APJ Hall', type: 'hall', location: 'CSE Building', capacity: 40, staffIncharge: 'TMS', status: 'unavailable' },
  { id: '3', name: 'SSL/ NSL', type: 'lab', location: 'ITL Complex', capacity: 50, staffIncharge: 'VAR', status: 'available' },
  { id: '4', name: 'ELHC 402', type: 'classroom', location: 'ELHC', capacity: 100, staffIncharge: 'NKB', status: 'unavailable' },
  { id: '5', name: 'MB 205', type: 'hall', location: 'Main Building', capacity: 100, staffIncharge: 'JJ', status: 'available' },
];

export function AdminVenuesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Venue Management</h1>
          <p className="text-xs text-gray-500">Register and manage college halls, labs, and classrooms</p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 inline mr-1" /> Add New
        </Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <StatCard title="Total Venues" value="12" />
        <StatCard title="Available" value="8" />
        <StatCard title="Unavailable" value="12" variant="danger" />
      </div>

      <Table headers={['Name', 'Type', 'Location', 'Capacity', 'Staff Incharge', 'Status', 'Actions']}>
        {mockVenues.map((venue) => (
          <TableRow key={venue.id}>
            <TableCell className="font-semibold text-gray-800">{venue.name}</TableCell>
            <TableCell><RoleBadge role={venue.type} /></TableCell>
            <TableCell>{venue.location}</TableCell>
            <TableCell>{venue.capacity}</TableCell>
            <TableCell>{venue.staffIncharge}</TableCell>
            <TableCell><StatusBadge status={venue.status} /></TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="danger">Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}
