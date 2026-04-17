export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  nationalId: string | null;
  hireDate: string;
  status: 'active' | 'on_leave' | 'resigned';
  salary: number;
  providentFundRate: number;
  socialSecurityEnabled: boolean;
  departmentId: number | null;
  positionId: number | null;
  shiftId: number | null;
  department?: Department;
  position?: Position;
  shift?: Shift;
}

export interface Department {
  id: number;
  name: string;
  description: string | null;
}

export interface Position {
  id: number;
  title: string;
  description: string | null;
  minSalary: number;
  maxSalary: number;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employee?: Employee;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface PayrollRecord {
  id: number;
  employeeId: number;
  employee?: Employee;
  month: number;
  year: number;
  baseSalary: number;
  bonus: number;
  otAmount: number;
  deductions: number;
  socialSecurity: number;
  providentFund: number;
  tax: number;
  netSalary: number;
  isPaid: boolean;
}

export interface OvertimeRecord {
  id: number;
  employeeId: number;
  employee?: Employee;
  date: string;
  hours: number;
  type: string;
  rate: number;
  amount: number;
  note: string | null;
  approved: boolean;
}

export interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  description: string | null;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  author: string;
  createdAt: string;
}

export interface Document {
  id: number;
  employeeId: number;
  employee?: Employee;
  title: string;
  type: string;
  description: string | null;
  fileName: string | null;
  createdAt: string;
}
