import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { BlurredAvatarsService } from './blurred-avatars.service';
import { CreateBlurredAvatarDto } from './dto/create-blurred-avatar.dto';
import { UpdateBlurredAvatarDto } from './dto/update-blurred-avatar.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('avatars')
@UseGuards(AuthGuard)
export class BlurredAvatarsController {
  constructor(private readonly blurredAvatarsService: BlurredAvatarsService) {}

  @Post('blur')
  @HttpCode(HttpStatus.CREATED)
  async createBlurredAvatar(@Body() createBlurredAvatarDto: CreateBlurredAvatarDto) {
    const avatar = await this.blurredAvatarsService.createBlurredAvatar(createBlurredAvatarDto);
    return {
      success: true,
      message: 'Blurred avatar created successfully',
      data: avatar,
    };
  }

  @Get('blurred/:userId')
  @HttpCode(HttpStatus.OK)
  async getBlurredAvatars(@Param('userId') userId: string, @Query('latest') latest?: string) {
    if (latest === 'true') {
      const avatar = await this.blurredAvatarsService.findLatestByUserId(userId);
      return {
        success: true,
        message: avatar ? 'Latest blurred avatar retrieved successfully' : 'No blurred avatar found',
        data: avatar,
      };
    }

    const avatars = await this.blurredAvatarsService.findAllByUserId(userId);
    return {
      success: true,
      message: 'Blurred avatars retrieved successfully',
      data: avatars,
    };
  }

  @Get('blurred/:userId/stats')
  @HttpCode(HttpStatus.OK)
  async getBlurredAvatarStats(@Param('userId') userId: string) {
    const stats = await this.blurredAvatarsService.getBlurredAvatarStats(userId);
    return {
      success: true,
      message: 'Blurred avatar stats retrieved successfully',
      data: stats,
    };
  }

  @Patch('blur/:id')
  @HttpCode(HttpStatus.OK)
  async updateBlurredAvatar(
    @Param('id') id: string,
    @Body() updateBlurredAvatarDto: UpdateBlurredAvatarDto,
  ) {
    const avatar = await this.blurredAvatarsService.updateBlurredAvatar(id, updateBlurredAvatarDto);
    return {
      success: true,
      message: 'Blurred avatar updated successfully',
      data: avatar,
    };
  }

  @Delete('blur/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeBlurredAvatar(@Param('id') id: string) {
    await this.blurredAvatarsService.remove(id);
    return {
      success: true,
      message: 'Blurred avatar removed successfully',
    };
  }
}
