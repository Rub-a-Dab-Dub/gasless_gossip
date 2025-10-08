import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
  NotFoundException,
  ParseIntPipe,
  Request,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(
    @Req() req,
    @Body() body: { receiver_id: number; content: string },
  ) {
    const sender_id = req.user.id;
    const { receiver_id, content } = body;

    if (!receiver_id || !content)
      throw new NotFoundException('Receiver and content are required');

    return this.chatService.sendMessage(sender_id, receiver_id, content);
  }

  @Get('conversation/:userId')
  async getConversation(@Req() req, @Param('userId') receiver_id: number) {
    const user_id = req.user.id;
    return this.chatService.getConversation(user_id, receiver_id);
  }

  @Post('rooms')
  async createRoom(
    @Body() body: { name: string; type: 'public' | 'paid'; fee?: number },
  ) {
    return this.chatService.createRoom(body.name, body.type, body.fee ?? 0);
  }

  @Post('rooms/:roomId/join')
  async joinRoom(
    @Request() req,
    @Param('roomId', ParseIntPipe) roomId: number,
  ) {
    const { id } = req.user;
    return this.chatService.joinRoom(id, roomId);
  }

  @Post('rooms/:roomId/leave')
  async leaveRoom(
    @Request() req,
    @Param('roomId', ParseIntPipe) roomId: number,
  ) {
    const { id } = req.user;
    return this.chatService.leaveRoom(id, roomId);
  }

  @Post('rooms/:roomId/messages')
  async sendRoomMessage(
    @Request() req,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() body: { content: string },
  ) {
    const { id } = req.user;
    return this.chatService.sendRoomMessage(id, roomId, body.content);
  }

  @Get('rooms/:roomId/members')
  async getMembers(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.chatService.getRoomMembers(roomId);
  }

  @Get('rooms/:roomId/messages')
  getMessages(
    @Req() req,
    @Param('roomId') roomId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.chatService.getMessages(+roomId, req.user.id, +page, +limit);
  }

  @Post('rooms/:roomId/read')
  markAsRead(@Req() req, @Param('roomId') roomId: number) {
    return this.chatService.markAsRead(+roomId, req.user.id);
  }
}
