import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomCategory } from './entities/room-category.entity';
import { RoomCategoriesSeeder } from './room-categories.seeder';
import { RoomCategoriesService } from './room-categories.service';
import { RoomCategoriesController } from './room-categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoomCategory])],
  controllers: [RoomCategoriesController],
  providers: [RoomCategoriesService, RoomCategoriesSeeder],
  exports: [RoomCategoriesSeeder],
})
export class RoomCategoriesModule {}
