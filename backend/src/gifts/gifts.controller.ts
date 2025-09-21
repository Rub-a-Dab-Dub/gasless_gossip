import { Controller, Post, Body, Get, Param, Request, UseGuards } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { SendGiftDto } from './dto/send-gift.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('gifts')
// @UseGuards(JwtAuthGuard)
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  @Post('send')
  async sendGift(@Request() req, @Body() dto: SendGiftDto) {
    // const senderId = req.user.id;
    const senderId = 'mock-user-id'; // Replace with real auth
    return this.giftsService.sendGift(senderId, dto);
  }

  @Get(':userId')
  async getGifts(@Param('userId') userId: string) {
    return this.giftsService.getGiftsForUser(userId);
  }
}