import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('token_logs')
export class TokenLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  txId: string;

  @Column()
  fromId: string;

  @Column()
  toId: string;

  @Column('decimal', { precision: 18, scale: 8 })
  amount: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
