import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Room } from '../rooms/entities/room.entity';

@Entity('participants')
@Unique(['roomId', 'pseudonym']) // ensure pseudonym uniqueness within a room
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  roomId: string;

  @Column()
  pseudonym: string;

  @ManyToOne(() => User, (user) => user.participants, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Room, (room) => room.participants, { onDelete: 'CASCADE' })
  room: Room;
}
