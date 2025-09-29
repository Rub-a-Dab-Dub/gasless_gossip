import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('room_invitations')
@Index(['roomId', 'createdAt'])
@Index(['invitedUserId', 'status'])
@Index(['invitedBy', 'createdAt'])
@Index(['invitationCode', 'status'])
export class RoomInvitation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  roomId!: string;

  @Column({ type: 'uuid' })
  invitedBy!: string; // User who sent the invitation

  @Column({ type: 'uuid', nullable: true })
  invitedUserId?: string; // User being invited (if registered)

  @Column({ type: 'varchar', length: 255, nullable: true })
  invitedEmail?: string; // Email of invited user

  @Column({ type: 'varchar', length: 100, unique: true })
  invitationCode!: string; // Unique invitation code

  @Column({ 
    type: 'enum', 
    enum: ['pending', 'accepted', 'declined', 'expired', 'revoked'],
    default: 'pending'
  })
  status!: 'pending' | 'accepted' | 'declined' | 'expired' | 'revoked';

  @Column({ type: 'text', nullable: true })
  message?: string; // Personal message with invitation

  @Column({ type: 'varchar', length: 20, nullable: true })
  role?: string; // 'member', 'moderator', 'admin'

  @Column({ type: 'int', default: 7 })
  expiresInDays!: number; // Days until invitation expires

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  acceptedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  declinedAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    source?: string; // 'email', 'link', 'qr_code'
    campaign?: string;
    referrer?: string;
  };

  @CreateDateColumn()
  createdAt!: Date;
}
