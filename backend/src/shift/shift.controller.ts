import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Shift } from '../entities';

@Controller('shifts')
@UseGuards(JwtAuthGuard)
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Get()
  findAll() {
    return this.shiftService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shiftService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Shift>) {
    return this.shiftService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Shift>) {
    return this.shiftService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shiftService.remove(+id);
  }
}
