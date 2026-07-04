'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card, StatCard } from '@/components/Card';
import { Table, TableRow, TableCell } from '@/components/Table';
import { Select } from '@/components/Select';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { cn } from '@/lib/utils';
import { useFetch } from '@/hooks/useFetch';
import { Loader2, AlertCircle, UserPlus, Trash2, Edit } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { Loader2, AlertCircle, UserPlus, Trash2, Edit } from 'lucide-react';
import { AdminVenuesPage } from './AdminVenuesPage';
import { AdminClubsPage } from './AdminClubsPage';
import { AdminPeoplePage } from './AdminPeoplePage';
<<<<<<< HEAD
import { useFetch } from '@/hooks/useFetch';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Person } from '@/types';
=======
>>>>>>> a279c237d27a365992423eb166b681f472125fab

type AdminDashboardProps = {
  activeSection?: string;
};

type AdminUser = Record<string, unknown> & {
  userId?: string | number;
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
};

type AuditLog = Record<string, unknown> & {
  id?: string | number;
  action?: string;
  timestamp?: string | number | Date;
  actor?: { name?: string };
  booking?: { bookingId?: string | number };
  remarks?: string;
};

export function AdminDashboard({ activeSection = 'overview' }: AdminDashboardProps) {
<<<<<<< HEAD
  const { sendRequest: fetchUsers, isLoading: isLoadingUsers } = useFetch<{ users?: Person[] }>();
  const { sendRequest: addNewUser, isLoading: isLoadingAddUser } = useFetch<{ users?: Person[] }>();
  const { sendRequest: fetchLogs, isLoading: isLoadingLogs } = useFetch<{ data?: AuditLog[] }>();
  const { sendRequest: editUser, isLoading: isLoadingEditUser } = useFetch<{ user?: Person }>();
  const { sendRequest: deleteUser, isLoading: isLoadingDeleteUser } = useFetch<{ user?: Person }>();
  const [approvalMode, setApprovalMode] = useState<'single' | 'consensus'>('single');
  const [requiredApprovals, setRequiredApprovals] = useState(1);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'CLUB' });
  const [users, setUsers] = useState<Person[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loadError, setLoadError] = useState<{ section: string; message: string } | null>(null);

  useEffect(() => {
    if (activeSection === 'users') {
      fetchUsers('/admin/users')
        .then(res => {
          if (res && res.users) setUsers(res.users);
          setLoadError(null);
        })
        .catch((err) => setLoadError({ section: activeSection, message: err.message || 'Unable to load users.' }));
    }

    if (activeSection === 'requests' || activeSection === 'audit') {
      fetchLogs('/logs')
        .then(res => {
          if (res && res.data) setLogs(res.data);
          setLoadError(null);
        })
        .catch((err) => setLoadError({ section: activeSection, message: err.message || 'Unable to load logs.' }));
    }
  }, [activeSection, fetchUsers, fetchLogs]);


  const handleEditUser = (user: Person) => {
    try {
      editUser('/admin/users/' + user.id, {
        method: 'PUT',
        body: user,
      });
    } catch (e) {
      setLoadError({ section: activeSection, message: 'Unable to edit user.' });
      return;
    }
    console.log(user);
  }

  const handleDeleteUser = (user: Person) => {
    console.log(user);
  }
