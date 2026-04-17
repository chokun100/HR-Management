import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from '../entities';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift) private shiftRepository: Repository<Shift>,
  ) {}

  findAll() {
    return this.shiftRepository.find({ order: { startTime: 'ASC' } });
  }

  async findOne(id: number) {
    const shift = await this.shiftRepository.findOne({ where: { id } });
    if (!shift) throw new NotFoundException('Shift not found');
    return shift;
  }

  create(data: Partial<Shift>) {
    const shift = this.shiftRepository.create(data);
    return this.shiftRepository.save(shift);
  }

  async update(id: number, data: Partial<Shift>) {
    await this.findOne(id);
    await this.shiftRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.shiftRepository.delete(id);
    return { message: 'Shift deleted' };
  }
}
