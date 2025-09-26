import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('reaction_tracks')
@Index(['messageId']) // Index for faster queries
export class ReactionTrack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'message_id', type: 'uuid' })
  messageId: string;

  @Column({ name: 'total_count', type: 'integer', default: 0 })
  totalCount: number;

  @Column({ name: 'like_count', type: 'integer', default: 0 })
  likeCount: number;

  @Column({ name: 'love_count', type: 'integer', default: 0 })
  loveCount: number;

  @Column({ name: 'laugh_count', type: 'integer', default: 0 })
  laughCount: number;

  @Column({ name: 'angry_count', type: 'integer', default: 0 })
  angryCount: number;

  @Column({ name: 'sad_count', type: 'integer', default: 0 })
  sadCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}