'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card, StatCard } from '@/components/Card';
import { Table, TableRow, TableCell } from '@/components/Table';
import { cn } from '@/lib/utils';
import { useFetch } from '@/hooks/useFetch';
import { Loader2 } from 'lucide-react';
import { Switch } from 'react-aria-components';
import { AdminVenuesPage } from './AdminVenuesPage';
import { AdminClubsPage } from './AdminClubsPage';
import { AdminPeoplePage } from './AdminPeoplePage';

type AdminDashboardProps = {
  activeSection?: string;
};

export function AdminDashboard({ activeSection = 'overview' }: AdminDashboardProps) {
  const { data: auditLogsData, isLoading: isFetchingLogs, sendRequest: fetchLogs } = useFetch();

  const [hodApprovalRequired, setHodApprovalRequired] = useState(true);

  useEffect(() => {
    if (activeSection === 'audit') {
      fetchLogs('/api/logs');
    }
  }, [activeSection, fetchLogs]);

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
                      <span className="font-semibold text-primary">8 requests</span>
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
        return <AdminPeoplePage />;
      
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
                  <Loader2 className="w-10 h-10 animate-spin text-accent" />
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
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">HOD Approval Required</h3>
                    <p className="text-xs text-text-muted mt-0.5">Require final approval from the Head of Department for booking requests</p>
                  </div>
                  <Switch
                    isSelected={hodApprovalRequired}
                    onChange={setHodApprovalRequired}
                    className={({ isSelected }) =>
                      cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        isSelected ? "bg-accent" : "bg-gray-200"
                      )
                    }
                  >
                    {({ isSelected }) => (
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          isSelected ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    )}
                  </Switch>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <Button onPress={() => alert('Configuration saved')} variant="primary">
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {renderContent()}
    </div>
  );
}