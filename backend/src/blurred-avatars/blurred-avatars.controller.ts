import { Body, Controller, Get, Param, Post, ParseUUIDPipe } from '@nestjs/common';
import { BlurredAvatarsService } from './blurred-avatars.service';
import { CreateBlurredAvatarDto } from './dto/create-blurred-avatar.dto';

@Controller('avatars')
export class BlurredAvatarsController {
  constructor(private readonly blurredAvatarsService: BlurredAvatarsService) {}

  @Post('blur')
  async create(@Body() body: CreateBlurredAvatarDto) {
    const { userId, blurLevel, imageUrl } = body;
    return await this.blurredAvatarsService.create(userId, blurLevel, imageUrl);
  }

  @Get('blurred/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return await this.blurredAvatarsService.findByUserId(userId);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.blurredAvatarsService.findById(id);
  }
}
