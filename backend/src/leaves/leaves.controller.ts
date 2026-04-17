import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Leave } from '../entities';

@Controller('leaves')
@UseGuards(JwtAuthGuard)
export class LeavesController {
  constructor(private leavesService: LeavesService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    return this.leavesService.findAll(status);
  }

  @Get('pending-count')
  pendingCount() {
    return this.leavesService.countPending();
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.leavesService.findByEmployee(+employeeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leavesService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Leave>) {
    return this.leavesService.create(data);
  }

  @Put(':id/approve')
  approve(@Param('id') id: string, @Body() body: { approvedBy: string }) {
    return this.leavesService.approve(+id, body.approvedBy);
  }

  @Put(':id/reject')
  reject(@Param('id') id: string, @Body() body: { approvedBy: string }) {
    return this.leavesService.reject(+id, body.approvedBy);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leavesService.remove(+id);
  }
}
