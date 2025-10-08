import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EventProcessorService } from 'chain-monitor/services/event-processor.service';
import { EventType } from 'chain-monitor/interface';
import { Logger } from '@nestjs/common';

@Processor('chain-events')
export class ChainEventProcessor {
    private readonly logger = new Logger(ChainEventProcessor.name);

    constructor(private eventProcessor: EventProcessorService) { }

    @Process('process-block')
    async handleBlock(job: Job) {
        const { chainId, blockNumber } = job.data;
        this.logger.log(`Processing block ${blockNumber} on chain ${chainId}`);
        // Process block logic here
    }

    @Process('process-log')
    async handleLog(job: Job) {
        const { chainId, log } = job.data;
        // Process log logic here
    }

    @Process('tx-confirmed')
    async handleTxConfirmed(job: Job) {
        const { chainId, txHash, receipt } = job.data;

        await this.eventProcessor.processEvent({
            eventId: `tx-${txHash}`,
            eventType: EventType.TX_CONFIRMED,
            chainId,
            payload: { txHash, receipt },
            timestamp: Date.now(),
        });
    }
}

@Processor('alerts')
export class AlertProcessor {
    private readonly logger = new Logger(AlertProcessor.name);

    constructor(private alertService: AlertService) { }

    @Process('trigger-alert')
    async handleAlert(job: Job) {
        const { alertId, eventId } = job.data;
        await this.alertService.triggerAlert(alertId, job.data);
    }
}