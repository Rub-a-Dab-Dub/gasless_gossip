import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';
@Entity('chain_events')
@Index(['chainId', 'blockNumber'])
@Index(['eventType', 'createdAt'])
export class ChainEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    eventId: string;

    @Column({ type: 'enum', enum: EventType })
    eventType: EventType;

    @Column()
    chainId: string;

    @Column({ type: 'jsonb' })
    payload: any;

    @Column({ nullable: true })
    txHash?: string;

    @Column({ type: 'bigint', nullable: true })
    blockNumber?: number;

    @Column({ default: 'pending' })
    status: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata?: any;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    processedAt?: Date;
}