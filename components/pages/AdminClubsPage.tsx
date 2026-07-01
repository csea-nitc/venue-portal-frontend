'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { StatCard } from '@/components/Card';
import { Table, TableCell, TableRow, StatusBadge } from '@/components/Table';
import { Plus } from 'lucide-react';
import { Club } from '@/types';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';

const mockClubs: Club[] = [
  { id: '1', name: 'IEEE NITC', secretary: 'Arjun Nair', contact: '9004283732', facultyCoordinator: 'VP', status: 'available' },
  { id: '2', name: 'Music Club', secretary: 'Priya S', contact: '8372901344', facultyCoordinator: 'TMS', status: 'unavailable' },
  { id: '3', name: 'CSEA', secretary: 'Rahul K', contact: '9637013391', facultyCoordinator: 'VAR', status: 'available' },
  { id: '4', name: 'AeroUnwired', secretary: 'Manisha', contact: '9003585698', facultyCoordinator: 'NKB', status: 'unavailable' },
  { id: '5', name: 'GDSC', secretary: 'Aisha S', contact: '7875982911', facultyCoordinator: 'JJ', status: 'available' },
];

export function AdminClubsPage() {
  const [clubs, setClubs] = useState<Club[]>(mockClubs);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [secretary, setSecretary] = useState('');
  const [contact, setContact] = useState('');
  const [facultyCoordinator, setFacultyCoordinator] = useState('');
  const [status, setStatus] = useState('available');

  const handleOpenAdd = () => {
    setEditId(null);
    setName('');
    setSecretary('');
    setContact('');
    setFacultyCoordinator('');
    setStatus('available');
    setIsOpen(true);
  };

  const handleOpenEdit = (club: Club) => {
    setEditId(club.id);
    setName(club.name);
    setSecretary(club.secretary);
    setContact(club.contact);
    setFacultyCoordinator(club.facultyCoordinator);
    setStatus(club.status);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!name || !secretary || !contact || !facultyCoordinator) {
      alert('Please fill in all required fields.');
      return;
    }

    if (editId) {
      setClubs(clubs.map(c => c.id === editId ? {
        id: editId,
        name,
        secretary,
        contact,
        facultyCoordinator,
        status: status as any
      } : c));
    } else {
      const newClub: Club = {
        id: String(Date.now()),
        name,
        secretary,
        contact,
        facultyCoordinator,
        status: status as any
      };
      setClubs([...clubs, newClub]);
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this club?')) {
      setClubs(clubs.filter(c => c.id !== id));
    }
  };

  const totalClubs = clubs.length;
  const activeCount = clubs.filter(c => c.status === 'available').length;
  const inactiveCount = clubs.filter(c => c.status === 'unavailable').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Club Registry</h1>
          <p className="text-xs text-gray-500">Manage recognized student clubs, secretaries, and coordinators</p>
        </div>
        <Button variant="outline" size="sm" onPress={handleOpenAdd}>
          <Plus className="w-4 h-4 inline mr-1" /> Add New
        </Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <StatCard title="Total Clubs" value={String(totalClubs)} />
        <StatCard title="Active" value={String(activeCount)} />
        <StatCard title="Inactive" value={String(inactiveCount)} variant="danger" />
      </div>

      <Table headers={['Club name', 'Secretary', 'Contact', 'Faculty Coordinator', 'Status', 'Actions']}>
        {clubs.map((club) => (
          <TableRow key={club.id}>
            <TableCell className="font-semibold text-gray-800">{club.name}</TableCell>
            <TableCell>{club.secretary}</TableCell>
            <TableCell>{club.contact}</TableCell>
            <TableCell>{club.facultyCoordinator}</TableCell>
            <TableCell><StatusBadge status={club.status} /></TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onPress={() => handleOpenEdit(club)}>Edit</Button>
                <Button size="sm" variant="danger" onPress={() => handleDelete(club.id)}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={editId ? 'Edit Club' : 'Register New Club'}
      >
        <div className="space-y-4">
          <Input
            label="Club Name"
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
            placeholder="e.g. CSEA"
          />
          <Input
            label="Secretary Name"
            value={secretary}
            onChange={(e) => setSecretary((e.target as HTMLInputElement).value)}
            placeholder="e.g. Rahul K"
          />
          <Input
            label="Contact Number"
            value={contact}
            onChange={(e) => setContact((e.target as HTMLInputElement).value)}
            placeholder="e.g. 9637013391"
          />
          <Input
            label="Faculty Coordinator"
            value={facultyCoordinator}
            onChange={(e) => setFacultyCoordinator((e.target as HTMLInputElement).value)}
            placeholder="e.g. VAR"
          />
          <Select
            label="Status"
            selectedKey={status}
            onSelectionChange={(key) => setStatus(String(key))}
            options={[
              { id: 'available', label: 'Active' },
              { id: 'unavailable', label: 'Inactive' }
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
