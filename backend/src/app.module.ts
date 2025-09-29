import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './notifications/notifications.module';
import { IntentGossipModule } from './intent-gossip/intent-gossip.module';
import { DataEncryptionModule } from './security/data-encryption.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(),
    NotificationsModule,
    IntentGossipModule,
    DataEncryptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
