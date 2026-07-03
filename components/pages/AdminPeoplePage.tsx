
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { StatCard } from '@/components/Card';
import { Table, TableCell, TableRow, StatusBadge, RoleBadge } from '@/components/Table';
import { Plus, Loader2 } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { Person } from '@/types';

export function AdminPeoplePage() {
  const { sendRequest, isLoading } = useFetch<Person[]>();
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    sendRequest('/admin/users')
      .then(res => {
        if (res) {
          setPeople(res);
        }
      })
      .catch(console.error);
  }, [sendRequest]);

  const staffCount = people.filter(p => p.role === 'STAFF_IN_CHARGE').length;
  const facultyCount = people.filter(p => p.role === 'FACULTY_COORDINATOR' || p.role === 'FACULTY_IN_CHARGE' || p.role === 'HOD').length;

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
        <StatCard title="Total People" value={people.length.toString()} />
        <StatCard title="Staff" value={staffCount.toString()} />
        <StatCard title="Faculty" value={facultyCount.toString()} />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#7a1f32]" />
        </div>
      ) : (
        <Table headers={['Name', 'Email', 'Role', 'Status', 'Actions']}>
          {people.map((person) => (
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
      )}
    </div>
  );
}
