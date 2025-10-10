import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { RoomMember } from './room-member.entity';
import { Message } from './message.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 'public' })
  type: 'public' | 'paid';

  @Column({ default: 0 })
  fee: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => RoomMember, (member) => member.room)
  members: RoomMember[];

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];
}