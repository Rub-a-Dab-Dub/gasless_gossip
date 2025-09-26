import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RoomMembership } from './room-membership.entity';

export enum RoomType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  INVITE_ONLY = 'invite_only',
}

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 100 })
  name!: string;

  @Column({ length: 500, nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: RoomType,
    default: RoomType.PUBLIC,
  })
  type!: RoomType;

  @Column({ name: 'max_members', default: 100 })
  maxMembers!: number;

  @Column({ name: 'created_by' })
  createdBy!: string; // User ID who created the room

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ name: 'min_level', default: 1 })
  minLevel!: number; // Minimum level required to join

  @Column({ name: 'min_xp', default: 0 })
  minXp!: number; // Minimum XP required to join

  @OneToMany(() => RoomMembership, (membership) => membership.room)
  memberships!: RoomMembership[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
