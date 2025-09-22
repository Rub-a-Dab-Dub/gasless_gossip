import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  LAUGH = 'laugh',
  WOW = 'wow',
  SAD = 'sad',
  ANGRY = 'angry',
}

@Entity('reactions')
@Unique(['messageId', 'userId']) // Prevent duplicate reactions from same user on same message
@Index(['messageId']) // Optimize queries by messageId
@Index(['userId']) // Optimize queries by userId
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  messageId!: string;

  @Column({
    type!: 'enum',
    enum!: ReactionType,
  })
  type: ReactionType;

  @Column('uuid')
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
