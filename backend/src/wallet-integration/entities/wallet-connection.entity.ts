import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum WalletType {
  FREIGHTER = 'freighter',
  ALBEDO = 'albedo',
  RABET = 'rabet',
  LUMENS = 'lumens'
}

export enum ConnectionStatus {
  ACTIVE = 'active',
  DISCONNECTED = 'disconnected',
  PENDING = 'pending',
  FAILED = 'failed'
}

@Entity('wallet_connections')
@Index(['userId'])
@Index(['walletType'])
@Index(['address'])
@Index(['status'])
export class WalletConnection {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column({
    type: 'enum',
    enum: WalletType
  })
  walletType!: WalletType;

  @Column({ length: 56, unique: true })
  address!: string;

  @Column({
    type: 'enum',
    enum: ConnectionStatus,
    default: ConnectionStatus.ACTIVE
  })
  status!: ConnectionStatus;

  @Column({ length: 500, nullable: true })
  publicKey?: string;

  @Column({ length: 1000, nullable: true })
  signature?: string;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  lastUsedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
