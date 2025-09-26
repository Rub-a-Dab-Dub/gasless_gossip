import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('gifts')
export class Gift {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  type!: string; // e.g., 'badge', 'emoji', etc.

  @Index()
  @Column()
  ownerId!: string; // recipient userId

  @Column('jsonb')
  metadata!: any; // e.g., { emoji: "🎁", message: "Congrats!" }

  @Column({ nullable: true })
  txId?: string; // Stellar transaction hash

  @CreateDateColumn()
  createdAt!: Date;
}
