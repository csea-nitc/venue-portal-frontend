'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { TextArea } from '@/components/TextArea';
import { Tabs, TabPanelComponent } from '@/components/Tabs';
import { Table, TableCell, TableRow, StatusBadge } from '@/components/Table';
import { StatCard } from '@/components/Card';
import { AvailabilityGrid } from '@/components/AvailabilityGrid';
import { Booking } from '@/types';
import { useFetch } from '@/hooks/useFetch';

const initialBookings: Booking[] = [
  { id: '1', title: 'CSEA Coding Contest', venue: 'SSL Lab', startDate: '22/03/26 17:00', endDate: '22/03/26 20:00', bookingDate: '10/03/26', status: 'approved', club: 'CSEA' },
  { id: '2', title: 'Web Development Workshop', venue: 'NSL Lab', startDate: '23/03/26 09:00', endDate: '23/03/26 13:00', bookingDate: '11/03/26', status: 'rejected', club: 'CSEA' },
  { id: '3', title: 'AI Hackathon Planning', venue: 'Seminar Hall', startDate: '25/03/26 14:00', endDate: '25/03/26 16:30', bookingDate: '12/03/26', status: 'pending', club: 'CSEA' },
  { id: '4', title: 'Core Committee Meet', venue: 'Meeting Room', startDate: '27/03/26 15:00', endDate: '27/03/26 16:00', bookingDate: '14/03/26', status: 'pending', club: 'CSEA' },
  { id: '5', title: 'Alumni Guest Lecture', venue: 'APJ Hall', startDate: '28/03/26 10:00', endDate: '28/03/26 12:30', bookingDate: '15/03/26', status: 'approved', club: 'CSEA' },
];

