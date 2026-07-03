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
>>>>>>> a279c237d27a365992423eb166b681f472125fab

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

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) return;
<<<<<<< HEAD
    console.log(newUser);
    try {
      addNewUser('/admin/users', {
        method: 'POST',
        body: newUser,
      });
    } catch (e) {
      setLoadError({ section: activeSection, message: 'Unable to add user.' });
      return;
    }
    setUsers(prev => [
      ...prev,
      {
        id: String(prev.length + 1),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as Person['role'],
        status: 'available'
      }
    ]);

    setNewUser({ name: '', email: '', role: 'student' });
=======
    try {
      await createUser('/api/admin/users', {
        method: 'POST',
        body: {
          ...newUser,
          isActive: true,
        },
      });
      setNewUser({ name: '', email: '', role: 'CLUB' });
      fetchUsers('/api/admin/users');
    } catch (err) {
      console.error('Create user failed:', err);
    }
>>>>>>> a279c237d27a365992423eb166b681f472125fab
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(`/api/admin/users/${userId}`, { method: 'DELETE' });
      fetchUsers('/api/admin/users');
    } catch (err) {
      console.error('Delete user failed:', err);
    }
  };

  const users = usersData?.users || [];
  const logs = auditLogsData?.data || [];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">System Overview</h1>
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">Administrator</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Users" value="45" />
              <StatCard title="Active Faculty" value="28" />
              <StatCard title="Pending Requests" value="12" />
              <StatCard title="System Uptime" value="99.8%" />
            </div>

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
              <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Add New User
              </h2>
              {createUserError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{createUserError}</span>
                </div>
              )}
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
                  onSelectionChange={(key) => setNewUser(prev => ({ ...prev, role: key as string }))}
                  options={[
<<<<<<< HEAD
                    { id: 'CLUB', label: 'Club Secretary' },
                    { id: 'FACULTY_COORDINATOR', label: 'Faculty Coordinator' },
                    { id: 'STAFF_IN_CHARGE', label: 'Staff Incharge' },
                    { id: 'FACULTY_IN_CHARGE', label: 'Faculty Incharge' },
=======
                    { id: 'CLUB', label: 'Club' },
                    { id: 'FACULTY_COORDINATOR', label: 'Faculty Coordinator' },
                    { id: 'STAFF_IN_CHARGE', label: 'Staff in Charge' },
                    { id: 'FACULTY_IN_CHARGE', label: 'Faculty in Charge' },
>>>>>>> a279c237d27a365992423eb166b681f472125fab
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
<<<<<<< HEAD
              {isLoadingUsers ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-[#7a1f32]" />
                </div>
              ) : (
                <Table headers={['Name', 'Email', 'Role', 'Status', 'Actions']}>
                  {users.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-gray-800">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-semibold border bg-gray-50 text-gray-700 border-gray-200'
                        )}>
                          {user.role?.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          'px-2 py-0.5 border text-xs rounded-full font-semibold',
                          user.status === 'available' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                        )}>
                          {user.status === 'available' ? 'AVAILABLE' : 'UNAVAILABLE'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onPress={() => handleEditUser(user)}>Edit</Button>
                          <Button size="sm" variant="danger" onPress={() => handleDeleteUser(user)}>Disable</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
=======
              {isFetchingUsers ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-10 h-10 animate-spin text-[#4b90a1]" />
                </div>
              ) : fetchUsersError ? (
                <div className="p-6 text-center text-red-600 flex flex-col items-center gap-2">
                  <AlertCircle className="w-10 h-10" />
                  <p>{fetchUsersError}</p>
                  <Button variant="outline" size="sm" onPress={() => fetchUsers('/api/admin/users')}>Retry</Button>
                </div>
              ) : (
                <Table headers={['Name', 'Email', 'Role', 'Status', 'Actions']}>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell className="text-center py-8 text-gray-500 italic">No users found</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  ) : (
                    users.map((user: any) => (
                      <TableRow key={user.userId}>
                        <TableCell className="font-medium text-gray-800">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wider',
                            user.role === 'CLUB' && 'bg-blue-50 text-blue-700 border-blue-200',
                            user.role.startsWith('FACULTY') && 'bg-green-50 text-green-700 border-green-200',
                            user.role === 'ADMIN' && 'bg-purple-50 text-purple-700 border-purple-200',
                            user.role === 'HOD' && 'bg-amber-50 text-amber-700 border-amber-200'
                          )}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            "px-2 py-0.5 border text-[10px] rounded-full font-bold tracking-wider",
                            user.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"
                          )}>
                            {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onPress={() => handleOpenEdit(user)}>
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="sm" variant="danger" onPress={() => handleDeleteUser(user.userId)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
>>>>>>> a279c237d27a365992423eb166b681f472125fab
                </Table>
              )}
            </Card>
          </div>
        );
<<<<<<< HEAD

=======
      
      case 'audit':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">System Audit Logs</h1>
              <p className="text-sm text-gray-500">Traceable history of all booking actions and system changes</p>
            </div>

            <Card className="p-0 overflow-hidden">
              {isFetchingLogs ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-10 h-10 animate-spin text-[#4b90a1]" />
                </div>
              ) : (
                <Table headers={['Timestamp', 'User', 'Action', 'Target', 'Details']}>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell className="text-center py-8 text-gray-500 italic">No logs found</TableCell>
                      <TableCell>-</TableCell><TableCell>-</TableCell><TableCell>-</TableCell><TableCell>-</TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log: any) => (
                      <TableRow key={log.logId}>
                        <TableCell className="text-xs whitespace-nowrap">
                          {new Date(log.createdAt || log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-semibold">{log.actor?.name}</div>
                          <div className="text-[10px] text-gray-500">{log.actor?.email}</div>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold border",
                            log.action === 'APPROVED' && "bg-green-50 text-green-700 border-green-200",
                            log.action === 'REJECTED' && "bg-red-50 text-red-700 border-red-200",
                            log.action === 'SUBMITTED' && "bg-blue-50 text-blue-700 border-blue-200",
                            log.action === 'FORWARDED' && "bg-amber-50 text-amber-700 border-amber-200"
                          )}>
                            {log.action}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-medium">
                          {log.booking?.eventName || 'System'}
                        </TableCell>
                        <TableCell className="text-xs text-gray-600 italic">
                          {log.remarks || '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </Table>
              )}
            </Card>
          </div>
        );

      case 'venues':
        return <AdminVenuesPage />;
      case 'clubs':
        return <AdminClubsPage />;
      case 'people':
        return <AdminPeoplePage />;
>>>>>>> a279c237d27a365992423eb166b681f472125fab
      case 'settings':
      case 'config':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
              <p className="text-sm text-gray-500">Configure global portal parameters and approval workflows</p>
            </div>
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
                        className="h-4 w-4 text-[#4b90a1] focus:ring-[#4b90a1]"
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
                        className="h-4 w-4 text-[#4b90a1] focus:ring-[#4b90a1]"
                      />
                      <span>Consensus Mode</span>
                    </label>
                  </div>
                </div>

                {approvalMode === 'consensus' && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#8d6e63] mb-2">Required Approvals</h3>
                    <Input
                      label="Number of Approvals"
                      type="number"
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
<<<<<<< HEAD

      case 'requests':
      case 'audit':
        return (
          <Card className="p-0 overflow-hidden">
            {isLoadingLogs ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#7a1f32]" />
              </div>
            ) : (
              <Table headers={['User', 'Action', 'Timestamp', 'Request ID', 'Remarks']}>
                {logs.map((log, index) => (
                  <TableRow key={log.id || index}>
                    <TableCell className="font-semibold text-gray-800">{log.actor?.name || 'System'}</TableCell>
                    <TableCell>
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-semibold border bg-gray-50 text-gray-700 border-gray-200'
                      )}>
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell>{log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}</TableCell>
                    <TableCell>
                      <span className="font-mono text-xs">{log.booking?.bookingId ? `REQ-${log.booking.bookingId}` : '-'}</span>
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
            )}
          </Card>
        );

      case 'venues':
        return <AdminVenuesPage />;

      case 'clubs':
        return <AdminClubsPage />;

      case 'people':
        return <AdminPeoplePage />;

=======
>>>>>>> a279c237d27a365992423eb166b681f472125fab
      default:
        return null;
    }
  };

  return (
<<<<<<< HEAD
    <div className="space-y-4">
      {loadError?.section === activeSection && (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{loadError.message}</span>
        </div>
      )}

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
        </>
      )}

