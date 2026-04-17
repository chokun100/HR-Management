import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from '../entities';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement) private announcementRepository: Repository<Announcement>,
  ) {}

  findAll(activeOnly = true) {
    const query = this.announcementRepository.createQueryBuilder('announcement').orderBy('createdAt', 'DESC');
    if (activeOnly) {
      query.where('isActive = :active', { active: true });
    }
    return query.getMany();
  }

  async findOne(id: number) {
    const ann = await this.announcementRepository.findOne({ where: { id } });
    if (!ann) throw new NotFoundException('Announcement not found');
    return ann;
  }

  create(data: Partial<Announcement>) {
    const ann = this.announcementRepository.create(data);
    return this.announcementRepository.save(ann);
  }

  async update(id: number, data: Partial<Announcement>) {
    await this.findOne(id);
    await this.announcementRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.announcementRepository.delete(id);
    return { message: 'Announcement deleted' };
  }
}