export function ClubDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const userId = localStorage.getItem('perms_user_id');
  const { sendRequest: getBookings, isLoading: isLoadingBookings } = useFetch<Booking[]>();
  // Form states
  const { sendRequest: addBooking, isLoading: isLoadingAddBooking } = useFetch<Booking>();
  const [eventName, setEventName] = useState('');
  const [venue, setVenue] = useState('SSL Lab');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [description, setDescription] = useState('');


  //currently userId isn't being stored in local storage, so to get bookings of each person we need to store user id. 
  useEffect(() => {
    (async () => {
      try {
        const res = await getBookings('/bookings/' + userId);
        if (res) {
          setBookings(res);
        }
      } catch (e) {
        alert('Failed to fetch bookings.');
      }
    })();
  }, []);




  const handleSubmit = async () => {
    if (!eventName || !venue || !startDateTime || !endDateTime) {
      alert('Please fill in all required fields.');
      return;
    }

    const newBooking: Booking = {
      id: String(bookings.length + 1),
      title: eventName,
      venue: venue,
      startDate: startDateTime.replace('T', ' '),
      endDate: endDateTime.replace('T', ' '),
      bookingDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }),
      status: 'pending',
      club: 'CSEA',
      subject: description || 'No description provided'
    };
    try {
      await addBooking('/bookings', {
        method: 'POST',
        body: newBooking,
      });
    } catch (e) {
      alert('Failed to add booking.');
      return;
    }

    setBookings([newBooking, ...bookings]);

    // Clear inputs
    setEventName('');
    setVenue('SSL Lab');
    setStartDateTime('');
    setEndDateTime('');
    setDescription('');
  };

  // Stat computations
  const approvedCount = bookings.filter(b => b.status === 'approved').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const rejectedCount = bookings.filter(b => b.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#7a1f32]">Welcome, Club Secretary</h1>
        <p className="text-sm text-gray-500">Review and manage your booking requests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-[#4b90a1] mb-4 pb-2 border-b border-gray-100">New booking request</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <Input label="Event name" value={eventName} onChange={(e) => setEventName((e.target as HTMLInputElement).value)} />
            <Select
              label="Venue"
              selectedKey={venue}
              onSelectionChange={(key) => setVenue(String(key))}
              options={[
                { id: 'SSL Lab', label: 'SSL Lab' },
                { id: 'NSL Lab', label: 'NSL Lab' },
                { id: 'Seminar Hall', label: 'Seminar Hall' },
                { id: 'APJ Hall', label: 'APJ Hall' },
                { id: 'Meeting Room', label: 'Meeting Room' },
                { id: 'ELHC 402', label: 'ELHC 402' },
              ]}
              className="w-full"
            />
            <Input label="Start date & time" type="datetime-local" value={startDateTime} onChange={(e) => setStartDateTime((e.target as HTMLInputElement).value)} />
            <Input label="End date & time" type="datetime-local" value={endDateTime} onChange={(e) => setEndDateTime((e.target as HTMLInputElement).value)} />
            <div className="md:col-span-2">
              <TextArea label="Description" value={description} onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)} />
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <Button variant="primary" onPress={handleSubmit}>Submit Request</Button>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <StatCard title="Approved requests" value={String(approvedCount)} />
          <StatCard title="Pending requests" value={String(pendingCount)} />
          <StatCard title="Rejected requests" value={String(rejectedCount)} variant="danger" />
        </div>
      </div>

      {/* Availability Grid */}
      <AvailabilityGrid />

      {/* My Bookings list */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-[#7a1f32] mb-4">My Booking Requests</h2>
        <Tabs
          tabs={[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' },
          ]}
          defaultTab="all"
        >
          <TabPanelComponent id="all">
            <Table
              headers={['Title', 'Venue', 'Start date & time', 'End date & time', 'Booking Date', 'Status']}
            >
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-semibold">{booking.title}</TableCell>
                  <TableCell>{booking.venue}</TableCell>
                  <TableCell>{booking.startDate}</TableCell>
                  <TableCell>{booking.endDate}</TableCell>
                  <TableCell>{booking.bookingDate}</TableCell>
                  <TableCell><StatusBadge status={booking.status} /></TableCell>
                </TableRow>
              ))}
            </Table>
          </TabPanelComponent>
          <TabPanelComponent id="pending">
            <Table
              headers={['Title', 'Venue', 'Start date & time', 'End date & time', 'Booking Date', 'Status']}
            >
              {bookings.filter(b => b.status === 'pending').map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-semibold">{booking.title}</TableCell>
                  <TableCell>{booking.venue}</TableCell>
                  <TableCell>{booking.startDate}</TableCell>
                  <TableCell>{booking.endDate}</TableCell>
                  <TableCell>{booking.bookingDate}</TableCell>
                  <TableCell><StatusBadge status={booking.status} /></TableCell>
                </TableRow>
              ))}
            </Table>
          </TabPanelComponent>
          <TabPanelComponent id="approved">
            <Table
              headers={['Title', 'Venue', 'Start date & time', 'End date & time', 'Booking Date', 'Status']}
            >
              {bookings.filter(b => b.status === 'approved').map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-semibold">{booking.title}</TableCell>
                  <TableCell>{booking.venue}</TableCell>
                  <TableCell>{booking.startDate}</TableCell>
                  <TableCell>{booking.endDate}</TableCell>
                  <TableCell>{booking.bookingDate}</TableCell>
                  <TableCell><StatusBadge status={booking.status} /></TableCell>
                </TableRow>
              ))}
            </Table>
          </TabPanelComponent>
          <TabPanelComponent id="rejected">
            <Table
              headers={['Title', 'Venue', 'Start date & time', 'End date & time', 'Booking Date', 'Status']}
            >
              {bookings.filter(b => b.status === 'rejected').map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-semibold">{booking.title}</TableCell>
                  <TableCell>{booking.venue}</TableCell>
                  <TableCell>{booking.startDate}</TableCell>
                  <TableCell>{booking.endDate}</TableCell>
                  <TableCell>{booking.bookingDate}</TableCell>
                  <TableCell><StatusBadge status={booking.status} /></TableCell>
                </TableRow>
              ))}
            </Table>
          </TabPanelComponent>
        </Tabs>
      </Card>
    </div>
  );
}
