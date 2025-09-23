import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReputationService {
  private readonly logger = new Logger(ReputationService.name);
  private readonly MIN_REPUTATION = -1000;
  private readonly MAX_REPUTATION = 10000;

  constructor(
    @InjectRepository(UserProfile)
    private userRepository: Repository<UserProfile>,
    @InjectRepository(ReputationHistoryEntity)
    private reputationHistoryRepository: Repository<ReputationHistoryEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  async addReputation(
    user: Address,
    amount: number,
    reason: ReputationReason,
    description?: string
  ): Promise<UserProfile> {
    // Validate user exists
    const userProfile = await this.userRepository.findOne({
      where: { address: user }
    });

    if (!userProfile) {
      throw new UserNotFoundException(user);
    }

    const oldReputation = Number(userProfile.reputation);
    const newReputation = oldReputation + amount;

    // Validate reputation bounds
    if (newReputation < this.MIN_REPUTATION) {
      throw new ReputationUnderflowException(oldReputation, amount, this.MIN_REPUTATION);
    }

    if (newReputation > this.MAX_REPUTATION) {
      throw new ReputationOverflowException(oldReputation, amount, this.MAX_REPUTATION);
    }

    // Update user reputation
    userProfile.reputation = newReputation;
    const updatedUser = await this.userRepository.save(userProfile);

    // Log reputation history
    await this.logReputationHistory(user, amount, reason, description);

    // Emit event
    this.eventEmitter.emit('reputation.changed', 
      new ReputationChangedEvent(user, oldReputation, newReputation, amount, reason, description)
    );

    this.logger.log(`Reputation updated for user ${user}: ${oldReputation} -> ${newReputation} (${amount > 0 ? '+' : ''}${amount})`);

    return updatedUser;
  }

  async getUserReputation(user: Address): Promise<number> {
    const userProfile = await this.userRepository.findOne({
      where: { address: user },
      select: ['reputation']
    });

    return userProfile ? Number(userProfile.reputation) : 0;
  }

  async getReputationHistory(
    user: Address,
    limit: number = 50,
    offset: number = 0
  ): Promise<ReputationHistory[]> {
    const history = await this.reputationHistoryRepository.find({
      where: { userId: user },
      order: { timestamp: 'DESC' },
      take: limit,
      skip: offset
    });

    return history.map(h => ({
      id: h.id,
      userId: h.userId,
      amount: Number(h.amount),
      reason: h.reason,
      description: h.description,
      timestamp: h.timestamp
    }));
  }

  async canCreateRoom(user: Address): Promise<boolean> {
    const reputation = await this.getUserReputation(user);
    return reputation >= 100; // Minimum reputation required to create rooms
  }

  async getVisibilityBoost(user: Address): Promise<number> {
    const reputation = await this.getUserReputation(user);
    if (reputation >= 1000) return 3;
    if (reputation >= 500) return 2;
    if (reputation >= 100) return 1;
    return 0;
  }

  private async logReputationHistory(
    userId: Address,
    amount: number,
    reason: ReputationReason,
    description?: string
  ): Promise<void> {
    const historyEntry = this.reputationHistoryRepository.create({
      id: uuidv4(),
      userId,
      amount,
      reason,
      description,
      timestamp: new Date()
    });

    await this.reputationHistoryRepository.save(historyEntry);
  }

  // Auto-reputation methods for integration
  async addPositiveContribution(user: Address, description?: string): Promise<UserProfile> {
    return this.addReputation(user, 10, ReputationReason.PositiveContribution, description);
  }

  async addHelpfulAnswer(user: Address, description?: string): Promise<UserProfile> {
    return this.addReputation(user, 15, ReputationReason.HelpfulAnswer, description);
  }

  async penalizeSpam(user: Address, description?: string): Promise<UserProfile> {
    return this.addReputation(user, -25, ReputationReason.SpamPenalty, description);
  }

  async penalizeInappropriateContent(user: Address, description?: string): Promise<UserProfile> {
    return this.addReputation(user, -50, ReputationReason.InappropriateContent, description);
  }
}
