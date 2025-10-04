import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('secret_rooms')
@Index(['creatorId', 'createdAt'])
@Index(['isPrivate', 'createdAt'])
@Index(['status', 'createdAt'])
@Index(['roomCode', 'isActive'])
export class SecretRoom {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  creatorId!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  roomCode!: string; // Unique room code for joining

  @Column({ type: 'boolean', default: false })
  isPrivate!: boolean;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ 
    type: 'enum', 
    enum: ['active', 'inactive', 'archived', 'deleted'],
    default: 'active'
  })
  status!: 'active' | 'inactive' | 'archived' | 'deleted';

  @Column({ type: 'int', default: 50 })
  maxUsers!: number;

  @Column({ type: 'int', default: 0 })
  currentUsers!: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  category?: string; // e.g., 'gossip', 'discussion', 'support'

  @Column({ type: 'varchar', length: 20, nullable: true })
  theme?: string; // e.g., 'dark', 'light', 'colorful'

  @Column({ type: 'jsonb', nullable: true })
  settings?: {
    allowAnonymous?: boolean;
    requireApproval?: boolean;
    autoDelete?: boolean;
    deleteAfterHours?: number;
    allowFileSharing?: boolean;
    maxFileSize?: number;
    moderationLevel?: 'low' | 'medium' | 'high';
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    tags?: string[];
    location?: string;
    timezone?: string;
    language?: string;
    ageRestriction?: number;
  };

  @Column({ type: 'timestamptz', nullable: true })
  lastActivityAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  archivedAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  moderationSettings?: {
    creatorModPrivileges?: boolean;
    autoModeration?: boolean;
    voiceModerationQueue?: boolean;
    maxViolationsBeforeAutoDelete?: number;
    pseudonymDecryption?: boolean;
  };

  @Column({ type: 'jsonb', nullable: true })
  reactionMetrics?: {
    totalReactions?: number;
    mostReactedMessageId?: string;
    trendingScore?: number;
    lastTrendingUpdate?: Date;
  };

  @Column({ type: 'boolean', default: true })
  enablePseudonyms!: boolean;

  @Column({ type: 'varchar', length: 50, default: 'default' })
  fakeNameTheme!: string;

  @Column({ type: 'int', default: 0 })
  xpMultiplier!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
