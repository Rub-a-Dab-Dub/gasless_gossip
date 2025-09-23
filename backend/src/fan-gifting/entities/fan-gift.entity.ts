import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('fan_gifts')
@Index(['fanId', 'creatorId'])
@Index(['creatorId'])
@Index(['txId'], { unique: true })
export class FanGift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  giftId: string;

  @Column({ type: 'uuid' })
  fanId: string;

  @Column({ type: 'uuid' })
  creatorId: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  txId: string;

  @Column({ type: 'varchar', length: 100 })
  giftType: string;

  @Column({ type: 'decimal', precision: 18, scale: 7, default: 0 })
  amount: string;

  @Column({ type: 'varchar', length: 56 })
  stellarAsset: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'enum', enum: ['pending', 'completed', 'failed'], default: 'pending' })
  status: 'pending' | 'completed' | 'failed';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
