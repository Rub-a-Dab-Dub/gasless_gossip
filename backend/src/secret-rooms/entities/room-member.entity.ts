import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('room_members')
@Index(['roomId', 'userId'])
@Index(['roomId', 'role'])
@Index(['userId', 'status'])
@Index(['roomId', 'joinedAt'])
export class RoomMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  roomId!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ 
    type: 'enum', 
    enum: ['member', 'moderator', 'admin', 'owner'],
    default: 'member'
  })
  role!: 'member' | 'moderator' | 'admin' | 'owner';

  @Column({ 
    type: 'enum', 
    enum: ['active', 'inactive', 'banned', 'left'],
    default: 'active'
  })
  status!: 'active' | 'inactive' | 'banned' | 'left';

  @Column({ type: 'varchar', length: 50, nullable: true })
  nickname?: string; // Custom nickname in this room

  @Column({ type: 'varchar', length: 20, nullable: true })
  displayName?: string; // How they appear to others

  @Column({ type: 'boolean', default: false })
  isAnonymous!: boolean; // Whether they're participating anonymously

  @Column({ type: 'boolean', default: true })
  canInvite!: boolean; // Whether they can invite others

  @Column({ type: 'boolean', default: false })
  canModerate!: boolean; // Whether they can moderate content

  @Column({ type: 'int', default: 0 })
  messageCount!: number; // Number of messages sent

  @Column({ type: 'int', default: 0 })
  reactionCount!: number; // Number of reactions given

  @Column({ type: 'timestamptz', nullable: true })
  lastSeenAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastMessageAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  leftAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  bannedAt?: Date;

  @Column({ type: 'text', nullable: true })
  banReason?: string;

  @Column({ type: 'jsonb', nullable: true })
  permissions?: {
    canPost?: boolean;
    canReact?: boolean;
    canShare?: boolean;
    canDelete?: boolean;
    canEdit?: boolean;
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    joinSource?: string; // 'invitation', 'public', 'search'
    invitationId?: string;
    referrer?: string;
  };

  @CreateDateColumn()
  joinedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
