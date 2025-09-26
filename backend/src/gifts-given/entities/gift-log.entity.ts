import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('gift_logs')
@Index(['userId', 'createdAt'])
@Index(['giftId'])
export class GiftLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  giftId: string;

  @Column('uuid')
  userId: string;

  @Column('uuid', { nullable: true })
  recipientId?: string;

  @Column('varchar', { length: 100, nullable: true })
  giftType?: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  giftValue?: number;

  @CreateDateColumn()
  createdAt: Date;
}