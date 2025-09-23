import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/entities/user.entity'; // Adjust import based on your User entity location

@Entity('tips')
export class Tip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 18, scale: 7 })
  amount: number;

  @Column({ name: 'receiver_id' })
  receiverId: string;

  @Column({ name: 'sender_id' })
  senderId: string;

  @Column({ name: 'tx_id', unique: true })
  txId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Optional: Add relations if you want to populate user data
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'receiver_id' })
  receiver?: User;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'sender_id' })
  sender?: User;
}
