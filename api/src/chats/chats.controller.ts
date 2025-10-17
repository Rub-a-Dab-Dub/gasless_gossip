import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dtos/create-chat.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private chatService: ChatsService) {}

  @Post()
  createChat(@Body() dto: CreateChatDto) {
    return this.chatService.createChat(dto);
  }

  @Get('user/:userId')
  getUserChats(@Param('userId') userId: number) {
    return this.chatService.getUserChats(userId);
  }

  @Get(':chatId')
  getChatById(@Param('chatId') chatId: number) {
    return this.chatService.getChatById(chatId);
  }
}
