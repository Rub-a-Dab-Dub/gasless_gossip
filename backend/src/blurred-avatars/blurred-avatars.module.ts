

    import { Module } from '@nestjs/common';
import { BlurredAvatarsService } from './blurred-avatars.service';
import { BlurredAvatarsController } from './blurred-avatars.controller';

@Module({
  controllers: [BlurredAvatarsController],
  providers: [BlurredAvatarsService],
})
export class BlurredAvatarsModule {}

    
