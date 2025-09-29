import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('chat_messages')
@Index(['roomId', 'createdAt']) // Composite index for room queries with time ordering
@Index(['senderId', 'createdAt']) // Index for user message history
@Index(['roomId']) // Single column index for room filtering
@Index(['senderId']) // Single column index for sender filtering
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  roomId!: string;

  @Column({ type: 'uuid' })
  senderId!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  messageType?: string; // 'text', 'image', 'file', etc.

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>; // For reactions, mentions, etc.

  @CreateDateColumn()
  createdAt!: Date;
}
