// src/gambles/gambles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamblesService } from './gambles.service';
import { GamblesController } from './gambles.controller';
import { Gamble } from './entities/gamble.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gamble])],
  controllers: [GamblesController],
  providers: [GamblesService],
})
export class GamblesModule {}
