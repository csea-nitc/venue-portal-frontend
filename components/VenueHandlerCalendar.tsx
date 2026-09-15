'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Building,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { Booking } from '@/types';
import { BookingDetailsModal } from './BookingDetailsModal';

type VenueHandler = {
  handlerId: number;
  role: string;
  isActive: boolean;
};

type ApiVenue = {
  venueId: number;
  name: string;
  venueType: string;
  location: string;
  capacity: number;
  isAvailable: boolean;
  handlers?: VenueHandler[];
};

type ScheduleBooking = {
  bookingId: number;
  clubId: number;
  eventName: string;
  description?: string;
  eventStart: string;
  eventEnd: string;
  status: 'PENDING_STAFF' | 'PENDING_FACULTY' | 'APPROVED' | 'REJECTED' | 'PENDING_COORDINATOR' | 'PENDING_HOD' | 'CANCELLED' | 'WITHDRAWN';
  createdAt?: string;
  club?: {
    clubName?: string;
    user?: {
      name?: string;
      email?: string;
    };
  };
  currentHandlers?: {
    handlerId: number;
    handlerRole: string;
  }[];
};

type VenueHandlerCalendarProps = {
  userRole?: string;
  userId?: string | null;
  onBookingAction?: (bookingId: string, action: 'approved' | 'rejected') => Promise<void>;
  refreshTrigger?: number;
};

const DAY_ABBREVS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

