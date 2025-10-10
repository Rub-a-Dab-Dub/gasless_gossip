import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';

@Module({
  imports: [
    ConfigModule,
    EventEmitterModule.forRoot(),
  ],
  providers: [SessionService],
  controllers: [SessionController],
  exports: [SessionService],
})
export class SessionModule {}