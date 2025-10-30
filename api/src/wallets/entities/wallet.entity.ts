import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.wallet, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  celo_address: string;

  @Column({ type: 'decimal', precision: 36, scale: 18, default: '0' })
  celo_balance: string;

  @Column({ nullable: true })
  base_address: string;

  @Column({ type: 'decimal', precision: 36, scale: 18, default: '0' })
  base_balance: string;

  @Column({ nullable: true })
  starknet_address: string;

  @Column({ type: 'decimal', precision: 36, scale: 18, default: '0' })
  starknet_balance: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
