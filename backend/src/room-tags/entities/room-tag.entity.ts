import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';

@Entity('room_tags')
@Index(['roomId', 'tagName'], { unique: true }) // Prevent duplicate tags per room
export class RoomTag {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'room_id' })
  roomId!: string;

  @Column({ name: 'tag_name', length: 50 })
  tagName!: string;

  @Column({ name: 'created_by' })
  createdBy!: string; // User ID who created the tag

  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room!: Room;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}