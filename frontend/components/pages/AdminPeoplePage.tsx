'use client';

import { Button } from '@/components/Button';
import { StatCard } from '@/components/Card';
import { Table, TableCell, TableRow, StatusBadge, RoleBadge } from '@/components/Table';
import { Plus } from 'lucide-react';
import { Person } from '@/types';

const mockPeople: Person[] = [
  { id: '1', name: 'Mr. Vinod Pathari', email: 'pathari@nitc.ac.in', role: 'faculty_in_charge', status: 'available' },
  { id: '2', name: 'Mrs. Chandramani', email: 'chandramani@nitc.ac.in', role: 'faculty_coordinator', status: 'unavailable' },
  { id: '3', name: 'Mr. Rahul N', email: 'rahul@nitc.ac.in', role: 'staff_incharge', status: 'available' },
  { id: '4', name: 'Mrs. Subhashini', email: 'subha@nitc.ac.in', role: 'hod', status: 'unavailable' },
  { id: '5', name: 'Mrs. Abidha V P', email: 'abidha@nitc.ac.in', role: 'faculty_in_charge', status: 'available' },
];

export function AdminPeoplePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Directory & Roles</h1>
          <p className="text-xs text-gray-500">Configure roles for faculty coordinators, HODs, and staff</p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 inline mr-1" /> Add New
        </Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <StatCard title="Total People" value="12" />
        <StatCard title="Staff" value="8" />
        <StatCard title="Faculty" value="12" />
      </div>

      <Table headers={['Name', 'Email', 'Role', 'Status', 'Actions']}>
        {mockPeople.map((person) => (
          <TableRow key={person.id}>
            <TableCell className="font-semibold text-gray-800">{person.name}</TableCell>
            <TableCell>{person.email}</TableCell>
            <TableCell><RoleBadge role={person.role} /></TableCell>
            <TableCell><StatusBadge status={person.status} /></TableCell>
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
