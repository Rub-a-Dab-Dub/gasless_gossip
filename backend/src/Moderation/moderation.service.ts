import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModerationAction, ActionType } from './entities/moderation-action.entity';
import { CreateModerationActionDto, ReverseModerationActionDto } from './dto/moderation-action.dto';

@Injectable()
export class ModerationService {
  constructor(
    @InjectRepository(ModerationAction)
    private moderationRepository: Repository<ModerationAction>,
  ) {}

  async checkModeratorPrivileges(userId: string, roomId: string): Promise<boolean> {
    // This would typically check against a Room entity or User-Room relationship
    // For now, we'll implement a basic check - you should integrate with your room/user system
    // Example: Check if user is room creator or has moderator role
    
    // Placeholder implementation - replace with your actual room/user logic
    const isModerator = await this.isUserModerator(userId, roomId);
    if (!isModerator) {
      throw new ForbiddenException('User does not have moderator privileges for this room');
    }
    return true;
  }

  private async isUserModerator(userId: string, roomId: string): Promise<boolean> {
    // TODO: Implement actual moderator check against your Room/User entities
    // This could check:
    // - If user is room creator
    // - If user has moderator role in the room
    // - If user has admin privileges
    
    // Placeholder - replace with actual implementation
    return true; // For testing purposes
  }

  async createModerationAction(
    moderatorId: string,
    createDto: CreateModerationActionDto,
  ): Promise<ModerationAction> {
    // Check moderator privileges
    await this.checkModeratorPrivileges(moderatorId, createDto.roomId);

    // Prevent self-moderation
    if (moderatorId === createDto.targetId) {
      throw new BadRequestException('Cannot perform moderation actions on yourself');
    }

    // Check for existing active actions of the same type
    const existingAction = await this.moderationRepository.findOne({
      where: {
        roomId: createDto.roomId,
        targetId: createDto.targetId,
        actionType: createDto.actionType,
        isActive: true,
      },
    });

    if (existingAction) {
      throw new BadRequestException(User already has an active ${createDto.actionType} action);
    }

    // Create new moderation action
    const moderationAction = this.moderationRepository.create({
      ...createDto,
      moderatorId,
      expiresAt: createDto.expiresAt ? new Date(createDto.expiresAt) : null,
    });

    return await this.moderationRepository.save(moderationAction);
  }

  async reverseModerationAction(
    moderatorId: string,
    reverseDto: ReverseModerationActionDto,
  ): Promise<ModerationAction> {
    await this.checkModeratorPrivileges(moderatorId, reverseDto.roomId);

    // Find the active action to reverse
    const originalAction = await this.moderationRepository.findOne({
      where: {
        roomId: reverseDto.roomId,
        targetId: reverseDto.targetId,
        actionType: reverseDto.actionType,
        isActive: true,
      },
    });

    if (!originalAction) {
      throw new NotFoundException(No active ${reverseDto.actionType} found for this user);
    }

    // Deactivate the original action
    originalAction.isActive = false;
    await this.moderationRepository.save(originalAction);

    // Create reverse action
    const reverseActionType = this.getReverseActionType(reverseDto.actionType);
    const reverseAction = this.moderationRepository.create({
      roomId: reverseDto.roomId,
      targetId: reverseDto.targetId,
      moderatorId,
      actionType: reverseActionType,
      reason: reverseDto.reason || Reversed ${reverseDto.actionType},
    });

    return await this.moderationRepository.save(reverseAction);
  }

  private getReverseActionType(actionType: ActionType): ActionType {
    const reverseMap = {
      [ActionType.BAN]: ActionType.UNBAN,
      [ActionType.MUTE]: ActionType.UNMUTE,
    };
    
    return reverseMap[actionType] || actionType;
  }

  async getModerationHistory(roomId: string, targetId?: string): Promise<ModerationAction[]> {
    const query = this.moderationRepository.createQueryBuilder('action')
      .where('action.roomId = :roomId', { roomId })
      .orderBy('action.createdAt', 'DESC');

    if (targetId) {
      query.andWhere('action.targetId = :targetId', { targetId });
    }

    return await query.getMany();
  }

  async getActiveModerations(roomId: string): Promise<ModerationAction[]> {
    return await this.moderationRepository.find({
      where: {
        roomId,
        isActive: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async isUserBanned(userId: string, roomId: string): Promise<boolean> {
    const banAction = await this.moderationRepository.findOne({
      where: {
        roomId,
        targetId: userId,
        actionType: ActionType.BAN,
        isActive: true,
      },
    });

    if (!banAction) return false;

    // Check if ban has expired
    if (banAction.expiresAt && banAction.expiresAt < new Date()) {
      banAction.isActive = false;
      await this.moderationRepository.save(banAction);
      return false;
    }

    return true;
  }

  async isUserMuted(userId: string, roomId: string): Promise<boolean> {
    const muteAction = await this.moderationRepository.findOne({
      where: {
        roomId,
        targetId: userId,
        actionType: ActionType.MUTE,
        isActive: true,
      },
    });

    if (!muteAction) return false;

    // Check if mute has expired
    if (muteAction.expiresAt && muteAction.expiresAt < new Date()) {
      muteAction.isActive = false;
      await this.moderationRepository.save(muteAction);
      return false;
    }

    return true;
  }
}

