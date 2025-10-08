import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AnalyticsSnapshot } from './entities/analytics-snapshot.entity';
import { CreateSnapshotDto } from './dto/create-snapshot.dto';

@Injectable()
@WebSocketGateway({
  namespace: 'analytics',
  cors: {
    origin: '*',
  },
})
export class AnalyticsOverviewService {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(AnalyticsSnapshot)
    private snapshotRepository: Repository<AnalyticsSnapshot>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async generateSnapshot(): Promise<AnalyticsSnapshot> {
    const timestamp = new Date();
    const dau = await this.calculateDAU();
    const tokenVolume = await this.calculateTokenVolume();
    
    const snapshot = this.snapshotRepository.create({
      timestamp,
      metricType: 'health_check',
      metrics: {
        currentValue: dau.currentValue,
        previousValue: dau.previousValue,
        percentageChange: ((dau.currentValue - dau.previousValue) / dau.previousValue) * 100,
        historicalTrend: dau.trend,
        userLevelDistribution: dau.levelDistribution,
      },
      socialMetrics: {
        activeRooms: await this.getActiveRooms(),
        messagesSent: await this.getMessagesSent(),
        averageEngagement: await this.calculateEngagement(),
      },
      tokenMetrics: {
        dailyVolume: tokenVolume.volume,
        uniqueSenders: tokenVolume.senders,
        averageTransactionSize: tokenVolume.average,
      },
    });

    await this.snapshotRepository.save(snapshot);
    await this.cacheManager.set('latest_health_check', snapshot, { ttl: 60 }); // 60 seconds cache
    
    this.server.emit('analytics:update', {
      type: 'snapshot',
      data: snapshot,
    });

    return snapshot;
  }

  @Cron('*/30 * * * * *') // Run every 30 seconds
  async checkMetricsForAlerts(): Promise<void> {
    const latestMetrics = await this.getLatestMetrics();
    const alerts = await this.detectAnomalies(latestMetrics);
    
    if (alerts.length > 0) {
      this.server.emit('analytics:alert', {
        type: 'anomaly',
        alerts,
      });
    }
  }

  async getHealthCheck(): Promise<any> {
    // Try cache first
    const cached = await this.cacheManager.get('latest_health_check');
    if (cached) return cached;

    // Fall back to database
    const result = await this.snapshotRepository
      .createQueryBuilder('snapshot')
      .where('snapshot.metric_type = :type', { type: 'health_check' })
      .orderBy('snapshot.timestamp', 'DESC')
      .getOne();

    await this.cacheManager.set('latest_health_check', result, { ttl: 60 });
    return result;
  }

  async getTimeSeries(metricType: string, startTime: Date, endTime: Date): Promise<AnalyticsSnapshot[]> {
    return this.snapshotRepository
      .createQueryBuilder('snapshot')
      .where('snapshot.metric_type = :type', { type: metricType })
      .andWhere('snapshot.timestamp BETWEEN :start AND :end', { start: startTime, end: endTime })
      .orderBy('snapshot.timestamp', 'ASC')
      .cache(60000) // 1 minute cache
      .getMany();
  }

  async exportDashboard(format: 'csv' | 'json' = 'json'): Promise<string> {
    const data = await this.snapshotRepository
      .createQueryBuilder('snapshot')
      .orderBy('snapshot.timestamp', 'DESC')
      .limit(1000)
      .getMany();

    if (format === 'csv') {
      return this.convertToCSV(data);
    }
    return JSON.stringify(data, null, 2);
  }

  private async detectAnomalies(metrics: any): Promise<any[]> {
    // Implement anomaly detection logic
    const alerts = [];
    const threshold = 20; // 20% change threshold

    if (Math.abs(metrics.metrics.percentageChange) > threshold) {
      alerts.push({
        type: metrics.metrics.percentageChange > 0 ? 'spike' : 'drop',
        threshold,
        actualValue: metrics.metrics.percentageChange,
        description: `Unusual ${metrics.metricType} activity detected`,
      });
    }

    return alerts;
  }
}
}