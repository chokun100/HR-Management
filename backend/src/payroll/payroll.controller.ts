import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private payrollService: PayrollService) {}

  @Get()
  findAll(@Query('month') month?: string, @Query('year') year?: string) {
    return this.payrollService.findAll(month ? +month : undefined, year ? +year : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payrollService.findOne(+id);
  }

  @Post()
  create(@Body() data: any) {
    return this.payrollService.create(data);
  }

  @Post('generate')
  generate(@Body() body: { month: number; year: number }) {
    return this.payrollService.generateMonthly(body.month, body.year);
  }

  @Put(':id/pay')
  markAsPaid(@Param('id') id: string) {
    return this.payrollService.markAsPaid(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payrollService.remove(+id);
  }
}
