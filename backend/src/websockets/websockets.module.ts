import { TypeOrmModule } from '@nestjs/typeorm';
import { Message, Notification } from './websockets.entity';
import { Module } from '@nestjs/common';
import { WebSocketsGateway } from './websockets.gateway';
import { WebSocketsService } from './websockets.service';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [
    RoomsModule,
    TypeOrmModule.forFeature([Message, Notification]),
  ],
  providers: [WebSocketsGateway, WebSocketsService],
  exports: [WebSocketsService],
})
export class WebSocketsModule {}
