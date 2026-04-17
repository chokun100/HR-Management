import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Overtime, Employee, OTType } from '../entities';

@Injectable()
export class OvertimeService {
  constructor(
    @InjectRepository(Overtime) private overtimeRepository: Repository<Overtime>,
    @InjectRepository(Employee) private employeeRepository: Repository<Employee>,
  ) {}

  async findAll(month?: string) {
    const query = this.overtimeRepository.createQueryBuilder('ot')
      .leftJoinAndSelect('ot.employee', 'employee')
      .orderBy('ot.date', 'DESC');
      
    if (month) {
      query.andWhere('ot.date LIKE :month', { month: `${month}%` });
    }
    
    return query.getMany();
  }

  async findOne(id: number) {
    const ot = await this.overtimeRepository.findOne({ where: { id }, relations: ['employee'] });
    if (!ot) throw new NotFoundException('OT record not found');
    return ot;
  }

  async create(data: Partial<Overtime>) {
    const employee = await this.employeeRepository.findOne({ where: { id: data.employeeId } });
    if (!employee) throw new NotFoundException('Employee not found');

    let rate = 1.5;
    if (data.type === OTType.REST_DAY || data.type === OTType.HOLIDAY) rate = 2.0;
    else if (data.type === OTType.REST_DAY_OT || data.type === OTType.HOLIDAY_OT) rate = 3.0;

    // Calculate hourly rate (Assume 30 days * 8 hours)
    const hourlyRate = Number(employee.salary) / (30 * 8);
    const amount = hourlyRate * rate * Number(data.hours);

    const ot = this.overtimeRepository.create({
      ...data,
      rate,
      amount,
    });
    return this.overtimeRepository.save(ot);
  }

  async approve(id: number) {
    await this.findOne(id);
    await this.overtimeRepository.update(id, { approved: true });
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.overtimeRepository.delete(id);
    return { message: 'OT record deleted' };
  }
}
