import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { CreateModerationActionDto, ReverseModerationActionDto } from './dto/moderation-action.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Uncomment when you have auth

@Controller('moderation')
// @UseGuards(JwtAuthGuard) // Uncomment when you have authentication
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post('ban')
  async banUser(@Request() req, @Body() createDto: CreateModerationActionDto) {
    // In a real app, get moderatorId from JWT token
    const moderatorId = req.user?.id || 'mock-moderator-id'; // Replace with actual user ID from auth
    
    const banDto = { ...createDto, actionType: 'ban' as const };
    return await this.moderationService.createModerationAction(moderatorId, banDto);
  }

  @Post('kick')
  async kickUser(@Request() req, @Body() createDto: CreateModerationActionDto) {
    const moderatorId = req.user?.id || 'mock-moderator-id';
    
    const kickDto = { ...createDto, actionType: 'kick' as const };
    return await this.moderationService.createModerationAction(moderatorId, kickDto);
  }

  @Post('mute')
  async muteUser(@Request() req, @Body() createDto: CreateModerationActionDto) {
    const moderatorId = req.user?.id || 'mock-moderator-id';
    
    const muteDto = { ...createDto, actionType: 'mute' as const };
    return await this.moderationService.createModerationAction(moderatorId, muteDto);
  }

  @Post('unban')
  async unbanUser(@Request() req, @Body() reverseDto: ReverseModerationActionDto) {
    const moderatorId = req.user?.id || 'mock-moderator-id';
    
    const unbanDto = { ...reverseDto, actionType: 'ban' as const };
    return await this.moderationService.reverseModerationAction(moderatorId, unbanDto);
  }

  @Post('unmute')
  async unmuteUser(@Request() req, @Body() reverseDto: ReverseModerationActionDto) {
    const moderatorId = req.user?.id || 'mock-moderator-id';
    
    const unmuteDto = { ...reverseDto, actionType: 'mute' as const };
    return await this.moderationService.reverseModerationAction(moderatorId, unmuteDto);
  }

  @Post('warn')
  async warnUser(@Request() req, @Body() createDto: CreateModerationActionDto) {
    const moderatorId = req.user?.id || 'mock-moderator-id';
    
    const warnDto = { ...createDto, actionType: 'warn' as const };
    return await this.moderationService.createModerationAction(moderatorId, warnDto);
  }

  @Get('history/:roomId')
  async getModerationHistory(
    @Param('roomId') roomId: string,
    @Query('targetId') targetId?: string,
  ) {
    return await this.moderationService.getModerationHistory(roomId, targetId);
  }

  @Get('active/:roomId')
  async getActiveModerations(@Param('roomId') roomId: string) {
    return await this.moderationService.getActiveModerations(roomId);
  }

  @Get('check-ban/:roomId/:userId')
  async checkBanStatus(
    @Param('roomId') roomId: string,
    @Param('userId') userId: string,
  ) {
    const isBanned = await this.moderationService.isUserBanned(userId, roomId);
    return { isBanned };
  }

  @Get('check-mute/:roomId/:userId')
  async checkMuteStatus(
    @Param('roomId') roomId: string,
    @Param('userId') userId: string,
  ) {
    const isMuted = await this.moderationService.isUserMuted(userId, roomId);
    return { isMuted };
  }
}
