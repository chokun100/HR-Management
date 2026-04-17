export interface IEmployee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  nationalId?: string;
  hireDate: string;
  status: string;
  salary: number;
  providentFundRate: number;
  socialSecurityEnabled: boolean;
  departmentId?: number;
  positionId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDepartment {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface IPosition {
  id: number;
  title: string;
  description?: string;
  minSalary: number;
  maxSalary: number;
  createdAt: Date;
}

export interface ILeave {
  id: number;
  employeeId: number;
  leaveType: 'sick' | 'vacation' | 'personal' | 'maternity' | 'other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface IPayroll {
  id: number;
  employeeId: number;
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
  createdAt: Date;
}

export interface IOvertime {
  id: number;
  employeeId: number;
  date: string;
  hours: number;
  type: string;
  rate: number;
  amount: number;
  note?: string;
  approved: boolean;
  createdAt: Date;
}

export interface IShift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  description?: string;
  isActive: boolean;
}

export interface IAnnouncement {
  id: number;
  title: string;
  content: string;
  priority: string;
  author: string;
  isActive: boolean;
  createdAt: Date;
}

export interface IDocument {
  id: number;
  employeeId: number;
  title: string;
  type: string;
  description?: string;
  fileName?: string;
  createdAt: Date;
}
