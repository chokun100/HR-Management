import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

export enum OTType {
  NORMAL = 'normal',         // วันปกติ OT 1.5x
  REST_DAY = 'rest_day',     // วันหยุด 2x
  REST_DAY_OT = 'rest_day_ot', // วันหยุด OT 3x
  HOLIDAY = 'holiday',       // นักขัตฤกษ์ 2x
  HOLIDAY_OT = 'holiday_ot', // นักขัตฤกษ์ OT 3x
}

@Entity('overtime')
export class Overtime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: number;

  @Column()
  date: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  hours: number;

  @Column({ type: 'simple-enum', enum: OTType, default: OTType.NORMAL })
  type: OTType;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  rate: number; // 1.5, 2, 3

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  amount: number;

  @Column({ nullable: true })
  note: string;

  @Column({ default: false })
  approved: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
