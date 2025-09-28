import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Assuming the Anoma SDK will be available
// import { broadcastIntent } from '@anoma/intents';
import { BroadcastIntentDto } from './dto/broadcast-intent.dto';
import { IntentLog } from './entities/intent-log.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class IntentGossipService {
  private readonly logger = new Logger(IntentGossipService.name);

  constructor(
    @InjectRepository(IntentLog)
    private readonly intentLogRepository: Repository<IntentLog>,
  ) {}

  /**
   * Broadcasts an intent to the specified chains using the Anoma SDK
   * @param userId The ID of the user broadcasting the intent
   * @param broadcastIntentDto The intent data to broadcast
   */
  async broadcastIntent(userId: string, broadcastIntentDto: BroadcastIntentDto): Promise<void> {
    const { type, payload, chains } = broadcastIntentDto;

    try {
      // Log the intent before broadcasting
      this.logger.log(`Broadcasting intent of type ${type} to chains: ${chains.join(', ')}`);

      // In a real implementation, we would use the Anoma SDK:
      // await broadcastIntent({
      //   type,
      //   payload,
      //   chains,
      // });

      // For now, we'll simulate the broadcast with a delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

      // Save the broadcast event to the database
      const intentLog = this.intentLogRepository.create({
        type,
        payload,
        chains,
        user: { id: userId } as User,
      });

      await this.intentLogRepository.save(intentLog);

      this.logger.log(`Successfully broadcast intent ${type} and logged to database`);
    } catch (error: any) {
      this.logger.error(`Failed to broadcast intent: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves intent broadcast logs for a user
   * @param userId The ID of the user to retrieve logs for
   */
  async getIntentLogsByUser(userId: string): Promise<IntentLog[]> {
    return this.intentLogRepository.find({
      where: {
        user: { id: userId },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}