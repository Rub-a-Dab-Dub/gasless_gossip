import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum MetricType {
  VISIT = 'visit',
  TIP = 'tip',
  REACTION = 'reaction',
  MESSAGE = 'message',
  ROOM_JOIN = 'room_join',
  ROOM_LEAVE = 'room_leave'
}

@Entity('analytics')
@Index(['userId', 'metricType'])
@Index(['roomId', 'metricType'])
@Index(['createdAt'])
export class Analytic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: MetricType,
    nullable: false
  })
  metricType: MetricType;

  @Column('uuid', { nullable: false })
  userId: string;

  @Column('uuid', { nullable: true })
  roomId?: string;

  @Column('decimal', { precision: 10, scale: 2, default: 1 })
  value: number;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}