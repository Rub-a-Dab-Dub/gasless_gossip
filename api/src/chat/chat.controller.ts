import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // adjust path if needed

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
}
