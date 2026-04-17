import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('payrolls')
export class Payroll {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: number;

  @Column()
  month: number;

  @Column()
  year: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  baseSalary: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  bonus: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  otAmount: number; // เงินล่วงเวลา (โอที)

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  deductions: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  socialSecurity: number; // ประกันสังคม (Max 750 / 875)

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  providentFund: number; // กองทุนสำรองเลี้ยงชีพ

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  netSalary: number;

  @Column({ nullable: true })
  note: string;

  @Column({ default: false })
  isPaid: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
