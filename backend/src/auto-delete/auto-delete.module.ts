import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoDelete } from './entities/auto-delete.entity';
import { AutoDeleteService } from './services/auto-delete.service';
import { AutoDeleteController } from './controllers/auto-delete.controller';
import { Message } from '../messages/message.entity';
import { StellarService } from '../stellar/stellar.service';

@Module({
  imports: [TypeOrmModule.forFeature([AutoDelete, Message])],
  controllers: [AutoDeleteController],
  providers: [AutoDeleteService, StellarService],
  exports: [AutoDeleteService],
})
export class AutoDeleteModule {}


