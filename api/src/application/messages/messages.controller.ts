import { Controller, Post, Get, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messageService: MessagesService) {}

  @Post()
  sendMessage(@Body() dto: CreateMessageDto) {
    return this.messageService.sendMessage(dto);
  }

  @Get('chat/:chatId')
  getMessages(@Param('chatId') chatId: number) {
    return this.messageService.getMessages(chatId);
  }

  @Patch(':messageId/read')
  markAsRead(@Param('messageId') messageId: number) {
    return this.messageService.markAsRead(messageId);
  }
}
