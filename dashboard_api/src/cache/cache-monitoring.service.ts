import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CacheMonitoringService {
  private readonly logger = new Logger(CacheMonitoringService.name);
  private hits = 0;
  private misses = 0;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  recordHit(): void {
    this.hits++;
  }

  recordMiss(): void {
    this.misses++;
  }

  getHitRate(): number {
    const total = this.hits + this.misses;
    return total === 0 ? 0 : (this.hits / total) * 100;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async logCacheMetrics(): Promise<void> {
    const hitRate = this.getHitRate();
    this.logger.log(`Cache Hit Rate: ${hitRate.toFixed(2)}%`);
    this.logger.log(`Total Hits: ${this.hits}, Total Misses: ${this.misses}`);
    
    // Alert if hit rate is below 80%
    if (hitRate < 80 && this.hits + this.misses > 100) {
      this.logger.warn(`Cache hit rate below 80%: ${hitRate.toFixed(2)}%`);
    }
    
    // Reset counters
    this.hits = 0;
    this.misses = 0;
  }
}
