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
} from '@nestjs/common';
import { SecretRoomsService } from './services/secret-rooms.service';
import { 
  CreateSecretRoomDto, 
  UpdateSecretRoomDto, 
  JoinRoomDto, 
  InviteUserDto,
  SecretRoomDto,
  RoomMemberDto,
  RoomInvitationDto,
  RoomStatsDto,
  UserRoomLimitDto
} from './dto/secret-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class SecretRoomsController {
  constructor(private readonly secretRoomsService: SecretRoomsService) {}

  @Post('create')
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 room creations per minute
  async createSecretRoom(
    @Body(new ValidationPipe({ transform: true })) dto: CreateSecretRoomDto,
    @Request() req: any,
  ): Promise<SecretRoomDto> {
    return this.secretRoomsService.createSecretRoom(dto, req.user.id);
  }

  @Get(':id')
  @Throttle({ short: { limit: 30, ttl: 60000 } }) // 30 requests per minute
  async getSecretRoom(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<SecretRoomDto> {
    return this.secretRoomsService.getSecretRoom(id, req.user.id);
  }

  @Get('code/:roomCode')
  @Throttle({ short: { limit: 30, ttl: 60000 } }) // 30 requests per minute
  async getSecretRoomByCode(
    @Param('roomCode') roomCode: string,
    @Request() req: any,
  ): Promise<SecretRoomDto> {
    return this.secretRoomsService.getSecretRoomByCode(roomCode, req.user.id);
  }

  @Get('user/rooms')
  @Throttle({ short: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  async getUserRooms(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Request() req: any,
  ): Promise<SecretRoomDto[]> {
    return this.secretRoomsService.getUserRooms(req.user.id, limit || 20);
  }

  @Post('join')
  @Throttle({ short: { limit: 20, ttl: 60000 } }) // 20 join requests per minute
  async joinRoom(
    @Body(new ValidationPipe({ transform: true })) dto: JoinRoomDto,
    @Request() req: any,
  ): Promise<RoomMemberDto> {
    return this.secretRoomsService.joinRoom(dto, req.user.id);
  }

  @Post(':id/leave')
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 leave requests per minute
  async leaveRoom(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<{ message: string }> {
    await this.secretRoomsService.leaveRoom(id, req.user.id);
    return { message: 'Successfully left the room' };
  }

  @Post(':id/invite')
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 invitations per minute
  async inviteUser(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true })) dto: InviteUserDto,
    @Request() req: any,
  ): Promise<RoomInvitationDto> {
    return this.secretRoomsService.inviteUser(id, dto, req.user.id);
  }

  @Post('invite/accept')
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 acceptances per minute
  async acceptInvitation(
    @Body() body: { invitationCode: string },
    @Request() req: any,
  ): Promise<RoomMemberDto> {
    return this.secretRoomsService.acceptInvitation(body.invitationCode, req.user.id);
  }

  @Get(':id/members')
  @Throttle({ short: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  async getRoomMembers(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<RoomMemberDto[]> {
    return this.secretRoomsService.getRoomMembers(id, req.user.id);
  }

  @Put(':id')
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 updates per minute
  async updateRoom(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true })) dto: UpdateSecretRoomDto,
    @Request() req: any,
  ): Promise<SecretRoomDto> {
    return this.secretRoomsService.updateRoom(id, dto, req.user.id);
  }

  @Delete(':id')
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 deletions per minute
  async deleteRoom(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<{ message: string }> {
    await this.secretRoomsService.deleteRoom(id, req.user.id);
    return { message: 'Room deleted successfully' };
  }

  @Get('stats/overview')
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  async getRoomStats(): Promise<RoomStatsDto> {
    return this.secretRoomsService.getRoomStats();
  }

  @Get('user/limit')
  @Throttle({ short: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  async getUserRoomLimit(
    @Request() req: any,
  ): Promise<UserRoomLimitDto> {
    return this.secretRoomsService.getUserRoomLimit(req.user.id);
  }

  // Test endpoints for performance testing
  @Post('test/concurrent-creation')
  @Throttle({ short: { limit: 1, ttl: 60000 } }) // 1 test per minute
  async testConcurrentRoomCreation(
    @Query('rooms', new ParseIntPipe({ optional: true })) rooms: number = 10,
    @Request() req: any,
  ): Promise<{
    message: string;
    totalRooms: number;
    totalTime: string;
    averageTime: string;
    roomsPerSecond: string;
    results: SecretRoomDto[];
  }> {
    const startTime = Date.now();
    
    // Create concurrent room creation promises
    const roomPromises = Array.from({ length: rooms }, (_, i) =>
      this.secretRoomsService.createSecretRoom({
        name: `Test Room ${i + 1}`,
        description: `Performance test room ${i + 1}`,
        isPrivate: i % 2 === 0, // Alternate between private and public
        maxUsers: 50,
        category: 'test',
        theme: 'dark',
        settings: {
          allowAnonymous: true,
          requireApproval: false,
          autoDelete: false,
          moderationLevel: 'low',
        },
        metadata: {
          tags: ['test', 'performance'],
          language: 'en',
        },
      }, req.user.id)
    );

    // Execute all room creations concurrently
    const results = await Promise.all(roomPromises);
    const endTime = Date.now();
    const totalTime = endTime - startTime;

    return {
      message: 'Concurrent room creation test completed',
      totalRooms: rooms,
      totalTime: `${totalTime}ms`,
      averageTime: `${(totalTime / rooms).toFixed(2)}ms`,
      roomsPerSecond: `${(rooms / (totalTime / 1000)).toFixed(2)}`,
      results,
    };
  }

  @Get('test/performance')
  @Throttle({ short: { limit: 1, ttl: 60000 } }) // 1 test per minute
  async testPerformance(
    @Query('operations', new ParseIntPipe({ optional: true })) operations: number = 100,
    @Request() req: any,
  ): Promise<{
    message: string;
    operations: number;
    totalTime: string;
    averageTime: string;
    operationsPerSecond: string;
    performance: {
      roomCreation: string;
      roomRetrieval: string;
      memberJoin: string;
      roomUpdate: string;
    };
  }> {
    const startTime = Date.now();
    
    // Test room creation performance
    const roomCreationStart = Date.now();
    const testRoom = await this.secretRoomsService.createSecretRoom({
      name: 'Performance Test Room',
      description: 'Room for performance testing',
      isPrivate: false,
      maxUsers: 100,
      category: 'test',
    }, req.user.id);
    const roomCreationTime = Date.now() - roomCreationStart;

    // Test room retrieval performance
    const roomRetrievalStart = Date.now();
    await this.secretRoomsService.getSecretRoom(testRoom.id, req.user.id);
    const roomRetrievalTime = Date.now() - roomRetrievalStart;

    // Test member join performance
    const memberJoinStart = Date.now();
    await this.secretRoomsService.joinRoom({
      roomCode: testRoom.roomCode,
      nickname: 'Test User',
      isAnonymous: false,
    }, req.user.id);
    const memberJoinTime = Date.now() - memberJoinStart;

    // Test room update performance
    const roomUpdateStart = Date.now();
    await this.secretRoomsService.updateRoom(testRoom.id, {
      name: 'Updated Performance Test Room',
      description: 'Updated description',
    }, req.user.id);
    const roomUpdateTime = Date.now() - roomUpdateStart;

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    return {
      message: 'Performance test completed',
      operations: 4, // room creation, retrieval, join, update
      totalTime: `${totalTime}ms`,
      averageTime: `${(totalTime / 4).toFixed(2)}ms`,
      operationsPerSecond: `${(4 / (totalTime / 1000)).toFixed(2)}`,
      performance: {
        roomCreation: `${roomCreationTime}ms`,
        roomRetrieval: `${roomRetrievalTime}ms`,
        memberJoin: `${memberJoinTime}ms`,
        roomUpdate: `${roomUpdateTime}ms`,
      },
    };
  }

  // NEW ENHANCED FEATURES ENDPOINTS

  @Get('trending/most-reacted')
  @Throttle({ short: { limit: 20, ttl: 60000 } })
  async getMostReactedRooms(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('timeWindow') timeWindow?: string,
  ): Promise<SecretRoomDto[]> {
    const timeWindowDate = timeWindow ? new Date(timeWindow) : undefined;
    return this.secretRoomsService.getMostReactedSecretRooms(limit || 10, timeWindowDate);
  }

  @Post(':id/reactions/update')
  @Throttle({ short: { limit: 100, ttl: 60000 } }) // High limit for reactions
  async updateRoomReaction(
    @Param('id') roomId: string,
    @Body() body: { reactionType: string; increment: boolean },
  ): Promise<{ message: string }> {
    await this.secretRoomsService.updateRoomReactionMetrics(roomId, body.reactionType, body.increment);
    return { message: 'Reaction metrics updated' };
  }

  @Post(':id/xp/award-creator')
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async awardCreatorXp(
    @Param('id') roomId: string,
    @Body() body: { reason?: string },
  ): Promise<{ message: string }> {
    await this.secretRoomsService.awardCreatorXpBonus(roomId, body.reason || 'manual_award');
    return { message: 'XP awarded to room creator' };
  }

  @Get('scheduler/stats')
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async getSchedulerStats(): Promise<{
    expiredRoomsCount: number;
    scheduledForDeletion: number;
    averageRoomLifespan: number;
  }> {
    // TODO: Integrate with SecretRoomSchedulerService
    return {
      expiredRoomsCount: 0,
      scheduledForDeletion: 0,
      averageRoomLifespan: 0
    };
  }

  @Post('scheduler/trigger-cleanup')
  @Throttle({ short: { limit: 2, ttl: 300000 } }) // 2 cleanups per 5 minutes
  async triggerManualCleanup(): Promise<{
    message: string;
    processed: number;
    errors: number;
  }> {
    // TODO: Integrate with SecretRoomSchedulerService
    return {
      message: 'Manual cleanup completed',
      processed: 0,
      errors: 0
    };
  }

  @Get('fake-names/themes')
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async getFakeNameThemes(): Promise<{
    themes: string[];
    previews: Record<string, string[]>;
  }> {
    // TODO: Integrate with FakeNameGeneratorService
    return {
      themes: ['default', 'space', 'animals', 'colors', 'cyber', 'mythical'],
      previews: {
        default: ['Shadow Walker', 'Night Whisper', 'Silent Ghost'],
        space: ['Cosmic Wanderer', 'Star Drifter', 'Nebula Explorer'],
        animals: ['Cyber Fox', 'Digital Wolf', 'Neon Tiger'],
        colors: ['Crimson Shade', 'Azure Phantom', 'Golden Spirit'],
        cyber: ['Digital Ghost', 'Neon Runner', 'Cyber Phantom'],
        mythical: ['Ancient Dragon', 'Divine Phoenix', 'Mystic Oracle']
      }
    };
  }

  @Post('fake-names/preview')
  @Throttle({ short: { limit: 20, ttl: 60000 } })
  async previewFakeNames(
    @Body() body: { theme: string; count?: number },
  ): Promise<{ names: string[] }> {
    // TODO: Integrate with FakeNameGeneratorService
    const mockNames = [
      'Shadow Walker 123',
      'Neon Oracle 456', 
      'Cyber Phantom 789'
    ];
    return { names: mockNames.slice(0, body.count || 3) };
  }

  @Get('moderation/queue-stats')
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async getModerationQueueStats(): Promise<{
    totalItems: number;
    pending: number;
    processing: number;
    capacity: number;
    capacityUsed: number;
  }> {
    // TODO: Integrate with VoiceModerationQueueService
    return {
      totalItems: 45,
      pending: 12,
      processing: 3,
      capacity: 100,
      capacityUsed: 45
    };
  }
}
