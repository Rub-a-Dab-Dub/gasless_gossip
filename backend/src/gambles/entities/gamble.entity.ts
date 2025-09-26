// src/gambles/entities/gamble.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Gamble {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  gossipId: string;

  @Column('jsonb', { default: [] })
  bets: { userId: string; amount: number; choice: 'truth' | 'fake'; txId: string }[];

  @Column({ nullable: true })
  resolvedChoice: 'truth' | 'fake';

  @CreateDateColumn()
  createdAt: Date;
}
