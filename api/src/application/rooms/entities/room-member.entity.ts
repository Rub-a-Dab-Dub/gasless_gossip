import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { User } from '../../users/entities/user.entity';

@Entity('room_members')
@Unique(['user', 'room'])
export class RoomMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, (room) => room.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @ManyToOne(() => User, (user) => user.room_members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: 'member' })
  role: 'member' | 'admin' | 'owner' | 'moderator';

  @CreateDateColumn()
  joinedAt: Date;
}
