export type Role = 'club' | 'faculty_coordinator' | 'staff_in_charge' | 'faculty_in_charge' | 'hod' | 'admin';


export type PermissionRequest = {
  id: string;
  studentName: string;
  studentEmail: string;
  purpose: string;
  dateTime: string;
  venue: string;
  remarks?: string;
  attachments?: string[];
  initialReviewer?: string;
  status: 'pending' | 'approved' | 'rejected' | 'forwarded';
  currentHandler: string;
  forwardingHistory: ForwardingEvent[];
  approvalHistory: ApprovalEvent[];
  createdAt: string;
};

export type ForwardingEvent = {
  from: string;
  to: string;
  remarks: string;
  timestamp: string;
};

export type ApprovalEvent = {
  facultyName: string;
  action: 'approved' | 'rejected';
  remarks: string;
  timestamp: string;
};

export type Faculty = {
  id: string;
  name: string;
  email: string;
  department: string;
};

export type AuditLog = {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  remarks?: string;
  requestId?: string;
};

export type SystemConfig = {
  approvalMode: 'single' | 'consensus';
  requiredApprovals: number;
};

export type Venue = {
  id: string;
  name: string;
  type: 'lab' | 'hall' | 'classroom';
  location: string;
  capacity: number;
  staffIncharge: string;
  status: 'available' | 'unavailable';
};

export type Club = {
  id: string;
  name: string;
  secretary: string;
  contact: string;
  facultyCoordinator: string;
  status: 'available' | 'unavailable';
};

export type Person = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty_coordinator' | 'staff_incharge' | 'hod' | 'faculty_in_charge' | 'admin';
  status: 'available' | 'unavailable';
};

export type Booking = {
  id?: string;
  title: string;
  status: 'available' | 'unavailable' | 'approved' | 'pending' | 'rejected' | 'forwarded';
  venue: string;
  startDate: string;
  endDate?: string;
  bookingDate?: string;
  club?: string;
  subject?: string;
};


