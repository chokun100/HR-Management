import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async findAll(date?: string) {
    const where: any = {};
    if (date) where.date = date;
    return this.attendanceRepository.find({
      where,
      relations: ['employee'],
      order: { id: 'DESC' },
    });
  }

  async findByEmployee(employeeId: number) {
    return this.attendanceRepository.find({
      where: { employeeId },
      order: { date: 'DESC' },
    });
  }

  async clockIn(employeeId: number) {
    const today = new Date().toISOString().split('T')[0];
    const existing = await this.attendanceRepository.findOne({
      where: { employeeId, date: today },
    });

    if (existing) {
      throw new BadRequestException('Already clocked in today');
    }

    const now = new Date().toTimeString().split(' ')[0];
    const attendance = this.attendanceRepository.create({
      employeeId,
      date: today,
      clockIn: now,
    });
    return this.attendanceRepository.save(attendance);
  }

  async clockOut(employeeId: number) {
    const today = new Date().toISOString().split('T')[0];
    const attendance = await this.attendanceRepository.findOne({
      where: { employeeId, date: today },
    });

    if (!attendance) {
      throw new BadRequestException('No clock-in record found for today');
    }

    if (attendance.clockOut) {
      throw new BadRequestException('Already clocked out today');
    }

    const now = new Date().toTimeString().split(' ')[0];
    const clockInTime = new Date(`${today}T${attendance.clockIn}`);
    const clockOutTime = new Date(`${today}T${now}`);
    const hoursWorked = Math.round(((clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60)) * 100) / 100;

    await this.attendanceRepository.update(attendance.id, {
      clockOut: now,
      hoursWorked,
    });

    return this.attendanceRepository.findOne({ where: { id: attendance.id }, relations: ['employee'] });
  }

  async create(data: Partial<Attendance>) {
    const attendance = this.attendanceRepository.create(data);
    return this.attendanceRepository.save(attendance);
  }

  async todayCount() {
    const today = new Date().toISOString().split('T')[0];
    return this.attendanceRepository.count({ where: { date: today } });
  }

  async remove(id: number) {
    await this.attendanceRepository.delete(id);
    return { message: 'Attendance record deleted' };
  }
}
