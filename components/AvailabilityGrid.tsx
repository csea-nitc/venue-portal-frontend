'use client';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['24:00', ...Array.from({ length: 23 }, (_, i) => `${i + 1}:00`)];

// Mock status data for different venues
// 0 = off hours, 1 = available, 2 = occupied, 3 = your booking
const venueData: Record<string, Record<string, number[]>> = {
  'SSL Lab': {
    Mon: [0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Tue: [0, 0, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1],
    Wed: [0, 2, 1, 2, 2, 2, 1, 1, 3, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Thu: [0, 0, 2, 1, 1, 2, 1, 3, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Fri: [0, 0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Sat: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Sun: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  'NSL Lab': {
    Mon: [0, 0, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1],
    Tue: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1],
    Wed: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Thu: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Fri: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Sat: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Sun: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  'Seminar Hall': {
    Mon: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1],
    Tue: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Wed: [0, 0, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Thu: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Fri: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Sat: [0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Sun: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  'APJ Hall': {
    Mon: [0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Tue: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Wed: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Thu: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1],
    Fri: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Sat: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Sun: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  'Meeting Room': {
    Mon: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Tue: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Wed: [0, 0, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Thu: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Fri: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Sat: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Sun: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  'ELHC 402': {
    Mon: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Tue: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Wed: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Thu: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Fri: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Sat: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Sun: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  }
};

type AvailabilityGridProps = {
  selectedVenue?: string;
};

export function AvailabilityGrid({ selectedVenue = 'SSL Lab' }: AvailabilityGridProps) {
  const currentData = venueData[selectedVenue] || venueData['SSL Lab'];

  const getCellColor = (status: number) => {
    switch (status) {
      case 0: return 'bg-[#f4e9dc]'; // off hours
      case 1: return 'bg-[#8ea8c2]'; // available
      case 2: return 'bg-[#bd6e74]'; // occupied
      case 3: return 'bg-[#93a97a]'; // your booking
      default: return 'bg-[#8ea8c2]';
    }
  };

  return (
    <div className="bg-[#fdf6ee] rounded-3xl p-6 shadow-sm border border-[#e9ccbf]/40">
      <h2 className="text-xl font-bold text-[#8d6e63] mb-5">Venue availability - {selectedVenue}</h2>
      
      {/* Scrollable grid wrapper for mobile/tablet responsive layout */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[960px] px-1">
          {/* Hours header row */}
          <div className="flex mb-3">
            <div className="w-16 flex-shrink-0" />
            <div className="flex-grow grid grid-cols-[repeat(24,_minmax(0,_1fr))] gap-1.5">
              {HOURS.map((hour) => (
                <div key={hour} className="text-center text-xs font-semibold text-[#8d6e63]">
                  {hour}
                </div>
              ))}
            </div>
          </div>

          {/* Days rows */}
          <div className="space-y-2.5">
            {DAYS.map((day) => (
              <div key={day} className="flex items-center">
                <div className="w-16 flex-shrink-0 font-semibold text-base text-[#8d6e63]">
                  {day}
                </div>
                <div className="flex-grow grid grid-cols-[repeat(24,_minmax(0,_1fr))] gap-1.5">
                  {(currentData[day] || Array(24).fill(1)).map((status, index) => (
                    <div
                      key={index}
                      className={`h-8 rounded-lg border-0 transition-opacity hover:opacity-85 ${getCellColor(status)}`}
                      title={`${day} at ${HOURS[index]}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend inside the card */}
      <div className="flex flex-wrap gap-6 mt-6 pt-5 border-t border-[#e9ccbf]/40">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#8ea8c2]" />
          <span className="text-sm font-semibold text-[#8d6e63]">available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#bd6e74]" />
          <span className="text-sm font-semibold text-[#8d6e63]">occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#f4e9dc]" />
          <span className="text-sm font-semibold text-[#8d6e63]">off hours</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#93a97a]" />
          <span className="text-sm font-semibold text-[#8d6e63]">your booking</span>
        </div>
      </div>
    </div>
  );
}
