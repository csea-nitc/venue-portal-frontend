'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { StatCard } from '@/components/Card';
import { Table, TableCell, TableRow, StatusBadge, RoleBadge } from '@/components/Table';
import { Plus } from 'lucide-react';
import { Person } from '@/types';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';

const mockPeople: Person[] = [
  { id: '1', name: 'Mr. Vinod Pathari', email: 'pathari@nitc.ac.in', role: 'faculty_in_charge', status: 'available' },
  { id: '2', name: 'Mrs. Chandramani', email: 'chandramani@nitc.ac.in', role: 'faculty_coordinator', status: 'unavailable' },
  { id: '3', name: 'Mr. Rahul N', email: 'rahul@nitc.ac.in', role: 'staff_incharge', status: 'available' },
  { id: '4', name: 'Mrs. Subhashini', email: 'subha@nitc.ac.in', role: 'hod', status: 'unavailable' },
  { id: '5', name: 'Mrs. Abidha V P', email: 'abidha@nitc.ac.in', role: 'faculty_in_charge', status: 'available' },
];

export function AdminPeoplePage() {
  const [people, setPeople] = useState<Person[]>(mockPeople);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('faculty_in_charge');
  const [status, setStatus] = useState('available');

  const handleOpenAdd = () => {
    setEditId(null);
    setName('');
    setEmail('');
    setRole('faculty_in_charge');
    setStatus('available');
    setIsOpen(true);
  };

  const handleOpenEdit = (person: Person) => {
    setEditId(person.id);
    setName(person.name);
    setEmail(person.email);
    setRole(person.role);
    setStatus(person.status);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!name || !email) {
      alert('Please fill in all required fields.');
      return;
    }

    if (editId) {
      setPeople(people.map(p => p.id === editId ? {
        id: editId,
        name,
        email,
        role: role as any,
        status: status as any
      } : p));
    } else {
      const newPerson: Person = {
        id: String(Date.now()),
        name,
        email,
        role: role as any,
        status: status as any
      };
      setPeople([...people, newPerson]);
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this person?')) {
      setPeople(people.filter(p => p.id !== id));
    }
  };

  const totalPeople = people.length;
  const staffCount = people.filter(p => p.role.includes('staff')).length;
  const facultyCount = people.filter(p => p.role.includes('faculty') || p.role.includes('hod')).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Directory & Roles</h1>
          <p className="text-xs text-gray-500">Configure roles for faculty coordinators, HODs, and staff</p>
        </div>
        <Button variant="outline" size="sm" onPress={handleOpenAdd}>
          <Plus className="w-4 h-4 inline mr-1" /> Add New
        </Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <StatCard title="Total People" value={String(totalPeople)} />
        <StatCard title="Staff" value={String(staffCount)} />
        <StatCard title="Faculty" value={String(facultyCount)} />
      </div>

      <Table headers={['Name', 'Email', 'Role', 'Status', 'Actions']}>
        {people.map((person) => (
          <TableRow key={person.id}>
            <TableCell className="font-semibold text-gray-800">{person.name}</TableCell>
            <TableCell>{person.email}</TableCell>
            <TableCell><RoleBadge role={person.role} /></TableCell>
            <TableCell><StatusBadge status={person.status} /></TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onPress={() => handleOpenEdit(person)}>Edit</Button>
                <Button size="sm" variant="danger" onPress={() => handleDelete(person.id)}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={editId ? 'Edit Person Info' : 'Add New Person'}
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
            placeholder="e.g. Mr. Vinod Pathari"
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
            placeholder="e.g. pathari@nitc.ac.in"
          />
          <Select
            label="Role"
            selectedKey={role}
            onSelectionChange={(key) => setRole(String(key))}
            options={[
              { id: 'faculty_in_charge', label: 'Faculty In-charge' },
              { id: 'faculty_coordinator', label: 'Faculty Coordinator' },
              { id: 'staff_incharge', label: 'Staff In-charge' },
              { id: 'hod', label: 'HOD' },
              { id: 'admin', label: 'Admin' },
              { id: 'club', label: 'Club Secretary' }
            ]}
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
