'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { StatCard } from '@/components/Card';
import { Table, TableCell, TableRow, StatusBadge } from '@/components/Table';
import { Plus, Loader2 } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';

type AdminClub = Record<string, unknown> & {
  clubId?: string | number;
  clubName?: string;
  name?: string;
  secretaryName?: string;
  secretary?: string;
  contactNumber?: string;
  contact?: string;
  coordinator?: { name?: string };
};

export function AdminClubsPage() {
  const { sendRequest, isLoading } = useFetch<{ data?: AdminClub[] }>();
  const [clubs, setClubs] = useState<AdminClub[]>([]);

  useEffect(() => {
    sendRequest('/clubs')
      .then(res => {
        if (res && res.data) {
          setClubs(res.data);
        }
      })
      .catch(console.error);
  }, [sendRequest]);

  const activeCount = clubs.length; // Assuming all returned are active
  const totalCount = clubs.length;

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
        <StatCard title="Total Clubs" value={totalCount.toString()} />
        <StatCard title="Active" value={activeCount.toString()} />
        <StatCard title="Inactive" value="0" variant="danger" />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#7a1f32]" />
        </div>
      ) : (
        <Table headers={['Club name', 'Secretary', 'Contact', 'Faculty Coordinator', 'Status', 'Actions']}>
          {clubs.map((club) => {
            const coordName = club.coordinator?.name || 'N/A';
            return (
              <TableRow key={club.clubId}>
                <TableCell className="font-semibold text-gray-800">{club.clubName || club.name}</TableCell>
                <TableCell>{club.secretaryName || club.secretary || 'N/A'}</TableCell>
                <TableCell>{club.contactNumber || club.contact || 'N/A'}</TableCell>
                <TableCell>{coordName}</TableCell>
                <TableCell><StatusBadge status="available" /></TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="danger">Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      )}
    </div>
  );
}
