import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Position } from '../entities';

@Controller('positions')
@UseGuards(JwtAuthGuard)
export class PositionsController {
  constructor(private positionsService: PositionsService) {}

  @Get()
  findAll() {
    return this.positionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.positionsService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Position>) {
    return this.positionsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Position>) {
    return this.positionsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionsService.remove(+id);
  }
}
