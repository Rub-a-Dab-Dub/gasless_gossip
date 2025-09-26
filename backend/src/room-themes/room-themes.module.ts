import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomThemesController } from './room-themes.controller';
import { RoomThemesService } from './room-themes.service';
import { RoomTheme } from './entities/room-theme.entity';
import { StellarModule } from '../stellar/stellar.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoomTheme]), StellarModule],
  controllers: [RoomThemesController],
  providers: [RoomThemesService],
  exports: [RoomThemesService],
})
export class RoomThemesModule {}