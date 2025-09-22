import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BlurredAvatarsService } from './blurred-avatars.service';

@Controller('avatars')
export class BlurredAvatarsController {
  constructor(private readonly blurredAvatarsService: BlurredAvatarsService) {}

  // POST /avatars/blur
  @Post('blur')
  create(@Body() body: { userId: string; blurLevel: number; imageUrl: string }) {
    const { userId, blurLevel, imageUrl } = body;
    return this.blurredAvatarsService.create(userId, blurLevel, imageUrl);
  }

  // GET /avatars/blurred/:userId
  @Get('blurred/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.blurredAvatarsService.findByUserId(userId);
  }
}
