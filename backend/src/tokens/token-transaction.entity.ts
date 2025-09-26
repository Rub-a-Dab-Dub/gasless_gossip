import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('token_transaction')
export class TokenTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 128 })
  fromId!: string;

  @Index()
  @Column({ type: 'varchar', length: 128 })
  toId!: string;

  @Column({ type: 'numeric', precision: 20, scale: 7 })
  amount!: string; // store as string to avoid JS float issues

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 128 })
  txId!: string; // Stellar transaction hash

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;
}
