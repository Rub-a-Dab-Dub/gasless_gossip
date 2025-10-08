import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Room } from './room.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  // Sender of the message
  @ManyToOne(() => User, (user) => user.sentMessages, { eager: true })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column()
  senderId: number;

  // Optional receiver (for direct messages)
  @ManyToOne(() => User, (user) => user.receivedMessages, { nullable: true })
  @JoinColumn({ name: 'receiverId' })
  receiver?: User;

  @Column({ nullable: true })
  receiverId?: number;

  // Room relation (for group messages)
  @ManyToOne(() => Room, (room) => room.messages, { nullable: true })
  @JoinColumn({ name: 'roomId' })
  room?: Room;

  @Column({ nullable: true })
  roomId?: number;

  @ManyToMany(() => User)
  @JoinTable()
  readBy: User[];
}
