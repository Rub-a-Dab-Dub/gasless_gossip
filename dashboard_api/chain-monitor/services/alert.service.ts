import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
@Injectable()
export class AlertService {
    private readonly logger = new Logger(AlertService.name);

    constructor(
        @InjectRepository(Alert)
        private alertRepository: Repository<Alert>,
        private httpService: HttpService,
    ) { }

    async createAlert(dto: AlertConfigDto): Promise<Alert> {
        const alert = this.alertRepository.create(dto);
        return await this.alertRepository.save(alert);
    }

    async triggerAlert(alertId: string, eventData: any) {
        const alert = await this.alertRepository.findOne({ where: { id: alertId } });

        if (!alert) return;

        // Send webhook if configured
        if (alert.webhookUrl) {
            try {
                await this.httpService.post(alert.webhookUrl, {
                    alert: alert.name,
                    event: eventData,
                    timestamp: new Date(),
                }).toPromise();
            } catch (error) {
                this.logger.error(`Failed to send webhook for alert ${alertId}:`, error);
            }
        }

        // Additional notification channels can be added here
        this.logger.log(`Alert triggered: ${alert.name}`);
    }

    async getAlertDashboard() {
        const alerts = await this.alertRepository.find({
            order: { triggerCount: 'DESC' },
        });

        return {
            totalAlerts: alerts.length,
            activeAlerts: alerts.filter(a => a.isActive).length,
            topTriggered: alerts.slice(0, 10),
            recentlyCreated: alerts.sort((a, b) =>
                b.createdAt.getTime() - a.createdAt.getTime()
            ).slice(0, 5),
        };
    }
}