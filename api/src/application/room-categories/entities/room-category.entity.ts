import {
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';

@Entity('room_categories')
export class RoomCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Room, (room) => room.room_category)
  rooms: Room[];
}
