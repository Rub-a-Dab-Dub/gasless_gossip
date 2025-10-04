import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Participant } from './participant.entity';
import { Message } from './message.entity';
import { Transaction } from './transaction.entity';

export enum RoomType {
  SECRET = 'secret',
  DEGEN = 'degen',
  VOICE_DROP = 'voice_drop',
  GATED = 'gated'
}

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: RoomType })
  type: RoomType;

  @Column({ nullable: true })
  creatorId: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ type: 'int', default: 100 })
  maxParticipants: number;

  @Column({ nullable: true })
  theme: string;

  @Column({ type: 'json', nullable: true })
  accessRules: Record<string, any>;

  @Column({ type: 'simple-array', nullable: true })
  moderatorIds: string[];

  @Column({ type: 'text', nullable: true })
  pinnedMessageId: string;

  @Column({ default: false })
  isClosed: boolean;

  @Column({ type: 'int', default: 0 })
  activityLevel: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Participant, participant => participant.room, { cascade: true })
  participants: Participant[];

  @OneToMany(() => Message, message => message.room, { cascade: true })
  messages: Message[];

  @OneToMany(() => Transaction, transaction => transaction.room, { cascade: true })
  transactions: Transaction[];
}