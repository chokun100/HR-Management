import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Department } from '../entities';

@Controller('departments')
@UseGuards(JwtAuthGuard)
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @Get()
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get('stats')
  stats() {
    return this.departmentsService.getDepartmentStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Department>) {
    return this.departmentsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Department>) {
    return this.departmentsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(+id);
  }
}
