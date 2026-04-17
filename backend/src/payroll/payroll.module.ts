import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { Payroll, Employee, Overtime } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Payroll, Employee, Overtime])],
  controllers: [PayrollController],
  providers: [PayrollService],
  exports: [PayrollService],
})
export class PayrollModule {}