export function VenueHandlerCalendar({
  userRole = 'STAFF_IN_CHARGE',
  userId,
  onBookingAction,
  refreshTrigger,
}: VenueHandlerCalendarProps) {
  const { sendRequest: fetchVenues, isLoading: isLoadingVenues } = useFetch<{ success: boolean; venues: ApiVenue[] }>();
  const { sendRequest: fetchSchedule, isLoading: isLoadingSchedule } = useFetch<{ success: boolean; bookings: ScheduleBooking[] }>();
  const { sendRequest: fetchBookingDetails } = useFetch<{ success: boolean; data: any }>();
  const { sendRequest: approveRequest } = useFetch();
  const { sendRequest: rejectRequest } = useFetch();

  const [venues, setVenues] = useState<ApiVenue[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);
  const [scheduleBookings, setScheduleBookings] = useState<ScheduleBooking[]>([]);
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // Selected booking modal state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Load venues on mount
  useEffect(() => {
    let isMounted = true;
    fetchVenues('/bookings/venues', { method: 'GET' })
      .then((res) => {
        if (!isMounted || !res?.venues) return;

        const currentUserId = userId ? Number(userId) : null;
        let availableVenues = res.venues;

        // If user is a venue handler (STAFF_IN_CHARGE or FACULTY_IN_CHARGE), only show venues assigned to them
        if (currentUserId && (userRole === 'STAFF_IN_CHARGE' || userRole === 'FACULTY_IN_CHARGE')) {
          const myVenues = res.venues.filter((v) =>
            v.handlers?.some((h) => h.handlerId === currentUserId && h.isActive)
          );
          if (myVenues.length > 0) {
            availableVenues = myVenues;
          }
        }

        setVenues(availableVenues);

        // Find if any venue is assigned to this user
        const assignedVenue = currentUserId
          ? availableVenues.find((v) => v.handlers?.some((h) => h.handlerId === currentUserId && h.isActive))
          : null;

        if (assignedVenue) {
          setSelectedVenueId(assignedVenue.venueId);
        } else if (availableVenues.length > 0) {
          setSelectedVenueId(availableVenues[0].venueId);
        }
      })
      .catch((err) => console.error('Failed to load venues for calendar:', err));

    return () => {
      isMounted = false;
    };
  }, [fetchVenues, userId, userRole]);

  // Load schedule whenever selectedVenue or refreshTrigger changes
  const loadSchedule = useCallback(async () => {
    if (!selectedVenueId) return;
    try {
      const res = await fetchSchedule(`/bookings/venues/${selectedVenueId}/schedule`, { method: 'GET' });
      if (res?.bookings) {
        setScheduleBookings(res.bookings);
      }
    } catch (err) {
      console.error('Failed to load venue schedule:', err);
    }
  }, [fetchSchedule, selectedVenueId]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule, refreshTrigger]);

  // Calculate 7-day window based on weekOffset
  const weekDates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + weekOffset * 7 + i);
      return d;
    });
  }, [weekOffset]);

  const selectedVenue = useMemo(() => {
    return venues.find((v) => v.venueId === selectedVenueId) || null;
  }, [venues, selectedVenueId]);

  const isAssignedToUser = useMemo(() => {
    if (!selectedVenue || !userId) return false;
    const currentUserId = Number(userId);
    return selectedVenue.handlers?.some((h) => h.handlerId === currentUserId && h.isActive) ?? false;
  }, [selectedVenue, userId]);

  // Format date range header: e.g. "14 Sep 2026 – 20 Sep 2026"
  const dateRangeLabel = useMemo(() => {
    if (weekDates.length < 7) return '';
    const start = weekDates[0];
    const end = weekDates[6];
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return `${start.toLocaleDateString('en-GB', opts)} – ${end.toLocaleDateString('en-GB', opts)}`;
  }, [weekDates]);

  // Check if slot falls in a booking
  const getBookingForSlot = useCallback(
    (dayDate: Date, hour: number) => {
      const slotStart = new Date(dayDate);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(dayDate);
      slotEnd.setHours(hour + 1, 0, 0, 0);

      for (const booking of scheduleBookings) {
        if (['REJECTED', 'WITHDRAWN', 'CANCELLED'].includes(booking.status)) continue;

        const bStart = new Date(booking.eventStart);
        const bEnd = new Date(booking.eventEnd);

        if (slotStart.getTime() < bEnd.getTime() && slotEnd.getTime() > bStart.getTime()) {
          const isPending = booking.status !== 'APPROVED';

          return {
            booking,
            isPending,
            isStartHour: slotStart.getTime() <= bStart.getTime() && slotEnd.getTime() > bStart.getTime(),
          };
        }
      }
      return null;
    },
    [scheduleBookings]
  );

  // Check if slot is in the past
  const isPastSlot = useCallback((dayDate: Date, hour: number) => {
    const now = new Date();
    const slotEnd = new Date(dayDate);
    slotEnd.setHours(hour + 1, 0, 0, 0);
    return slotEnd.getTime() <= now.getTime();
  }, []);

  // Handler for clicking a booked slot
  const handleSlotClick = async (booking: ScheduleBooking) => {
    // Default basic booking
    const basicBooking: Booking = {
      id: String(booking.bookingId),
      title: booking.eventName,
      venue: selectedVenue?.name || `Venue #${selectedVenueId}`,
      startDate: booking.eventStart,
      endDate: booking.eventEnd,
      bookingDate: booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : '',
      status: booking.status,
      club: booking.club?.clubName || booking.club?.user?.name || 'Student Body',
      subject: booking.description || 'No additional description provided.',
      logs: [],
    };

    setSelectedBooking(basicBooking);
    setIsModalOpen(true);
    setActionError(null);

    // Fetch full booking details (including complete lifecycle activity logs)
    try {
      const details = await fetchBookingDetails(`/bookings/${booking.bookingId}`, { method: 'GET' });
      if (details?.data) {
        const d = details.data;
        const enhancedLogs = (d.logs || []).map((l: any) => ({
          name: l.actor?.name || l.name || 'User',
          email: l.actor?.email || l.email || '',
          role: l.role || l.actor?.roles?.[0]?.role || '',
          action: l.action || '',
          timestamp: l.timestamp || l.createdAt || new Date().toISOString(),
        }));

        setSelectedBooking({
          id: String(d.bookingId),
          title: d.eventName || booking.eventName,
          venue: d.venue?.name || selectedVenue?.name || `Venue #${selectedVenueId}`,
          startDate: d.eventStart || booking.eventStart,
          endDate: d.eventEnd || booking.eventEnd,
          bookingDate: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '',
          status: d.status || booking.status,
          club: d.club?.clubName || booking.club?.clubName || 'Student Body',
          subject: d.description || 'No additional description provided.',
          logs: enhancedLogs,
        });
      }
    } catch {
      // Keep basic booking
    }
  };

  // Handler for direct approve/reject from calendar modal
  const handleBookingActionFromModal = async (action: 'approved' | 'rejected') => {
    if (!selectedBooking?.id) return;
    setIsProcessingAction(true);
    setActionError(null);

    try {
      if (onBookingAction) {
        await onBookingAction(selectedBooking.id, action);
      } else {
        const endpoint = `/bookings/${selectedBooking.id}/${action === 'approved' ? 'approve' : 'reject'}`;
        const body = action === 'approved' ? { remarks: 'Approved from Venue Calendar' } : { reason: 'Rejected from Venue Calendar' };
        await (action === 'approved' ? approveRequest(endpoint, { method: 'POST', body }) : rejectRequest(endpoint, { method: 'POST', body }));
      }

      setIsModalOpen(false);
      await loadSchedule();
    } catch (err: any) {
      setActionError(err.message || `Failed to ${action} booking.`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Summary counts for current week
  const weekStats = useMemo(() => {
    if (weekDates.length < 7) return { approved: 0, pending: 0, total: 0 };
    const startWeek = weekDates[0].getTime();
    const endWeek = new Date(weekDates[6]).setHours(23, 59, 59, 999);

    let approved = 0;
    let pending = 0;

    scheduleBookings.forEach((b) => {
      if (['REJECTED', 'WITHDRAWN', 'CANCELLED'].includes(b.status)) return;
      const bStart = new Date(b.eventStart).getTime();
      if (bStart >= startWeek && bStart <= endWeek) {
        if (b.status === 'APPROVED') approved++;
        else pending++;
      }
    });

    return { approved, pending, total: approved + pending };
  }, [scheduleBookings, weekDates]);

  return (
    <div className="space-y-5 font-sans">
      {/* Top Controls: Venue Display / Switcher & Summary Badges */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-card-header/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Venue Display / Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label htmlFor="venue-calendar-select" className="text-xs font-bold text-text-muted uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-primary" />
            Venue:
          </label>
          {venues.length > 1 ? (
            <div className="relative">
              <select
                id="venue-calendar-select"
                value={selectedVenueId || ''}
                onChange={(e) => setSelectedVenueId(Number(e.target.value))}
                disabled={isLoadingVenues}
                className="bg-surface border border-card-header/80 text-text font-bold text-sm rounded-xl px-3.5 py-2.5 pr-9 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer w-full sm:w-64"
              >
                {venues.map((v) => {
                  const isMine = userId ? v.handlers?.some((h) => h.handlerId === Number(userId) && h.isActive) : false;
                  return (
                    <option key={v.venueId} value={v.venueId}>
                      {v.name} {isMine ? '★ (Assigned)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : (
            <span className="bg-surface border border-card-header/80 text-text font-extrabold text-sm rounded-xl px-3.5 py-2 inline-flex items-center">
              {selectedVenue ? selectedVenue.name : (isLoadingVenues ? 'Loading venue...' : 'No Venue Available')}
            </span>
          )}

          {selectedVenue && (
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1 bg-surface px-2.5 py-1 rounded-lg border border-card-header/40 font-medium">
                <MapPin className="w-3 h-3 text-accent shrink-0" />
                {selectedVenue.location}
              </span>
              <span className="inline-flex items-center gap-1 bg-surface px-2.5 py-1 rounded-lg border border-card-header/40 font-medium">
                <Users className="w-3 h-3 text-primary shrink-0" />
                Cap: {selectedVenue.capacity}
              </span>
              {isAssignedToUser && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Assigned Handler
                </span>
              )}
            </div>
          )}
        </div>

        {/* Quick Week Metrics & Refresh */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{weekStats.pending} Pending</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{weekStats.approved} Approved</span>
            </div>
          </div>

          <button
            type="button"
            onClick={loadSchedule}
            disabled={isLoadingSchedule}
            title="Refresh Schedule"
            className="p-2 rounded-xl bg-surface hover:bg-card-header/40 border border-card-header/60 text-text-muted hover:text-primary transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className={`w-4 h-4 ${isLoadingSchedule ? 'animate-spin text-primary' : ''}`} />
          </button>
        </div>
      </div>

      {/* Week Navigation & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface/80 p-3.5 rounded-2xl border border-card-header/50">
        {/* Week Navigator */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="p-1.5 rounded-lg border border-card-header/70 bg-white hover:bg-surface text-text font-bold transition-all active:scale-95 cursor-pointer"
            aria-label="Previous Week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs sm:text-sm font-bold text-text px-2 min-w-[210px] text-center">
            {dateRangeLabel}
          </span>

          <button
            type="button"
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="p-1.5 rounded-lg border border-card-header/70 bg-white hover:bg-surface text-text font-bold transition-all active:scale-95 cursor-pointer"
            aria-label="Next Week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {weekOffset !== 0 && (
            <button
              type="button"
              onClick={() => setWeekOffset(0)}
              className="text-xs font-bold text-primary hover:underline ml-2 cursor-pointer"
            >
              Current Week
            </button>
          )}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="bg-[#fdf6ee] rounded-3xl p-4 sm:p-6 border border-card-header/50 shadow-sm relative overflow-hidden">
        {isLoadingSchedule && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-xs z-20 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-md border border-card-header">
              <RotateCcw className="w-4 h-4 animate-spin text-primary" />
              <span className="text-xs font-bold text-text">Updating schedule...</span>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-text-muted font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
            <span>Click on any booked slot to view event & organizer details, review activity logs, or approve/reject.</span>
          </p>
        </div>

        {/* Desktop 24h Grid (hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto pb-4">
          <div className="min-w-[1020px] px-1">
            {/* Hours Header */}
            <div className="flex mb-3">
              <div className="w-28 shrink-0 font-bold text-xs text-text-muted pr-2">Day / Time</div>
              <div className="grow grid grid-cols-24 gap-1.5">
                {HOURS.map((hour) => (
                  <div key={hour} className="text-left overflow-visible leading-none">
                    <span className="text-xs font-extrabold text-text-muted">{hour.slice(0, 2)}</span>
                    <span className="text-[9px] font-semibold text-text-muted/80">{hour.slice(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Days Rows */}
            <div className="space-y-2">
              {weekDates.map((date) => {
                const dayAbbrev = DAY_ABBREVS[date.getDay()];
                const dateStr = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
                const isToday = new Date().toDateString() === date.toDateString();

                return (
                  <div key={date.toISOString()} className="flex items-center">
                    {/* Day Column Header */}
                    <div className="w-28 shrink-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-extrabold ${isToday ? 'text-primary' : 'text-text'}`}>
                          {dayAbbrev}
                        </span>
                        <span className="text-[11px] font-semibold text-text-muted">({dateStr})</span>
                        {isToday && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" title="Today" />
                        )}
                      </div>
                    </div>

                    {/* 24 Hours Slots */}
                    <div className="grow grid grid-cols-24 gap-1.5">
                      {Array.from({ length: 24 }, (_, hourIndex) => {
                        const slotData = getBookingForSlot(date, hourIndex);
                        const isPast = isPastSlot(date, hourIndex);

                        if (slotData) {
                          const { booking, isStartHour } = slotData;
                          const isApproved = booking.status === 'APPROVED';

                          const slotStyle = isApproved
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-xs'
                            : 'bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-xs';

                          return (
                            <button
                              key={hourIndex}
                              type="button"
                              onClick={() => handleSlotClick(booking)}
                              className={`h-9 rounded-md transition-all flex items-center justify-center text-[10px] cursor-pointer active:scale-95 overflow-hidden px-1 ${slotStyle}`}
                              title={`${booking.eventName} (${booking.club?.clubName || 'Club'})\nStatus: ${booking.status}\nTime: ${new Date(booking.eventStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(booking.eventEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n\n👉 Click to view details & actions`}
                            >
                              {isStartHour && isApproved ? (
                                <span className="truncate text-[9px] font-black tracking-tight leading-none">
                                  ✓
                                </span>
                              ) : null}
                            </button>
                          );
                        }

                        // Available or Past Slot
                        return (
                          <div
                            key={hourIndex}
                            className={`h-9 rounded-md border transition-all ${
                              isPast
                                ? 'bg-black/5 border-black/5 opacity-40 cursor-not-allowed'
                                : 'bg-[#5476A520] border-[#5476A535] hover:bg-[#5476A535]'
                            }`}
                            title={
                              isPast
                                ? `${dayAbbrev} ${HOURS[hourIndex]} (Past hours)`
                                : `${dayAbbrev} ${HOURS[hourIndex]} (Available Slot)`
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile View: Vertical Days with 24h scroll */}
        <div className="block md:hidden">
          {/* Days Header */}
          <div className="flex items-center pb-2 border-b border-card-header/40 mb-2 sticky top-0 bg-[#fdf6ee] z-10 pt-1">
            <div className="w-12 shrink-0 text-left text-[11px] font-bold text-text-muted">Time</div>
            <div className="grow grid grid-cols-7 gap-1">
              {weekDates.map((date) => {
                const dayAbbrev = DAY_ABBREVS[date.getDay()];
                const dateStr = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
                const isToday = new Date().toDateString() === date.toDateString();

                return (
                  <div key={date.toISOString()} className="text-center">
                    <div className={`text-xs font-black ${isToday ? 'text-primary' : 'text-text'}`}>
                      {dayAbbrev}
                    </div>
                    <div className="text-[10px] font-semibold text-text-muted">{dateStr}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 24 Hours Rows */}
          <div className="max-h-[500px] overflow-y-auto space-y-1.5 pr-1">
            {HOURS.map((hour, hourIndex) => (
              <div key={hour} className="flex items-center">
                <div className="w-12 shrink-0 text-left leading-none">
                  <span className="text-xs font-bold text-text-muted">{hour.slice(0, 2)}</span>
                  <span className="text-[10px] font-semibold text-text-muted">{hour.slice(2)}</span>
                </div>
                <div className="grow grid grid-cols-7 gap-1">
                  {weekDates.map((date) => {
                    const slotData = getBookingForSlot(date, hourIndex);
                    const isPast = isPastSlot(date, hourIndex);

                    if (slotData) {
                      const { booking } = slotData;
                      const isApproved = booking.status === 'APPROVED';

                      const slotStyle = isApproved
                        ? 'bg-emerald-500 text-white font-bold'
                        : 'bg-amber-500 text-white font-bold';

                      return (
                        <button
                          key={date.toISOString()}
                          type="button"
                          onClick={() => handleSlotClick(booking)}
                          className={`h-8 rounded-md transition-all flex items-center justify-center text-[10px] cursor-pointer active:scale-95 ${slotStyle}`}
                        >
                          {isApproved ? '✓' : ''}
                        </button>
                      );
                    }

                    return (
                      <div
                        key={date.toISOString()}
                        className={`h-8 rounded-md border ${
                          isPast
                            ? 'bg-black/5 border-black/5 opacity-40'
                            : 'bg-[#5476A520] border-[#5476A535]'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-5 pt-4 border-t border-card-header/40 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-[#5476A520] border border-[#5476A535]" />
            <span className="font-semibold text-text-muted">Available Slot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-emerald-500" />
            <span className="font-semibold text-text">Approved Booking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-amber-500" />
            <span className="font-semibold text-text font-bold">Pending Booking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-black/10" />
            <span className="font-semibold text-text-muted">Past Hours</span>
          </div>
        </div>
      </div>

      {/* Interactive Booking Details Modal with Venue Handler Actions */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          showActions={
            (userRole === 'STAFF_IN_CHARGE' && selectedBooking.status === 'PENDING_STAFF') ||
            (userRole === 'FACULTY_IN_CHARGE' && selectedBooking.status === 'PENDING_FACULTY') ||
            (userRole === 'FACULTY_COORDINATOR' && selectedBooking.status === 'PENDING_COORDINATOR') ||
            (userRole === 'HOD' && selectedBooking.status === 'PENDING_HOD')
          }
          onAccept={() => handleBookingActionFromModal('approved')}
          onReject={() => handleBookingActionFromModal('rejected')}
        />
      )}

      {/* Action Error Alert */}
      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-bold">
          {actionError}
        </div>
      )}
    </div>
  );
}
