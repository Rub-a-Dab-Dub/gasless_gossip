import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('trades')
export class Trade {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  offerId!: string;

  @Column({ nullable: true })
  acceptorId!: string;

  @Column({ nullable: true })
  txId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
