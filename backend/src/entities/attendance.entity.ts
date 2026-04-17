import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, (employee) => employee.attendances, { eager: true })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: number;

  @Column()
  date: string;

  @Column({ nullable: true })
  clockIn: string;

  @Column({ nullable: true })
  clockOut: string;

  @Column({ nullable: true })
  hoursWorked: number;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;
}
