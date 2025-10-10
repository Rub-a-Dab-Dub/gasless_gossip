import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from './room.entity';

export enum RoomAuditAction {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired'
}

@Entity('room_audits')
export class RoomAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  roomId: string;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column()
  @Index()
  creatorId: string;

  @Column({ type: 'enum', enum: RoomAuditAction })
  action: RoomAuditAction;

  @Column({ type: 'json' })
  metadata: {
    roomType: string;
    settings: Record<string, any>;
    maxParticipants?: number;
    xpRequired?: number;
    reasonForAction?: string;
  };

  @Column({ type: 'text' })
  @Index({ fulltext: true })
  description: string;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  isAnomalous: boolean;

  @Column({ nullable: true })
  anomalyScore?: number;
}