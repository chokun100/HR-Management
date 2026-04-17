import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Overtime } from '../entities';

@Controller('overtime')
@UseGuards(JwtAuthGuard)
export class OvertimeController {
  constructor(private readonly overtimeService: OvertimeService) {}

  @Get()
  findAll(@Query('month') month?: string) {
    return this.overtimeService.findAll(month);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.overtimeService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Overtime>) {
    return this.overtimeService.create(data);
  }

  @Put(':id/approve')
  approve(@Param('id') id: string) {
    return this.overtimeService.approve(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.overtimeService.remove(+id);
  }
}
