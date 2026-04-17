import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document) private documentRepository: Repository<Document>,
  ) {}

  findAll(employeeId?: number) {
    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    return this.documentRepository.find({ where, relations: ['employee'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const doc = await this.documentRepository.findOne({ where: { id }, relations: ['employee'] });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  create(data: Partial<Document>) {
    const doc = this.documentRepository.create(data);
    return this.documentRepository.save(doc);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.documentRepository.delete(id);
    return { message: 'Document deleted' };
  }
}
