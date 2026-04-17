import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { DepartmentsModule } from './departments/departments.module';
import { PositionsModule } from './positions/positions.module';
import { LeavesModule } from './leaves/leaves.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PayrollModule } from './payroll/payroll.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OvertimeModule } from './overtime/overtime.module';
import { ShiftModule } from './shift/shift.module';
import { DocumentModule } from './document/document.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { User, Employee, Department, Position, Leave, Attendance, Payroll, Overtime, Shift, Document, Announcement } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'hr-management.db',
      entities: [User, Employee, Department, Position, Leave, Attendance, Payroll, Overtime, Shift, Document, Announcement],
      synchronize: true,
    }),
    AuthModule,
    EmployeesModule,
    DepartmentsModule,
    PositionsModule,
    LeavesModule,
    AttendanceModule,
    PayrollModule,
    DashboardModule,
    OvertimeModule,
    ShiftModule,
    DocumentModule,
    AnnouncementModule,
  ],
})
export class AppModule {}