=======
  const { data: usersData, isLoading: isFetchingUsers, error: fetchUsersError, sendRequest: fetchUsers } = useFetch();
  const { isLoading: isCreatingUser, error: createUserError, sendRequest: createUser } = useFetch();
  const { sendRequest: deleteUser } = useFetch();
  const { data: auditLogsData, isLoading: isFetchingLogs, sendRequest: fetchLogs } = useFetch();

  const [approvalMode, setApprovalMode] = useState<'single' | 'consensus'>('single');
  const [requiredApprovals, setRequiredApprovals] = useState(1);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'CLUB' });

  // Modal states for editing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const handleOpenEdit = (user: any) => {
    setEditingUser({
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser?.name) return;
    try {
      await createUser(`/api/admin/users/${editingUser.userId}`, {
        method: 'PUT',
        body: {
          name: editingUser.name,
          role: editingUser.role,
          isActive: editingUser.isActive
        },
      });
      setIsEditModalOpen(false);
      fetchUsers('/api/admin/users');
    } catch (err) {
      console.error('Update user failed:', err);
    }
  };

  useEffect(() => {
    if (activeSection === 'users') {
      fetchUsers('/api/admin/users');
    } else if (activeSection === 'audit') {
      fetchLogs('/api/logs');
    }
  }, [activeSection, fetchUsers, fetchLogs]);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    setUsers(prev => [
      ...prev,
      {
        id: String(prev.length + 1),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'active'
      }
    ]);
    setNewUser({ name: '', email: '', role: 'student' });
  };

  const handleUpdateConfig = () => {
    alert(`Configuration updated: ${approvalMode.toUpperCase()} mode with ${requiredApprovals} approval(s) required.`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-4">
            <Card className="p-5">
              <h2 className="text-base font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">System Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2.5">Services Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>SSO Authentication</span>
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">Operational</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">Operational</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2.5">Today&apos;s Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Requests Today</span>
                      <span className="font-semibold text-[#7a1f32]">8 requests</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Approvals Today</span>
                      <span className="font-semibold text-green-700">6 approvals</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
              <p className="text-sm text-gray-500">Manage institutional users and their access roles</p>
            </div>

            <Card className="p-5">
              <h2 className="text-base font-semibold text-gray-800 mb-3">Add New User</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <Input
                  label="Full Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: (e.target as HTMLInputElement).value }))}
                  placeholder="Enter full name"
                />
                <Input
                  label="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: (e.target as HTMLInputElement).value }))}
                  placeholder="institutional@email.edu"
                />
                <Select
                  label="Role"
                  selectedKey={newUser.role}
                  onSelectionChange={(key) => setNewUser(prev => ({ ...prev, role: key }))}
                  options={[
                    { id: 'CLUB', label: 'Club' },
                    { id: 'FACULTY_COORDINATOR', label: 'Faculty Coordinator' },
                    { id: 'STAFF_IN_CHARGE', label: 'Staff in Charge' },
                    { id: 'FACULTY_IN_CHARGE', label: 'Faculty in Charge' },
                    { id: 'HOD', label: 'HOD' },
                    { id: 'ADMIN', label: 'Admin' },
                  ]}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button onPress={handleAddUser} variant="primary" isDisabled={isCreatingUser}>
                  {isCreatingUser ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Add User
                </Button>
              </div>
            </Card>

            <Card className="p-0 overflow-hidden">
              <Table headers={['Name', 'Email', 'Role', 'Status', 'Actions']}>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-gray-800">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-semibold border',
                        user.role === 'student' && 'bg-blue-50 text-blue-700 border-blue-200',
                        user.role === 'faculty' && 'bg-green-50 text-green-700 border-green-200',
                        user.role === 'admin' && 'bg-purple-50 text-purple-700 border-purple-200'
                      )}>
                        {user.role.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-xs rounded-full font-semibold">
                        ACTIVE
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="danger" onPress={() => setUsers(prev => prev.filter(u => u.id !== user.id))}>Disable</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </Card>
          </div>
        );
      
      case 'settings':
      case 'config':
        return (
          <div className="space-y-4">
            <Card className="p-5">
              <h2 className="text-base font-semibold text-gray-800 mb-3">Approval Configuration</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8d6e63] mb-2">Approval Mode</h3>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input
                        type="radio"
                        name="approvalMode"
                        value="single"
                        checked={approvalMode === 'single'}
                        onChange={(e) => setApprovalMode(e.target.value as 'single' | 'consensus')}
                        className="h-4 w-4 text-[#7a1f32] focus:ring-[#7a1f32] border-gray-300"
                      />
                      <span>Single Approval</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input
                        type="radio"
                        name="approvalMode"
                        value="consensus"
                        checked={approvalMode === 'consensus'}
                        onChange={(e) => setApprovalMode(e.target.value as 'single' | 'consensus')}
                        className="h-4 w-4 text-[#7a1f32] focus:ring-[#7a1f32] border-gray-300"
                      />
                      <span>Consensus Mode</span>
                    </label>
                  </div>
                </div>

                {approvalMode === 'consensus' && (
                  <div className="w-48">
                    <Input
                      type="number"
                      label="Number of Approvals"
                      value={requiredApprovals.toString()}
                      onChange={(e) => setRequiredApprovals(parseInt((e.target as HTMLInputElement).value) || 1)}
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <Button onPress={() => alert('Configuration saved')} variant="primary">
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        );
      
      case 'requests':
      case 'audit':
        return (
          <Card className="p-0 overflow-hidden">
            <Table headers={['User', 'Action', 'Timestamp', 'Request ID', 'Remarks']}>
              {mockAuditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-semibold text-gray-800">{log.userName}</TableCell>
                  <TableCell>
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-semibold border',
                      log.action.includes('Approved') && 'bg-green-50 text-green-700 border-green-200',
                      log.action.includes('Forwarded') && 'bg-yellow-50 text-yellow-700 border-yellow-200',
                      log.action.includes('Submitted') && 'bg-blue-50 text-blue-700 border-blue-200'
                    )}>
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs">{log.requestId}</span>
                  </TableCell>
                  <TableCell>
                    {log.remarks ? (
                      <span className="text-gray-500 text-xs">{log.remarks}</span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </Card>
        );
      
      case 'venues':
        return <AdminVenuesPage />;
      
      case 'clubs':
        return <AdminClubsPage />;
      
      case 'people':
        return <AdminPeoplePage />;
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {activeSection === 'overview' && (
        <>
          <div>
            <h1 className="text-2xl font-bold text-[#7a1f32]">Welcome, Administrator</h1>
            <p className="text-sm text-gray-500">Overview of system status, active directory, and operational logs</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Users" value="45" />
            <StatCard title="Active Faculty" value="28" />
            <StatCard title="Pending Requests" value="12" />
            <StatCard title="System Uptime" value="99.8%" />
          </div>
        </Modal>
      )}

      {renderContent()}
    </div>
  );
}
