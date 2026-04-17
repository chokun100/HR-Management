import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AnnouncementPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'simple-enum', enum: AnnouncementPriority, default: AnnouncementPriority.NORMAL })
  priority: AnnouncementPriority;

  @Column()
  author: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  expiryDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
