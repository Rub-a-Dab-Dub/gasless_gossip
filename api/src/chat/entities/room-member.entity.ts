import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Room } from './room.entity';

@Entity('room_members')
@Unique(['user', 'room'])
export class RoomMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.roomMemberships, { eager: true })
  user: User;

  @ManyToOne(() => Room, (room) => room.members)
  room: Room;

  @CreateDateColumn()
  joinedAt: Date;
}
