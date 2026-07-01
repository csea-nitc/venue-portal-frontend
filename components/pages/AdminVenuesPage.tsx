'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { StatCard } from '@/components/Card';
import { Table, TableCell, TableRow, StatusBadge, RoleBadge } from '@/components/Table';
import { Plus } from 'lucide-react';
import { Venue } from '@/types';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';

const mockVenues: Venue[] = [
  { id: '1', name: 'Seminar Hall', type: 'hall', location: 'Main Building', capacity: 100, staffIncharge: 'VP', status: 'available' },
  { id: '2', name: 'APJ Hall', type: 'hall', location: 'CSE Building', capacity: 40, staffIncharge: 'TMS', status: 'unavailable' },
  { id: '3', name: 'SSL/ NSL', type: 'lab', location: 'ITL Complex', capacity: 50, staffIncharge: 'VAR', status: 'available' },
  { id: '4', name: 'ELHC 402', type: 'classroom', location: 'ELHC', capacity: 100, staffIncharge: 'NKB', status: 'unavailable' },
  { id: '5', name: 'MB 205', type: 'hall', location: 'Main Building', capacity: 100, staffIncharge: 'JJ', status: 'available' },
];

export function AdminVenuesPage() {
  const [venues, setVenues] = useState<Venue[]>(mockVenues);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('hall');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [staffIncharge, setStaffIncharge] = useState('');
  const [status, setStatus] = useState('available');

  const handleOpenAdd = () => {
    setEditId(null);
    setName('');
    setType('hall');
    setLocation('');
    setCapacity('');
    setStaffIncharge('');
    setStatus('available');
    setIsOpen(true);
  };

  const handleOpenEdit = (venue: Venue) => {
    setEditId(venue.id);
    setName(venue.name);
    setType(venue.type);
    setLocation(venue.location);
    setCapacity(String(venue.capacity));
    setStaffIncharge(venue.staffIncharge);
    setStatus(venue.status);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!name || !location || !capacity || !staffIncharge) {
      alert('Please fill in all required fields.');
      return;
    }

    if (editId) {
      // Edit mode
      setVenues(venues.map(v => v.id === editId ? {
        id: editId,
        name,
        type: type as any,
        location,
        capacity: parseInt(capacity) || 0,
        staffIncharge,
        status: status as any
      } : v));
    } else {
      // Add mode
      const newVenue: Venue = {
        id: String(Date.now()),
        name,
        type: type as any,
        location,
        capacity: parseInt(capacity) || 0,
        staffIncharge,
        status: status as any
      };
      setVenues([...venues, newVenue]);
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this venue?')) {
      setVenues(venues.filter(v => v.id !== id));
    }
  };

  const totalVenues = venues.length;
  const availableCount = venues.filter(v => v.status === 'available').length;
  const unavailableCount = venues.filter(v => v.status === 'unavailable').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Venue Management</h1>
          <p className="text-xs text-gray-500">Register and manage college halls, labs, and classrooms</p>
        </div>
        <Button variant="outline" size="sm" onPress={handleOpenAdd}>
          <Plus className="w-4 h-4 inline mr-1" /> Add New
        </Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <StatCard title="Total Venues" value={String(totalVenues)} />
        <StatCard title="Available" value={String(availableCount)} />
        <StatCard title="Unavailable" value={String(unavailableCount)} variant="danger" />
      </div>

      <Table headers={['Name', 'Type', 'Location', 'Capacity', 'Staff Incharge', 'Status', 'Actions']}>
        {venues.map((venue) => (
          <TableRow key={venue.id}>
            <TableCell className="font-semibold text-gray-800">{venue.name}</TableCell>
            <TableCell><RoleBadge role={venue.type} /></TableCell>
            <TableCell>{venue.location}</TableCell>
            <TableCell>{venue.capacity}</TableCell>
            <TableCell>{venue.staffIncharge}</TableCell>
            <TableCell><StatusBadge status={venue.status} /></TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onPress={() => handleOpenEdit(venue)}>Edit</Button>
                <Button size="sm" variant="danger" onPress={() => handleDelete(venue.id)}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={editId ? 'Edit Venue' : 'Add New Venue'}
      >
        <div className="space-y-4">
          <Input
            label="Venue Name"
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
            placeholder="e.g. Seminar Hall"
          />
          <Select
            label="Venue Type"
            selectedKey={type}
            onSelectionChange={(key) => setType(String(key))}
            options={[
              { id: 'hall', label: 'Hall' },
              { id: 'lab', label: 'Lab' },
              { id: 'classroom', label: 'Classroom' }
            ]}
          />
          <Input
            label="Location"
            value={location}
            onChange={(e) => setLocation((e.target as HTMLInputElement).value)}
            placeholder="e.g. CSE Block"
          />
          <Input
            label="Capacity"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity((e.target as HTMLInputElement).value)}
            placeholder="e.g. 100"
          />
          <Input
            label="Staff In-charge"
            value={staffIncharge}
            onChange={(e) => setStaffIncharge((e.target as HTMLInputElement).value)}
            placeholder="e.g. VP / TMS"
          />
          <Select
            label="Status"
            selectedKey={status}
            onSelectionChange={(key) => setStatus(String(key))}
            options={[
              { id: 'available', label: 'Available' },
              { id: 'unavailable', label: 'Unavailable' }
            ]}
          />
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Button variant="outline" onPress={() => setIsOpen(false)}>Cancel</Button>
            <Button variant="primary" onPress={handleSave}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
