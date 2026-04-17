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
