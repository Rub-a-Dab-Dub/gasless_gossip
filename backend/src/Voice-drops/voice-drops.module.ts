import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { VoiceDrop } from './entities/voice-drop.entity';
import { VoiceDropsController } from './controllers/voice-drops.controller';
import { VoiceDropsService } from './services/voice-drops.service';
import { IpfsService } from './services/ipfs.service';
import { StellarService } from './services/stellar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VoiceDrop]),
    ConfigModule,
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  ],
  controllers: [VoiceDropsController],
  providers: [VoiceDropsService, IpfsService, StellarService],
  exports: [VoiceDropsService],
})
export class VoiceDropsModule {}
