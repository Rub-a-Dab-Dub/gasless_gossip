import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
@Injectable()
export class RetryService {
    private readonly logger = new Logger(RetryService.name);

    constructor(
        @InjectRepository(FailedEvent)
        private failedEventRepository: Repository<FailedEvent>,
        private eventProcessor: EventProcessorService,
    ) { }

    async saveFailedEvent(eventData: any, error: Error) {
        const failed = this.failedEventRepository.create({
            eventId: eventData.eventId,
            eventData,
            error: error.message,
            retryCount: 0,
            nextRetryAt: new Date(Date.now() + 60000), // Retry in 1 minute
        });

        await this.failedEventRepository.save(failed);
    }

    async retryFailed() {
        const failedEvents = await this.failedEventRepository.find({
            where: {
                nextRetryAt: LessThan(new Date()),
            },
            take: 10,
        });

        for (const failed of failedEvents) {
            try {
                await this.eventProcessor.processEvent(failed.eventData);
                await this.failedEventRepository.delete(failed.id);
                this.logger.log(`Successfully retried event ${failed.eventId}`);
            } catch (error) {
                failed.retryCount++;
                failed.lastRetryAt = new Date();

                if (failed.retryCount >= failed.maxRetries) {
                    this.logger.error(`Max retries reached for event ${failed.eventId}`);
                    // Could move to dead letter queue or alert admin
                } else {
                    // Exponential backoff
                    const delay = Math.min(60000 * Math.pow(2, failed.retryCount), 3600000);
                    failed.nextRetryAt = new Date(Date.now() + delay);
                    await this.failedEventRepository.save(failed);
                }
            }
        }
    }
}