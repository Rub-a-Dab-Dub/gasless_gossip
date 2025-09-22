import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  roomId!: string;

  @Column()
  contentHash!: string;

  @Column()
  senderId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
