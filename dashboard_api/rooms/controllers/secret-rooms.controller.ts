import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ValidationPipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { RoomsService } from './services/rooms.service';
import { FakeNameGeneratorService } from './services/fake-name-generator.service';
import { VoiceModerationQueueService } from './services/voice-moderation-queue.service';
import { RoomSchedulerService } from './services/room-scheduler.service';
import { SecretRoomsGateway } from './gateways/secret-rooms.gateway';
import {
  CreateSecretRoomDto,
  UpdateSecretRoomDto,
  JoinRoomDto,
  InviteUserDto,
  SendTokenTipDto,
  RoomReactionDto,
  VoiceNoteDto,
  ModerationActionDto,
  SecretRoomResponseDto,
  RoomStatsDto,
  ModerationQueueStatusDto,
  FakeNamePreviewDto,
} from '../dto/secret-room.dto';

@ApiTags('secret-rooms')
@ApiBearerAuth()
@Controller('secret-rooms')
export class SecretRoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly fakeNameGenerator: FakeNameGeneratorService,
    private readonly voiceModerationQueue: VoiceModerationQueueService,
    private readonly roomScheduler: RoomSchedulerService,
    private readonly secretRoomsGateway: SecretRoomsGateway,
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new secret room with enhanced features' })
  @ApiResponse({ type: SecretRoomResponseDto })
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 room creations per minute
  async createSecretRoom(
    @Body(new ValidationPipe({ transform: true })) dto: CreateSecretRoomDto,
    @Request() req: any,
  ): Promise<SecretRoomResponseDto> {
    return this.roomsService.createEnhancedRoom(dto, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get secret room details with user-specific data' })
  @ApiResponse({ type: SecretRoomResponseDto })
  @Throttle({ short: { limit: 30, ttl: 60000 } }) // 30 requests per minute
  async getSecretRoom(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<SecretRoomResponseDto> {
    return this.roomsService.getEnhancedRoom(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update secret room settings' })
  @ApiResponse({ type: SecretRoomResponseDto })
  async updateSecretRoom(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true })) dto: UpdateSecretRoomDto,
    @Request() req: any,
  ): Promise<SecretRoomResponseDto> {
    return this.roomsService.updateEnhancedRoom(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete or archive a secret room' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSecretRoom(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<void> {
    await this.roomsService.deleteEnhancedRoom(id, req.user.id);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join a secret room using room code' })
  @ApiResponse({ type: SecretRoomResponseDto })
  @Throttle({ short: { limit: 20, ttl: 60000 } })
  async joinSecretRoom(
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: JoinRoomDto,
    @Request() req: any,
  ): Promise<SecretRoomResponseDto> {
    return this.roomsService.joinEnhancedRoom(id, dto, req.user.id);
  }

  @Post(':id/leave')
  @ApiOperation({ summary: 'Leave a secret room' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async leaveSecretRoom(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<void> {
    await this.roomsService.leaveEnhancedRoom(id, req.user.id);
  }

  @Post(':id/invite')
  @ApiOperation({ summary: 'Invite a user to the secret room' })
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async inviteUser(
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: InviteUserDto,
    @Request() req: any,
  ): Promise<{ success: boolean; message: string }> {
    return this.roomsService.inviteUserToRoom(id, dto, req.user.id);
  }

  @Post(':id/tip')
  @ApiOperation({ summary: 'Send token tip to another user in the room' })
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  async sendTokenTip(
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: SendTokenTipDto,
    @Request() req: any,
  ): Promise<{ success: boolean; transactionId: string }> {
    const result = await this.roomsService.sendTokenTip(id, dto, req.user.id);
    
    // Broadcast real-time notification
    this.secretRoomsGateway.broadcastToRoom(id, 'tokenTipSent', {
      fromUserId: req.user.id,
      toUserId: dto.recipientUserId,
      amount: dto.amount,
      token: dto.token,
      message: dto.message,
      timestamp: new Date(),
    });

    return result;
  }

  @Post(':id/react')
  @ApiOperation({ summary: 'Add reaction to a message in the room' })
  @Throttle({ short: { limit: 30, ttl: 60000 } })
  async addReaction(
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: RoomReactionDto,
    @Request() req: any,
  ): Promise<{ success: boolean }> {
    const result = await this.roomsService.addReaction(id, dto, req.user.id);
    
    // Broadcast real-time reaction
    this.secretRoomsGateway.broadcastToRoom(id, 'reactionAdded', {
      messageId: dto.messageId,
      emoji: dto.emoji,
      userId: req.user.id,
      timestamp: new Date(),
    });

    return result;
  }

  @Post(':id/voice-note')
  @ApiOperation({ summary: 'Submit voice note for moderation' })
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async submitVoiceNote(
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: VoiceNoteDto,
    @Request() req: any,
  ): Promise<{ queuePosition: number; estimatedWaitTime: number }> {
    return this.roomsService.submitVoiceNote(id, dto, req.user.id);
  }

  @Get(':id/reactions')
  @ApiOperation({ summary: 'Get room reaction metrics and trending data' })
  async getRoomReactions(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<any> {
    return this.roomsService.getRoomReactionMetrics(id, req.user.id);
  }

  @Post(':id/moderate')
  @ApiOperation({ summary: 'Perform moderation action (moderators only)' })
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async moderateRoom(
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: ModerationActionDto,
    @Request() req: any,
  ): Promise<{ success: boolean; message: string }> {
    return this.roomsService.performModerationAction(id, dto, req.user.id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get comprehensive room statistics' })
  @ApiResponse({ type: RoomStatsDto })
  async getRoomStats(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<RoomStatsDto> {
    return this.roomsService.getRoomStats(id, req.user.id);
  }

  @Get(':id/moderation-queue')
  @ApiOperation({ summary: 'Get moderation queue status for the room' })
  @ApiResponse({ type: ModerationQueueStatusDto })
  async getModerationQueueStatus(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<ModerationQueueStatusDto> {
    const roomQueue = this.voiceModerationQueue.getItemsByRoom(id);
    const overallStatus = this.voiceModerationQueue.getQueueStatus();
    
    return {
      totalItems: roomQueue.length,
      pendingItems: roomQueue.filter(item => item.status === 'pending').length,
      processingItems: roomQueue.filter(item => item.status === 'processing').length,
      queueCapacity: overallStatus.queueCapacity,
      averageProcessingTime: overallStatus.averageProcessingTime,
      yourPosition: roomQueue.findIndex(item => item.userId === req.user.id) + 1 || undefined,
    };
  }

  // Utility endpoints
  @Get('fake-names/preview/:theme')
  @ApiOperation({ summary: 'Preview fake names for a specific theme' })
  @ApiResponse({ type: FakeNamePreviewDto })
  async previewFakeNames(
    @Param('theme') theme: string,
  ): Promise<FakeNamePreviewDto> {
    if (!this.fakeNameGenerator.isValidTheme(theme)) {
      throw new Error(`Invalid theme: ${theme}`);
    }

    const samples = Array.from({ length: 5 }, () =>
      this.fakeNameGenerator.generateFakeName(theme as any)
    );

    return {
      theme: theme as any,
      samples,
    };
  }

  @Get('fake-names/themes')
  @ApiOperation({ summary: 'Get all available fake name themes' })
  async getFakeNameThemes(): Promise<{ themes: string[] }> {
    return {
      themes: this.fakeNameGenerator.getAvailableThemes(),
    };
  }

  @Get('scheduler/stats')
  @ApiOperation({ summary: 'Get room scheduler statistics (admin only)' })
  async getSchedulerStats(@Request() req: any): Promise<any> {
    // In a real app, you'd check for admin permissions here
    return this.roomScheduler.getProcessingStats();
  }

  @Post('scheduler/manual-cleanup')
  @ApiOperation({ summary: 'Manually trigger room cleanup (admin only)' })
  @HttpCode(HttpStatus.OK)
  async manualCleanup(@Request() req: any): Promise<any> {
    // In a real app, you'd check for admin permissions here
    return this.roomScheduler.manualCleanup();
  }
}