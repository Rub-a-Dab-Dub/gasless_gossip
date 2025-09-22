import { User } from '../../users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

export enum ContentType {
  SECRET = 'secret',
  GIFT = 'gift',
  ACHIEVEMENT = 'achievement',
  NFT = 'nft',
  LEVEL_UP = 'level_up',
  BADGE = 'badge',
}

export enum Platform {
  TWITTER = 'twitter',
  X = 'x',
  FACEBOOK = 'facebook',
  LINKEDIN = 'linkedin',
  DISCORD = 'discord',
  TELEGRAM = 'telegram',
  REDDIT = 'reddit',
  OTHER = 'other',
}

@Entity('shares')
@Index(['userId', 'createdAt'])
@Index(['contentType', 'platform'])
export class Share {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({
    type: 'enum',
    enum: ContentType,
    name: 'content_type',
  })
  contentType!: ContentType;

  @Column({ name: 'content_id', type: 'uuid', nullable: true })
  contentId?: string;

  @Column({
    type: 'enum',
    enum: Platform,
  })
  platform!: Platform;

  @Column({ name: 'share_url', type: 'text', nullable: true })
  shareUrl?: string;

  @Column({ name: 'external_url', type: 'text', nullable: true })
  externalUrl?: string;

  @Column({ name: 'share_text', type: 'text', nullable: true })
  shareText?: string;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ name: 'xp_awarded', type: 'integer', default: 0 })
  xpAwarded!: number;

  @Column({ name: 'stellar_tx_id', type: 'varchar', length: 64, nullable: true })
  stellarTxId?: string;

  @Column({ name: 'is_successful', type: 'boolean', default: true })
  isSuccessful!: boolean;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
