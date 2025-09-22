import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm';

@Entity('auto_delete_timers')
export class AutoDelete {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_auto_delete_message_id', { unique: true })
  @Column({ type: 'uuid' })
  messageId!: string;

  @Column({ type: 'timestamptz' })
  expiry!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}


