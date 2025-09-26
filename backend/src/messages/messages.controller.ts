import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './message.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req,
  ): Promise<Message> {
    // Enforce room access (pseudo, replace with real check)
    if (!this.userHasRoomAccess(req.user, createMessageDto.roomId)) {
      throw new ForbiddenException('No access to this room');
    }
    return this.messagesService.create(createMessageDto);
  }

  @Get(':roomId')
  async findByRoom(
    @Param('roomId') roomId: string,
    @Request() req,
  ): Promise<Message[]> {
    // Enforce room access (pseudo, replace with real check)
    if (!this.userHasRoomAccess(req.user, roomId)) {
      throw new ForbiddenException('No access to this room');
    }
    return this.messagesService.findByRoom(roomId);
  }

  private userHasRoomAccess(user: any, roomId: string): boolean {
    // TODO: Implement real room access logic
    return true;
  }

  @Get(":roomId")
  @ApiOperation({
    summary: "Get paginated messages for a specific room",
    description: "Retrieves messages from a secret room with pagination support for improved performance",
  })
  @ApiParam({
    name: "roomId",
    description: "UUID of the room to fetch messages from",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number (1-based)",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of messages per page (max 100)",
    example: 20,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Messages retrieved successfully with pagination metadata",
    type: PaginatedMessagesDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid pagination parameters",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Room not found",
  })
  async findAllByRoom(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Query() query: Omit<GetMessagesDto, 'roomId'>,
  ): Promise<PaginatedMessagesDto> {
    const getMessagesDto: GetMessagesDto = {
      ...query,
      roomId,
    }

    return await this.messagesService.findAllByRoom(getMessagesDto)
  }

  @Get('single/:id')
  @ApiOperation({ summary: 'Get a specific message by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the message',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Message found',
    type: Message,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Message not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Message> {
    return await this.messagesService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a message" })
  @ApiParam({
    name: "id",
    description: "UUID of the message to update",
    example: "123e4567-e89b-12d3-a456-426614174001",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Message updated successfully",
    type: Message,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Message not found",
  })
  async update(@Param('id', ParseUUIDPipe) id: string, updateMessageDto: Partial<CreateMessageDto>): Promise<Message> {
    return await this.messagesService.update(id, updateMessageDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a message' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the message to delete',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Message deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Message not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.messagesService.remove(id);
  }

  @Get('room/:roomId/count')
  @ApiOperation({ summary: 'Get total message count for a room' })
  @ApiParam({
    name: 'roomId',
    description: 'UUID of the room',
    example: '123e4567-e89b-12d3-a456-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Message count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 150 },
      },
    },
  })
  async getMessageCount(
    @Param('roomId', ParseUUIDPipe) roomId: string,
  ): Promise<{ count: number }> {
    const count = await this.messagesService.getMessageCountByRoom(roomId);
    return { count };
  }

  @Get("room/:roomId/recent")
  @ApiOperation({
    summary: "Get recent messages with cursor-based pagination",
    description: "Alternative pagination method using cursor for real-time applications",
  })
  @ApiParam({
    name: "roomId",
    description: "UUID of the room",
    example: "123e4567-e89b-12d3-a456-446655440000",
  })
  @ApiQuery({
    name: "cursor",
    required: false,
    description: "Cursor for pagination (ISO date string)",
    example: "2024-01-15T10:30:00.000Z",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of messages to fetch (max 100)",
    example: 20,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Recent messages retrieved successfully",
    schema: {
      type: "object",
      properties: {
        messages: {
          type: "array",
          items: { $ref: "#/components/schemas/Message" },
        },
        nextCursor: { type: "string", nullable: true },
      },
    },
  })
  async getRecentMessages(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ): Promise<{ messages: Message[]; nextCursor?: string }> {
    return await this.messagesService.findRecentMessages(roomId, cursor, limit ? Math.min(limit, 100) : 20)
  }
}
