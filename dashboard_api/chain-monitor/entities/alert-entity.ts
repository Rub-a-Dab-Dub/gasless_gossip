
import { EventType } from 'chain-monitor/interface';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('alerts')
export class Alert {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: EventType })
    eventType: EventType;

    @Column({ type: 'jsonb' })
    conditions: Record<string, any>;

    @Column({ nullable: true })
    webhookUrl?: string;

    @Column({ type: 'simple-array', nullable: true })
    channels?: string[];

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: 0 })
    triggerCount: number;

    @CreateDateColumn()
    createdAt: Date;
}