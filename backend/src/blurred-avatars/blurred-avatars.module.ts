import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlurredAvatarsService } from './blurred-avatars.service';
import { BlurredAvatarsController } from './blurred-avatars.controller';
import { BlurredAvatar } from './blurred-avatar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlurredAvatar])],
  controllers: [BlurredAvatarsController],
  providers: [BlurredAvatarsService],
})
export class BlurredAvatarsModule {}
