import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomId: string;

  @Column()
  userId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  autoDelete: boolean;

  @Column({ type: 'int', default: 0 })
  reactionCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Room, room => room.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Room;
}