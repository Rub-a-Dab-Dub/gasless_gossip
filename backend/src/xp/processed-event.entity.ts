import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('processed_event')
export class ProcessedEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  eventId!: string;

  @Column({ nullable: true })
  source?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
