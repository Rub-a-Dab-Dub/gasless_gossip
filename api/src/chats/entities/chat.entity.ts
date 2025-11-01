import { User } from '../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  Column,
  JoinColumn,
} from 'typeorm';
import { Message } from '../../messages/entities/message.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  receiverId: number;

  @Column()
  senderId: number;

  @ManyToOne(() => User, (user) => user.receivedChats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @ManyToOne(() => User, (user) => user.sentChats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({ default: false })
  isGroup: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
