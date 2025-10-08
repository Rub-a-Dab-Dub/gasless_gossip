import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AlertConfigDto } from 'chain-monitor/dto/alert-config.dto';
import { EventFilterDto } from 'chain-monitor/dto/filter.dto';
import { WebhookEventDto } from 'chain-monitor/dto/webhook-event.dto';
import { AlertService } from 'chain-monitor/services/alert.service';
import { EventProcessorService } from 'chain-monitor/services/event-processor.service';
import { RetryService } from 'chain-monitor/services/retry.service';

@Controller('chain-monitor')
@UseGuards(JwtAuthGuard, AdminGuard)
export class ChainMonitorController {
    constructor(
        private eventProcessor: EventProcessorService,
        private alertService: AlertService,
        private retryService: RetryService,
    ) { }

    // CREATE: Webhook receiver
    @Post('webhook')
    async receiveWebhook(@Body() eventDto: WebhookEventDto) {
        try {
            const event = await this.eventProcessor.processEvent(eventDto);
            return { success: true, eventId: event.id };
        } catch (error) {
            await this.retryService.saveFailedEvent(eventDto, error);
            throw error;
        }
    }

    // READ: Process events with filters
    @Get('events')
    async getEvents(
        @Query() filter: EventFilterDto,
        @Query('page') page = 1,
        @Query('limit') limit = 50,
    ) {
        return await this.eventProcessor.getEvents(filter, page, limit);
    }

    @Get('events/:id')
    async getEvent(@Param('id') id: string) {
        return await this.eventProcessor.eventRepository.findOne({ where: { id } });
    }

    // UPDATE: Alert dashboard
    @Get('alerts/dashboard')
    async getAlertDashboard() {
        return await this.alertService.getAlertDashboard();
    }

    @Post('alerts')
    async createAlert(@Body() dto: AlertConfigDto) {
        return await this.alertService.createAlert(dto);
    }

    @Put('alerts/:id')
    async updateAlert(@Param('id') id: string, @Body() dto: Partial<AlertConfigDto>) {
        await this.alertService.alertRepository.update(id, dto);
        return await this.alertService.alertRepository.findOne({ where: { id } });
    }

    @Delete('alerts/:id')
    async deleteAlert(@Param('id') id: string) {
        await this.alertService.alertRepository.delete(id);
        return { success: true };
    }

    // DELETE: Retry failed events
    @Post('retry/failed')
    async retryFailedEvents() {
        await this.retryService.retryFailed();
        return { success: true, message: 'Retry process initiated' };
    }

    @Get('retry/failed')
    async getFailedEvents() {
        return await this.retryService.failedEventRepository.find({
            order: { createdAt: 'DESC' },
            take: 50,
        });
    }

    @Delete('retry/failed/:id')
    async deleteFailedEvent(@Param('id') id: string) {
        await this.retryService.failedEventRepository.delete(id);
        return { success: true };
    }

    @Get('health')
    async getHealth() {
        // Health check endpoint for 99% uptime monitoring
        return {
            status: 'healthy',
            uptime: process.uptime(),
            timestamp: new Date(),
        };
    }
}