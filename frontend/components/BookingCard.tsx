'use client';

import { Button } from './Button';
import { Card } from './Card';
import { Booking } from '@/types';
import { StatusBadge } from './Table';

type BookingCardProps = {
  booking: Booking;
  showActions?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
};

export function BookingCard({ booking, showActions, onAccept, onReject }: BookingCardProps) {
  return (
    <Card className="p-4 flex flex-col justify-between border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{booking.title}</h3>
          <StatusBadge status={booking.status} />
        </div>
        <p className="text-xs font-semibold text-[#4b90a1] mb-1">{booking.venue}</p>
        <p className="text-xs text-gray-500 mb-1">{booking.startDate}</p>
        {booking.subject && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{booking.subject}</p>
        )}
      </div>
      <div>
        {showActions && (
          <div className="flex gap-1.5 mt-1.5">
            <Button variant="success" size="sm" onPress={onAccept}>Accept</Button>
            <Button variant="danger" size="sm" onPress={onReject}>Reject</Button>
          </div>
        )}
        <button className="text-xs font-semibold text-[#4b90a1] mt-3 hover:underline text-left block">
          See details
        </button>
      </div>
    </Card>
  );
}
