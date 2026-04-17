import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from '../entities';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
  ) {}

  async findAll() {
    return this.positionRepository.find({
      relations: ['employees'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const position = await this.positionRepository.findOne({
      where: { id },
      relations: ['employees'],
    });
    if (!position) throw new NotFoundException('Position not found');
    return position;
  }

  async create(data: Partial<Position>) {
    const position = this.positionRepository.create(data);
    return this.positionRepository.save(position);
  }

  async update(id: number, data: Partial<Position>) {
    await this.findOne(id);
    await this.positionRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.positionRepository.delete(id);
    return { message: 'Position deleted successfully' };
  }

  async count() {
    return this.positionRepository.count();
  }
}
