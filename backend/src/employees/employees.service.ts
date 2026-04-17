import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Employee } from '../entities';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async findAll(search?: string) {
    if (search) {
      return this.employeeRepository.find({
        where: [
          { firstName: Like(`%${search}%`) },
          { lastName: Like(`%${search}%`) },
          { employeeCode: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
        ],
        relations: ['department', 'position', 'shift'],
        order: { id: 'DESC' },
      });
    }
    return this.employeeRepository.find({
      relations: ['department', 'position', 'shift'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['department', 'position', 'shift'],
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async create(data: Partial<Employee>) {
    const employee = this.employeeRepository.create(data);
    return this.employeeRepository.save(employee);
  }

  async update(id: number, data: Partial<Employee>) {
    await this.findOne(id);
    await this.employeeRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.employeeRepository.delete(id);
    return { message: 'Employee deleted successfully' };
  }

  async count() {
    return this.employeeRepository.count();
  }

  async countByStatus() {
    const active = await this.employeeRepository.count({ where: { status: 'active' as any } });
    const onLeave = await this.employeeRepository.count({ where: { status: 'on_leave' as any } });
    const resigned = await this.employeeRepository.count({ where: { status: 'resigned' as any } });
    return { active, onLeave, resigned };
  }
}
