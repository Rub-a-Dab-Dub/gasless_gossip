import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('pump_rooms')
export class PumpRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  roomId: string;

  @Column('jsonb')
  predictions: Record<string, any>[];

  @Column('jsonb', { default: {} })
  votes: Record<string, any>;

  @Column({ default: 0 })
  totalVotes: number;

  @Column({ default: true })
  isActive: boolean;

  @Column('timestamp', { nullable: true })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}