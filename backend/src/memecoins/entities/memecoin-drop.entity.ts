import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('memecoin_drops')
export class MemecoinDrop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { array: true })
  recipients: string[];

  @Column('decimal', { precision: 18, scale: 7 })
  amount: number;

  @Column({ name: 'tx_id', nullable: true })
  txId: string;

  @Column({ name: 'asset_code', default: 'MEME' })
  assetCode: string;

  @Column({ name: 'asset_issuer', nullable: true })
  assetIssuer: string;

  @Column({ name: 'drop_type', default: 'reward' })
  dropType: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'completed' | 'failed';

  @Column({ name: 'failure_reason', nullable: true })
  failureReason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
