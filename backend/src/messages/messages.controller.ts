import { Controller, Post, Get, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './message.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto, @Request() req): Promise<Message> {
    // Enforce room access (pseudo, replace with real check)
    if (!this.userHasRoomAccess(req.user, createMessageDto.roomId)) {
      throw new ForbiddenException('No access to this room');
    }
    return this.messagesService.create(createMessageDto);
  }

  @Get(':roomId')
  async findByRoom(@Param('roomId') roomId: string, @Request() req): Promise<Message[]> {
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
}
