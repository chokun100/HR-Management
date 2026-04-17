import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Announcement } from '../entities';

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  findAll(@Query('all') all?: string) {
    return this.announcementService.findAll(all !== 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.announcementService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Announcement>) {
    return this.announcementService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Announcement>) {
    return this.announcementService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.announcementService.remove(+id);
  }
}
