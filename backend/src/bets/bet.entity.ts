import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('bets')
export class Bet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  outcome!: string;

  @Column('decimal', { precision: 18, scale: 7 })
  stakes!: number;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'tx_id', nullable: true })
  txId!: string;

  @Column({ default: 'pending' })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
