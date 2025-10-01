import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UptimeLog } from '../entities/uptime-log.entity';

@Injectable()
export class UptimeLoggerService {
  constructor(
    @InjectRepository(UptimeLog)
    private uptimeRepo: Repository<UptimeLog>
  ) {}

  // Run every 5 minutes
  @Cron('0 */5 * * * *')
  async logUptime() {
    await this.uptimeRepo.save(this.uptimeRepo.create({}));
  }
}
