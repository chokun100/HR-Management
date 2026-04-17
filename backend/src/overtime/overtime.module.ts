import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OvertimeService } from './overtime.service';
import { OvertimeController } from './overtime.controller';
import { Overtime, Employee } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Overtime, Employee])],
  controllers: [OvertimeController],
  providers: [OvertimeService],
  exports: [OvertimeService],
})
export class OvertimeModule {}
