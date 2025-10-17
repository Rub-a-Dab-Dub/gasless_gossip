import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RoomCategoriesService } from './room-categories.service';
import { CreateRoomCategoryDto } from './dtos/create-room-category.dto';
import { UpdateRoomCategoryDto } from './dtos/update-room-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('room-categories')
@UseGuards(JwtAuthGuard)
export class RoomCategoriesController {
  constructor(private readonly roomCategoriesService: RoomCategoriesService) {}

  @Post()
  create(@Body() dto: CreateRoomCategoryDto) {
    return this.roomCategoriesService.create(dto);
  }

  @Get()
  findAll() {
    return this.roomCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomCategoriesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoomCategoryDto,
  ) {
    return this.roomCategoriesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomCategoriesService.remove(id);
  }
}
