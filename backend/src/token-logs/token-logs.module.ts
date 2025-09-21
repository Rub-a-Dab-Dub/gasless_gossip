import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenLog } from './token-log.entity';
import { TokenLogsService } from './token-logs.service';
import { TokenLogsController } from './token-logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TokenLog])],
  providers: [TokenLogsService],
  controllers: [TokenLogsController],
  exports: [TokenLogsService],
})
export class TokenLogsModule {}
