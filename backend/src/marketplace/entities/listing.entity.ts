import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'gift_id' })
  giftId!: string;

  @Column('decimal', { precision: 18, scale: 7 })
  price!: number;

  @Column({ name: 'seller_id' })
  sellerId!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
