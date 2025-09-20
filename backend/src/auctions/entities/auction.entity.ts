import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Bid } from './bid.entity';

@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  giftId: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  highestBid: number;

  @Column()
  endTime: Date;

  @Column({ default: 'ACTIVE' })
  status: 'ACTIVE' | 'ENDED' | 'CANCELLED';

  @Column({ nullable: true })
  winnerId: string;

  @Column({ nullable: true })
  stellarEscrowAccount: string;

  @OneToMany(() => Bid, bid => bid.auction)
  bids: Bid[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
