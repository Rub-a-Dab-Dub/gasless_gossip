import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';

export enum MembershipRole {
  MEMBER = 'member',
  ADMIN = 'admin',
  OWNER = 'owner',
}

@Entity('room_memberships')
export class RoomMembership {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'room_id' })
  roomId!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({
    type: 'enum',
    enum: MembershipRole,
    default: MembershipRole.MEMBER,
  })
  role!: MembershipRole;

  @Column({ name: 'invited_by', nullable: true })
  invitedBy?: string; // User ID who invited this member

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @ManyToOne(() => Room, room => room.memberships)
  @JoinColumn({ name: 'room_id' })
  room!: Room;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt!: Date;
}