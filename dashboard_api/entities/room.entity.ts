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

export enum RoomStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  DELETED = 'deleted',
  SUSPENDED = 'suspended'
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

  // Enhanced Secret Room Fields
  @Column({ type: 'enum', enum: RoomStatus, default: RoomStatus.ACTIVE })
  status: RoomStatus;

  @Column({ default: false })
  enablePseudonyms: boolean;

  @Column({ nullable: true })
  fakeNameTheme: string;

  @Column({ type: 'float', default: 1.0 })
  xpMultiplier: number;

  @Column({ type: 'json', nullable: true })
  settings: {
    allowAnonymous?: boolean;
    autoDelete?: boolean;
    deleteAfterHours?: number;
    moderationLevel?: 'low' | 'medium' | 'high';
  };

  @Column({ type: 'json', nullable: true })
  moderationSettings: {
    creatorModPrivileges?: boolean;
    autoModeration?: boolean;
    voiceModerationQueue?: boolean;
    pseudonymDecryption?: boolean;
  };

  @Column({ type: 'json', nullable: true })
  reactionMetrics: {
    totalReactions?: number;
    topEmojis?: Record<string, number>;
    averageReactionsPerMessage?: number;
  };

  @Column({ nullable: true })
  roomCode: string;

  @Column({ type: 'timestamp', nullable: true })
  lastActivity: Date;

  @Column({ type: 'json', nullable: true })
  schedulerData: {
    nextCleanup?: Date;
    cleanupJobId?: string;
    processingStats?: Record<string, number>;
  };

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