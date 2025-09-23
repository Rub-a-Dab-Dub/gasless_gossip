import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('bans')
@Index(['userId'])
@Index(['isActive'])
export class Ban {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('text')
  reason: string;

  @Column('uuid', { nullable: true })
  bannedBy: string; // Admin/Moderator who issued the ban

  @Column('timestamp', { nullable: true })
  expiresAt: Date; // null for permanent bans

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}