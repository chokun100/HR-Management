import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { EmployeesModule } from '../employees/employees.module';
import { DepartmentsModule } from '../departments/departments.module';
import { LeavesModule } from '../leaves/leaves.module';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [EmployeesModule, DepartmentsModule, LeavesModule, AttendanceModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
