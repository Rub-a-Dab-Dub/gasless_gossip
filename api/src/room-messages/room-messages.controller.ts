import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { RoomMessagesService } from './room-messages.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('room-messages')
@UseGuards(JwtAuthGuard)
export class RoomMessagesController {
  constructor(private readonly messagesService: RoomMessagesService) {}

  @Post(':roomId/:senderId')
  sendMessage(
    @Param('roomId') roomId: number,
    @Param('senderId') senderId: number,
    @Body('content') content: string,
  ) {
    return this.messagesService.sendMessage(roomId, senderId, content);
  }

  @Get(':roomId')
  getMessages(@Param('roomId') roomId: number) {
    return this.messagesService.getMessages(roomId);
  }
}
