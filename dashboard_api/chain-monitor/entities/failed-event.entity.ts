import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';


@Entity('failed_events')
export class FailedEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    eventId: string;

    @Column({ type: 'jsonb' })
    eventData: any;

    @Column({ type: 'text' })
    error: string;

    @Column({ default: 0 })
    retryCount: number;

    @Column({ default: 3 })
    maxRetries: number;

    @Column({ type: 'timestamp', nullable: true })
    nextRetryAt?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastRetryAt?: Date;
}
