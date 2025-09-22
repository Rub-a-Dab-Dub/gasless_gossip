import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('votes')
@Index(['proposalId', 'userId'], { unique: true }) // Prevent double voting
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  proposalId: string;

  @Column('uuid')
  userId: string;

  @Column('decimal', { precision: 18, scale: 8 })
  weight: number;

  @Column('varchar', { length: 20 })
  choice: string; // 'yes', 'no', 'abstain'

  @Column('varchar', { length: 128, nullable: true })
  stellarTransactionHash: string;

  @Column('varchar', { length: 56, nullable: true })
  stellarAccountId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}