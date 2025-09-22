import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hook } from './hook.entity';
import { HooksService } from './hooks.service';
import { HooksController } from './hooks.controller';
import { WebSocketsModule } from '../websockets/websockets.module';

@Module({
  imports: [TypeOrmModule.forFeature([Hook]), WebSocketsModule],
  providers: [HooksService],
  controllers: [HooksController],
  exports: [HooksService],
})
export class HooksModule {}
