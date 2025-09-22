import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

export enum EventType {
  XP_UPDATE = 'xp_update',
  TOKEN_SEND = 'token_send',
  TOKEN_RECEIVE = 'token_receive',
  CONTRACT_CALL = 'contract_call',
  ACCOUNT_CREATED = 'account_created'
}

@Entity('hooks')
@Index(['eventType', 'createdAt'])
export class Hook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EventType,
    nullable: false
  })
  eventType: EventType;

  @Column('jsonb')
  data: Record<string, any>;

  @Column({ nullable: true })
  stellarTransactionId?: string;

  @Column({ nullable: true })
  stellarAccountId?: string;

  @Column({ default: false })
  processed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  processedAt?: Date;

  @Column({ nullable: true })
  errorMessage?: string;
}