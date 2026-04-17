import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Get()
  findAll(@Query('date') date?: string) {
    return this.attendanceService.findAll(date);
  }

  @Get('today-count')
  todayCount() {
    return this.attendanceService.todayCount();
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.attendanceService.findByEmployee(+employeeId);
  }

  @Post('clock-in')
  clockIn(@Body() body: { employeeId: number }) {
    return this.attendanceService.clockIn(body.employeeId);
  }

  @Post('clock-out')
  clockOut(@Body() body: { employeeId: number }) {
    return this.attendanceService.clockOut(body.employeeId);
  }

  @Post()
  create(@Body() data: any) {
    return this.attendanceService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(+id);
  }
}