=======
    <div className="p-4 lg:p-6 space-y-6">
>>>>>>> a279c237d27a365992423eb166b681f472125fab
      {renderContent()}

      {editingUser && (
        <Modal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          title="Edit User Profile"
        >
          <div className="space-y-4 p-1">
            {createUserError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{createUserError}</span>
              </div>
            )}
            <Input 
              label="Full Name" 
              value={editingUser.name}
              onChange={(e) => setEditingUser((prev: any) => ({ ...prev, name: (e.target as HTMLInputElement).value }))}
              placeholder="Enter full name"
            />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8d6e63]">Email</span>
              <span className="text-sm font-semibold text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2.5">{editingUser.email}</span>
            </div>
            
            <Select
              label="Role"
              selectedKey={editingUser.role}
              onSelectionChange={(key) => setEditingUser((prev: any) => ({ ...prev, role: key as string }))}
              options={[
                { id: 'CLUB', label: 'Club' },
                { id: 'FACULTY_COORDINATOR', label: 'Faculty Coordinator' },
                { id: 'STAFF_IN_CHARGE', label: 'Staff in Charge' },
                { id: 'FACULTY_IN_CHARGE', label: 'Faculty in Charge' },
                { id: 'HOD', label: 'HOD' },
                { id: 'ADMIN', label: 'Admin' },
              ]}
            />

            <Select
              label="Status"
              selectedKey={editingUser.isActive ? 'active' : 'inactive'}
              onSelectionChange={(key) => setEditingUser((prev: any) => ({ ...prev, isActive: key === 'active' }))}
              options={[
                { id: 'active', label: 'Active' },
                { id: 'inactive', label: 'Inactive' }
              ]}
            />

            <div className="flex gap-3 pt-4">
              <Button variant="primary" className="flex-1" onPress={handleSaveEdit} isDisabled={isCreatingUser}>
                {isCreatingUser ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Update User
              </Button>
              <Button variant="outline" className="flex-1" onPress={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
