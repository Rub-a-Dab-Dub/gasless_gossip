import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hook } from './hook.entity';
import { WebSocketsGateway } from '../websockets/websockets.gateway';

@Injectable()
export class HooksService {
  private readonly logger = new Logger(HooksService.name);

  constructor(
    @InjectRepository(Hook)
    private readonly hookRepository: Repository<Hook>,
    private readonly webSocketsGateway: WebSocketsGateway,
  ) {}

  async processStellarEvent(eventType: string, data: unknown): Promise<Hook> {
    this.logger.log(`Processing stellar event: ${eventType}`);

    try {
      // Save the event to PostgreSQL
      const hook = this.hookRepository.create({ eventType, data });
      await this.hookRepository.save(hook);

      this.logger.log(`Successfully saved stellar event: ${eventType}`);

      // Push real-time update to clients via WebSocket gateway
      this.webSocketsGateway.server.emit('stellarEvent', { eventType, data });

      this.logger.log(
        `Emitted stellar event to WebSocket clients: ${eventType}`,
      );

      return hook;
    } catch (error) {
      this.logger.error(`Failed to process stellar event: ${eventType}`, error);
      throw error;
    }
  }
}
