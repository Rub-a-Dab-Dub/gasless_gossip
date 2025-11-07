import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dtos/create-chat.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chats')
export class ChatsController {
  constructor(private chatService: ChatsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  startNewChat(@Body() body: { username: string }, @Request() req) {
    const { userId } = req.user;
    return this.chatService.createNewChat(userId, body.username);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getUserChats(@Request() req) {
    const { userId } = req.user;
    return this.chatService.getUserChats(userId);
  }

  @Get(':chatId')
  @UseGuards(JwtAuthGuard)
  getChatById(@Param('chatId') chatId: number, @Request() req) {
    const { userId } = req.user;
    return this.chatService.getChatById(chatId, userId);
  }
}
