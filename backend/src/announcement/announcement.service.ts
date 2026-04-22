import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from '../entities';
import { N8nService } from '../n8n/n8n.service';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement) private announcementRepository: Repository<Announcement>,
    private n8nService: N8nService,
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

  async create(data: Partial<Announcement>) {
    const ann = this.announcementRepository.create(data);
    const saved = await this.announcementRepository.save(ann);
    
    // ส่ง Webhook ไปหา n8n เมื่อมีการประกาศเรื่องใหม่
    this.n8nService.triggerWorkflow('new_announcement', saved);
    
    return saved;
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
