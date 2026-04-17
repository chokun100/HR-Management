import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leave, LeaveStatus } from '../entities';

@Injectable()
export class LeavesService {
  constructor(
    @InjectRepository(Leave)
    private leaveRepository: Repository<Leave>,
  ) {}

  async findAll(status?: string) {
    const where: any = {};
    if (status) where.status = status;
    return this.leaveRepository.find({
      where,
      relations: ['employee'],
      order: { id: 'DESC' },
    });
  }

  async findByEmployee(employeeId: number) {
    return this.leaveRepository.find({
      where: { employeeId },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const leave = await this.leaveRepository.findOne({
      where: { id },
      relations: ['employee'],
    });
    if (!leave) throw new NotFoundException('Leave request not found');
    return leave;
  }

  async create(data: Partial<Leave>) {
    const leave = this.leaveRepository.create(data);
    return this.leaveRepository.save(leave);
  }

  async approve(id: number, approvedBy: string) {
    await this.findOne(id);
    await this.leaveRepository.update(id, {
      status: LeaveStatus.APPROVED,
      approvedBy,
    });
    return this.findOne(id);
  }

  async reject(id: number, approvedBy: string) {
    await this.findOne(id);
    await this.leaveRepository.update(id, {
      status: LeaveStatus.REJECTED,
      approvedBy,
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.leaveRepository.delete(id);
    return { message: 'Leave request deleted successfully' };
  }

  async countPending() {
    return this.leaveRepository.count({ where: { status: LeaveStatus.PENDING } });
  }
}
