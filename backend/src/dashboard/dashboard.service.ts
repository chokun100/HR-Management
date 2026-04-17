import { Injectable } from '@nestjs/common';
import { EmployeesService } from '../employees/employees.service';
import { DepartmentsService } from '../departments/departments.service';
import { LeavesService } from '../leaves/leaves.service';
import { AttendanceService } from '../attendance/attendance.service';

@Injectable()
export class DashboardService {
  constructor(
    private employeesService: EmployeesService,
    private departmentsService: DepartmentsService,
    private leavesService: LeavesService,
    private attendanceService: AttendanceService,
  ) {}

  async getStats() {
    const totalEmployees = await this.employeesService.count();
    const employeeStatus = await this.employeesService.countByStatus();
    const totalDepartments = await this.departmentsService.count();
    const pendingLeaves = await this.leavesService.countPending();
    const todayAttendance = await this.attendanceService.todayCount();
    const departmentStats = await this.departmentsService.getDepartmentStats();

    return {
      totalEmployees,
      employeeStatus,
      totalDepartments,
      pendingLeaves,
      todayAttendance,
      departmentStats,
    };
  }
}
