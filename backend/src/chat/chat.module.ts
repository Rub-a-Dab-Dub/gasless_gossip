import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { RoomsModule } from '../rooms/rooms.module';
import { PaymasterModule } from '../services/paymaster.module';

@Module({
  imports: [RoomsModule, PaymasterModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
