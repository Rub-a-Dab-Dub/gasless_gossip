import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ChatHistoryService } from './services/chat-history.service';
import { ChatHistoryQueryDto, ChatHistoryResponseDto, ChatMessageDto } from './dto/chat-history.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoomAccessGuard } from '../auth/guards/room-access.guard';

@Controller('chat-history')
@UseGuards(JwtAuthGuard)
export class ChatHistoryController {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  @Get('history')
  @UseGuards(RoomAccessGuard)
  async getChatHistory(
    @Query(new ValidationPipe({ transform: true })) query: ChatHistoryQueryDto,
    @Request() req: any,
  ): Promise<ChatHistoryResponseDto> {
    return this.chatHistoryService.getChatHistory(query);
  }

  @Get('recent/:roomId')
  @UseGuards(RoomAccessGuard)
  async getRecentMessages(
    @Param('roomId') roomId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Request() req: any,
  ): Promise<ChatMessageDto[]> {
    return this.chatHistoryService.getRecentMessages(roomId, limit || 50);
  }

  @Get('user/:userId')
  async getUserMessageHistory(
    @Param('userId') userId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Request() req: any,
  ): Promise<ChatMessageDto[]> {
    // Users can only access their own message history
    if (req.user.id !== userId) {
      throw new Error('Unauthorized: Cannot access other users message history');
    }
    return this.chatHistoryService.getUserMessageHistory(userId, limit || 100);
  }

  @Post('message')
  @UseGuards(RoomAccessGuard)
  async createMessage(
    @Body() createMessageDto: {
      roomId: string;
      content: string;
      messageType?: string;
      metadata?: Record<string, any>;
    },
    @Request() req: any,
  ): Promise<ChatMessageDto> {
    return this.chatHistoryService.createMessage(
      createMessageDto.roomId,
      req.user.id,
      createMessageDto.content,
      createMessageDto.messageType,
      createMessageDto.metadata,
    );
  }

  @Get('message/:messageId')
  async getMessage(
    @Param('messageId') messageId: string,
    @Request() req: any,
  ): Promise<ChatMessageDto> {
    return this.chatHistoryService.getMessageById(messageId);
  }

  @Get('performance-test/:roomId')
  @UseGuards(RoomAccessGuard)
  async performanceTest(
    @Param('roomId') roomId: string,
    @Query('messageCount', new ParseIntPipe({ optional: true })) messageCount?: number,
    @Request() req: any,
  ): Promise<{
    queryTime: number;
    messagesRetrieved: number;
    indexUsed: boolean;
  }> {
    return this.chatHistoryService.performanceTest(roomId, messageCount || 10000);
  }
}
