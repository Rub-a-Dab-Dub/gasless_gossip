import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ChainListenerService } from 'chain-monitor/services/chain-listener.service';
import { EventProcessorService } from 'chain-monitor/services/event-processor.service';
import { RetryService } from 'chain-monitor/services/retry.service';
import { AlertService } from 'chain-monitor/services/alert.service';
import { AlertProcessor, ChainEventProcessor } from 'chain-monitor/processors/chain-event.processor';
import { ChainMonitorController } from 'chain-monitor/controllers/chain-monitor.controller';
import { ChainEvent } from 'chain-monitor/entities/chain-event.entity';
import { Alert } from 'chain-monitor/entities/alert-entity';
import { FailedEvent } from 'chain-monitor/entities/failed-event.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ChainEvent, Alert, FailedEvent]),
        BullModule.registerQueue(
            { name: 'chain-events' },
            { name: 'alerts' },
        ),
        HttpModule,
        ScheduleModule.forRoot(),
    ],
    controllers: [ChainMonitorController],
    providers: [
        ChainListenerService,
        EventProcessorService,
        RetryService,
        AlertService,
        ChainEventProcessor,
        AlertProcessor,
    ],
    exports: [EventProcessorService, ChainListenerService],
})
export class ChainMonitorModule { }
