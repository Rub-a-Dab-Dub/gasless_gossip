import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum RankType {
  XP = 'xp',
  TIPS = 'tips',
  GIFTS = 'gifts',
}

@Entity('leaderboards')
@Index(['rankType', 'score'], { name: 'idx_leaderboard_type_score' })
export class Leaderboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RankType,
  })
  rankType: RankType;

  @Column('uuid')
  userId: string;

  @Column('bigint')
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

