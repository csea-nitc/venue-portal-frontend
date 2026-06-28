'use client';

import { Button } from '@/components/Button';
import { StatCard } from '@/components/Card';
import { Table, TableCell, TableRow, StatusBadge } from '@/components/Table';
import { Plus } from 'lucide-react';
import { Club } from '@/types';

const mockClubs: Club[] = [
  { id: '1', name: 'IEEE NITC', secretary: 'Arjun Nair', contact: '9004283732', facultyCoordinator: 'VP', status: 'available' },
  { id: '2', name: 'Music Club', secretary: 'Priya S', contact: '8372901344', facultyCoordinator: 'TMS', status: 'unavailable' },
  { id: '3', name: 'CSEA', secretary: 'Rahul K', contact: '9637013391', facultyCoordinator: 'VAR', status: 'available' },
  { id: '4', name: 'AeroUnwired', secretary: 'Manisha', contact: '9003585698', facultyCoordinator: 'NKB', status: 'unavailable' },
  { id: '5', name: 'GDSC', secretary: 'Aisha S', contact: '7875982911', facultyCoordinator: 'JJ', status: 'available' },
];

export function AdminClubsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Club Registry</h1>
          <p className="text-xs text-gray-500">Manage recognized student clubs, secretaries, and coordinators</p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 inline mr-1" /> Add New
        </Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <StatCard title="Total Clubs" value="12" />
        <StatCard title="Active" value="8" />
        <StatCard title="Inactive" value="12" variant="danger" />
      </div>

      <Table headers={['Club name', 'Secretary', 'Contact', 'Faculty Coordinator', 'Status', 'Actions']}>
        {mockClubs.map((club) => (
          <TableRow key={club.id}>
            <TableCell className="font-semibold text-gray-800">{club.name}</TableCell>
            <TableCell>{club.secretary}</TableCell>
            <TableCell>{club.contact}</TableCell>
            <TableCell>{club.facultyCoordinator}</TableCell>
            <TableCell><StatusBadge status={club.status} /></TableCell>
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
