import { Room } from '../../entities/room.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';

@Entity('eviction_logs')
@Index(['roomId'])
@Index(['creatorId'])
@Index(['evictedUserId'])
export class EvictionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomId: string;

  @ManyToOne(() => Room, room => room.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column()
  creatorId: string; // who initiated the eviction (room creator or moderator)

  @Column()
  evictedUserId: string;

  @Column({ type: 'text' })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;
}


