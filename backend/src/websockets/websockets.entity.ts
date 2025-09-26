import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: string;

  @Column()
  userId: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
