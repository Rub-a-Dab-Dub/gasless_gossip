import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Auction } from './auction.entity';

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  auctionId: string;

  @Column()
  bidderId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  stellarTransactionId: string;

  @ManyToOne(() => Auction, (auction) => auction.bids)
  auction: Auction;

  @CreateDateColumn()
  createdAt: Date;
}
