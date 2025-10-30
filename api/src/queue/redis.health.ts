import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';

@Injectable()
export class RedisHealthService {
  private client: IORedis;

  constructor(private configService: ConfigService) {
    const url =
      this.configService.get<string>('REDIS_URL') ||
      `redis://${this.configService.get('REDIS_HOST')}:${this.configService.get('REDIS_PORT')}`;
    this.client = new IORedis(url);
  }

  async check() {
    try {
      await this.client.ping();
      return { status: 'up' };
    } catch (error) {
      return { status: 'down', error: error.message };
    }
  }
}
