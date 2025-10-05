import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DegenRoiController } from './degen-roi.controller';
import { DegenRoiService } from './degen-roi.service';
import { DegenRoiEntity } from './entities/degen-roi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DegenRoiEntity])],
  controllers: [DegenRoiController],
  providers: [DegenRoiService],
  exports: [DegenRoiService],
})
export class DegenRoiModule {}