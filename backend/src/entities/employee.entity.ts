import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Department } from './department.entity';
import { Position } from './position.entity';
import { Leave } from './leave.entity';
import { Attendance } from './attendance.entity';
import { Shift } from './shift.entity';

export enum EmployeeStatus {
  ACTIVE = 'active',
  ON_LEAVE = 'on_leave',
  RESIGNED = 'resigned',
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeCode: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  dateOfBirth: string;

  @Column()
  hireDate: string;

  @Column({ type: 'simple-enum', enum: EmployeeStatus, default: EmployeeStatus.ACTIVE })
  status: EmployeeStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  salary: number;

  @Column({ nullable: true })
  avatar: string;

  // Thai-specific fields
  @Column({ nullable: true })
  nationalId: string; // เลขบัตรประชาชน 13 หลัก

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 0 })
  providentFundRate: number; // กองทุนสำรองเลี้ยงชีพ (% ของเงินเดือน)

  @Column({ default: true })
  socialSecurityEnabled: boolean; // สมทบประกันสังคม

  @Column({ nullable: true })
  bankAccount: string;

  @Column({ nullable: true })
  bankName: string;

  @ManyToOne(() => Shift, { nullable: true, eager: true })
  @JoinColumn({ name: 'shiftId' })
  shift: Shift;

  @Column({ nullable: true })
  shiftId: number;

  // Leave balances (วันลาคงเหลือ)
  @Column({ type: 'decimal', precision: 5, scale: 1, default: 6 })
  sickLeaveBalance: number; // ลาป่วย 30 วัน (ได้รับค่าจ้าง)

  @Column({ type: 'decimal', precision: 5, scale: 1, default: 6 })
  vacationLeaveBalance: number; // ลาพักร้อน

  @Column({ type: 'decimal', precision: 5, scale: 1, default: 3 })
  personalLeaveBalance: number; // ลากิจ

  @ManyToOne(() => Department, (department) => department.employees, { nullable: true, eager: true })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ nullable: true })
  departmentId: number;

  @ManyToOne(() => Position, (position) => position.employees, { nullable: true, eager: true })
  @JoinColumn({ name: 'positionId' })
  position: Position;

  @Column({ nullable: true })
  positionId: number;

  @OneToMany(() => Leave, (leave) => leave.employee)
  leaves: Leave[];

  @OneToMany(() => Attendance, (attendance) => attendance.employee)
  attendances: Attendance[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
