import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialSharingController } from './social-sharing.controller';
import { SocialSharingService } from './social-sharing.service';
import { Share } from './entities/share.entity';
import { User } from '../users/entities/user.entity';
import { XpModule } from '../xp/xp.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Share, User]),
    XpModule,
  ],
  controllers: [SocialSharingController],
  providers: [SocialSharingService],
  exports: [SocialSharingService],
})
export class SocialSharingModule {}
