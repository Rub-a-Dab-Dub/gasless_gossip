import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymasterService } from './paymaster.service';
import { PaymasterController } from './paymaster.controller';

@Module({
  imports: [ConfigModule],
  providers: [PaymasterService],
  controllers: [PaymasterController],
  exports: [PaymasterService],
})
export class PaymasterModule {}
