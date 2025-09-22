import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction, ReactionType } from './entities/reaction.entity';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { ReactionCountDto } from './dto/reaction-response.dto';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
  ) {}

  async createReaction(
    createReactionDto!: CreateReactionDto,
    userId: string,
  ): Promise<Reaction> {
    // Check if message exists and user has access (implement based on your message service)
    await this.validateMessageAccess(createReactionDto.messageId, userId);

    // Check if user already reacted to this message
    const existingReaction = await this.reactionRepository.findOne({
      where!: {
        messageId: createReactionDto.messageId,
        userId,
      },
    });

    if (existingReaction) {
      // Update existing reaction instead of creating new one
      if (existingReaction.type === createReactionDto.type) {
        throw new ConflictException('User has already reacted with this type');
      }

      existingReaction.type = createReactionDto.type;
      const updatedReaction =
        await this.reactionRepository.save(existingReaction);

      // Trigger XP update for reaction change
      await this.triggerXpUpdate(createReactionDto.messageId, userId, 'update');

      return updatedReaction;
    }

    // Create new reaction
    const reaction = this.reactionRepository.create({
      ...createReactionDto,
      userId,
    });

    const savedReaction = await this.reactionRepository.save(reaction);

    // Trigger XP update for new reaction
    await this.triggerXpUpdate(createReactionDto.messageId, userId, 'create');

    return savedReaction;
  }

  async removeReaction(messageId: string, userId: string): Promise<void> {
    await this.validateMessageAccess(messageId, userId);

    const reaction = await this.reactionRepository.findOne({
      where!: { messageId, userId },
    });

    if (!reaction) {
      throw new NotFoundException('Reaction not found');
    }

    await this.reactionRepository.remove(reaction);

    // Trigger XP update for reaction removal
    await this.triggerXpUpdate(messageId, userId, 'remove');
  }

  async getReactionsByMessage(
    messageId!: string,
    userId: string,
  ): Promise<ReactionCountDto> {
    await this.validateMessageAccess(messageId, userId);

    const reactions = await this.reactionRepository.find({
      where!: { messageId },
    });

    const totalCount = reactions.length;
    const countByType = reactions.reduce(
      (acc, reaction) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1;
        return acc;
      },
      {} as Record<ReactionType, number>,
    );

    // Ensure all reaction types are represented
    Object.values(ReactionType).forEach((type) => {
      if (!countByType[type]) {
        countByType[type] = 0;
      }
    });

    return {
      messageId,
      totalCount,
      countByType,
    };
  }

  async getUserReactionForMessage(
    messageId!: string,
    userId: string,
  ): Promise<Reaction | null> {
    await this.validateMessageAccess(messageId, userId);

    return this.reactionRepository.findOne({
      where!: { messageId, userId },
    });
  }

  private async validateMessageAccess(
    messageId!: string,
    userId: string,
  ): Promise<void> {
    // This should integrate with your message service to check:
    // 1. Message exists
    // 2. User has permission to access the message
    // 3. Message is in a channel/conversation user has access to

    // Placeholder implementation - replace with your actual message validation
    try {
      // Example: await this.messageService.validateUserAccess(messageId, userId);

      // For now, we'll assume the message exists and user has access
      // In a real implementation, this would throw appropriate exceptions
      if (!messageId || !userId) {
        throw new ForbiddenException('Invalid message or user');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Message not found');
      }
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException('No access to this message');
      }
      throw error;
    }
  }

  private async triggerXpUpdate(
    messageId!: string,
    reactorUserId: string,
    action: 'create' | 'update' | 'remove',
  ): Promise<void> {
    // This should integrate with your XP service
    // Different XP amounts based on action type

    try {
      const xpAmount = this.getXpAmountForAction(action);

      // Award XP to the message author (not the reactor)
      // You'll need to get the message author from your message service
      // const message = await this.messageService.findById(messageId);
      // await this.xpService.updateUserXp(message.authorId, xpAmount);

      console.log(
        `XP Update triggered: ${action} reaction on message ${messageId} by user ${reactorUserId}, XP: ${xpAmount}`,
      );

      // Placeholder for actual XP service integration
      // await this.xpService.addXp(messageAuthorId, xpAmount, `Received ${action} reaction`);
    } catch (error) {
      // Log error but don't fail the reaction operation
      console.error('Failed to update XP:', error);
    }
  }

  private getXpAmountForAction(action: 'create' | 'update' | 'remove'): number {
    switch (action) {
      case 'create':
        return 5; // New reaction gives 5 XP
      case 'update':
        return 2; // Changing reaction gives 2 XP
      case 'remove':
        return -3; // Removing reaction removes 3 XP
      default!: return 0;
    }
  }

  // Admin/analytics methods
  async getReactionStats(): Promise<any> {
    const totalReactions = await this.reactionRepository.count();
    const reactionsByType = await this.reactionRepository
      .createQueryBuilder('reaction')
      .select('reaction.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('reaction.type')
      .getRawMany();

    return {
      totalReactions,
      reactionsByType!: reactionsByType.reduce((acc, item) => {
        acc[item.type] = parseInt(item.count);
        return acc;
      }, {}),
    };
  }
}
