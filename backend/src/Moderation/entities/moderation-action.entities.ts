import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ActionType {
  BAN = 'ban',
  KICK = 'kick',
  UNBAN = 'unban',
  MUTE = 'mute',
  UNMUTE = 'unmute',
  WARN = 'warn'
}

@Entity('moderation_actions')
export class ModerationAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  roomId: string;

  @Column('uuid')
  targetId: string;

  @Column('uuid')
  moderatorId: string;

  @Column({
    type: 'enum',
    enum: ActionType,
  })
  actionType: ActionType;

  @Column({ nullable: true })
  reason?: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

