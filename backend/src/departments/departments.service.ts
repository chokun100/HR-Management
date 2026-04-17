import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../entities';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async findAll() {
    return this.departmentRepository.find({
      relations: ['employees'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['employees'],
    });
    if (!department) throw new NotFoundException('Department not found');
    return department;
  }

  async create(data: Partial<Department>) {
    const department = this.departmentRepository.create(data);
    return this.departmentRepository.save(department);
  }

  async update(id: number, data: Partial<Department>) {
    await this.findOne(id);
    await this.departmentRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.departmentRepository.delete(id);
    return { message: 'Department deleted successfully' };
  }

  async count() {
    return this.departmentRepository.count();
  }

  async getDepartmentStats() {
    const departments = await this.departmentRepository.find({ relations: ['employees'] });
    return departments.map(d => ({
      name: d.name,
      employeeCount: d.employees ? d.employees.length : 0,
    }));
  }
}
