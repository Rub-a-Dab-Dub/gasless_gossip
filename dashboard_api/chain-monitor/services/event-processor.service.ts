import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
@Injectable()
export class EventProcessorService {
    private readonly logger = new Logger(EventProcessorService.name);

    constructor(
        @InjectRepository(ChainEvent)
        private eventRepository: Repository<ChainEvent>,
        @InjectRepository(Alert)
        private alertRepository: Repository<Alert>,
        @InjectQueue('chain-events') private eventQueue: Queue,
        @InjectQueue('alerts') private alertQueue: Queue,
    ) { }

    async processEvent(eventDto: WebhookEventDto): Promise<ChainEvent> {
        // Save event to database
        const event = this.eventRepository.create({
            eventId: eventDto.eventId,
            eventType: eventDto.eventType,
            chainId: eventDto.chainId,
            payload: eventDto.payload,
            txHash: eventDto.payload.txHash,
            blockNumber: eventDto.payload.blockNumber,
            status: 'processing',
        });

        await this.eventRepository.save(event);

        // Check alerts
        await this.checkAlerts(event);

        // Update status
        event.status = 'processed';
        event.processedAt = new Date();
        await this.eventRepository.save(event);

        this.logger.log(`Processed event ${event.id}`);
        return event;
    }

    private async checkAlerts(event: ChainEvent) {
        const alerts = await this.alertRepository.find({
            where: {
                eventType: event.eventType,
                isActive: true,
            },
        });

        for (const alert of alerts) {
            if (this.matchesConditions(event, alert.conditions)) {
                await this.alertQueue.add('trigger-alert', {
                    alertId: alert.id,
                    eventId: event.id,
                    timestamp: Date.now(),
                });

                alert.triggerCount++;
                await this.alertRepository.save(alert);
            }
        }
    }

    private matchesConditions(event: ChainEvent, conditions: Record<string, any>): boolean {
        for (const [key, value] of Object.entries(conditions)) {
            const eventValue = this.getNestedValue(event.payload, key);

            if (typeof value === 'object' && value !== null) {
                // Handle operators like { $gt: 1000, $lt: 5000 }
                if (value.$gt !== undefined && eventValue <= value.$gt) return false;
                if (value.$lt !== undefined && eventValue >= value.$lt) return false;
                if (value.$eq !== undefined && eventValue !== value.$eq) return false;
            } else if (eventValue !== value) {
                return false;
            }
        }
        return true;
    }

    private getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((current, prop) => current?.[prop], obj);
    }

    async getEvents(filter: EventFilterDto, page = 1, limit = 50) {
        const query = this.eventRepository.createQueryBuilder('event');

        if (filter.eventType) {
            query.andWhere('event.eventType = :eventType', { eventType: filter.eventType });
        }

        if (filter.chainId) {
            query.andWhere('event.chainId = :chainId', { chainId: filter.chainId });
        }

        if (filter.fromBlock) {
            query.andWhere('event.blockNumber >= :fromBlock', { fromBlock: filter.fromBlock });
        }

        if (filter.toBlock) {
            query.andWhere('event.blockNumber <= :toBlock', { toBlock: filter.toBlock });
        }

        query.orderBy('event.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        const [events, total] = await query.getManyAndCount();

        return {
            events,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
}