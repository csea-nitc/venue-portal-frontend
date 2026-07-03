'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { StatCard } from '@/components/Card';
import { Table, TableCell, TableRow, StatusBadge, RoleBadge } from '@/components/Table';
import { Plus, Loader2 } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';

type AdminVenue = Record<string, unknown> & {
  venueId?: string | number;
  name?: string;
  venueType?: string;
  location?: string;
  capacity?: number;
  handlers?: Array<{ user?: { name?: string } }>;
};

export function AdminVenuesPage() {
  const { sendRequest, isLoading } = useFetch<{ venues?: AdminVenue[] }>();
  const [venues, setVenues] = useState<AdminVenue[]>([]);

  useEffect(() => {
    sendRequest('/admin/venues')
      .then(res => {
        if (res && res.venues) {
          setVenues(res.venues);
        }
      })
      .catch(console.error);
  }, [sendRequest]);

  const availableCount = venues.length; // From getAvailableVenues, all are available
  const totalCount = venues.length;

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
        <StatCard title="Total Venues" value={totalCount.toString()} />
        <StatCard title="Available" value={availableCount.toString()} />
        <StatCard title="Unavailable" value="0" variant="danger" />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#7a1f32]" />
        </div>
      ) : (
        <Table headers={['Name', 'Type', 'Location', 'Capacity', 'Staff Incharge', 'Status', 'Actions']}>
          {venues.map((venue) => {
            const staffName = venue.handlers?.[0]?.user?.name || 'N/A';
            return (
              <TableRow key={venue.venueId}>
                <TableCell className="font-semibold text-gray-800">{venue.name}</TableCell>
                <TableCell><RoleBadge role={venue.venueType || 'hall'} /></TableCell>
                <TableCell>{venue.location || 'N/A'}</TableCell>
                <TableCell>{venue.capacity || 0}</TableCell>
                <TableCell>{staffName}</TableCell>
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
