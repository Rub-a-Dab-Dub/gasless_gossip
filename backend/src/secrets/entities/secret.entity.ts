import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('secrets')
@Index(['roomId', 'reactionCount'])
export class Secret {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @Index()
  roomId!: string;

  @Column('text')
  contentHash!: string;

  @Column({ type: 'integer', default: 0 })
  reactionCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}