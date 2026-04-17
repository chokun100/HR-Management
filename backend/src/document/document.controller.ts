import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DocumentService } from './document.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Document } from '../entities';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  findAll(@Query('employeeId') employeeId?: string) {
    return this.documentService.findAll(employeeId ? +employeeId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Document>) {
    return this.documentService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentService.remove(+id);
  }
}
