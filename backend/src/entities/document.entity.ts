import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

export enum DocumentType {
  CONTRACT = 'contract',
  ID_CARD = 'id_card',
  CERTIFICATE = 'certificate',
  RESUME = 'resume',
  TAX_FORM = 'tax_form',
  OTHER = 'other',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: number;

  @Column()
  title: string;

  @Column({ type: 'simple-enum', enum: DocumentType, default: DocumentType.OTHER })
  type: DocumentType;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  fileName: string;

  @Column({ nullable: true })
  expiryDate: string;

  @CreateDateColumn()
  createdAt: Date;
}
