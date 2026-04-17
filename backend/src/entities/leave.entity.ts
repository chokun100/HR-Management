import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

export enum LeaveType {
  SICK = 'sick',
  VACATION = 'vacation',
  PERSONAL = 'personal',
  MATERNITY = 'maternity',
  OTHER = 'other',
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('leaves')
export class Leave {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, (employee) => employee.leaves, { eager: true })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: number;

  @Column({ type: 'simple-enum', enum: LeaveType })
  type: LeaveType;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column({ nullable: true })
  reason: string;

  @Column({ type: 'simple-enum', enum: LeaveStatus, default: LeaveStatus.PENDING })
  status: LeaveStatus;

  @Column({ nullable: true })
  approvedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
