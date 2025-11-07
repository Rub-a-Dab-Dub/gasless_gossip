import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomCategory } from './entities/room-category.entity';
import { CreateRoomCategoryDto } from './dtos/create-room-category.dto';
import { UpdateRoomCategoryDto } from './dtos/update-room-category.dto';

@Injectable()
export class RoomCategoriesService {
  constructor(
    @InjectRepository(RoomCategory)
    private readonly roomCategoriesRepository: Repository<RoomCategory>,
  ) {}

  async create(dto: CreateRoomCategoryDto) {
    const category = this.roomCategoriesRepository.create(dto);
    return this.roomCategoriesRepository.save(category);
  }

  async findAll() {
    return this.roomCategoriesRepository.find({ relations: ['rooms'] });
  }

  async findOne(id: number) {
    const cat = await this.roomCategoriesRepository.findOne({
      where: { id },
      relations: ['rooms'],
    });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async update(id: number, dto: UpdateRoomCategoryDto) {
    const cat = await this.findOne(id);
    Object.assign(cat, dto);
    return this.roomCategoriesRepository.save(cat);
  }

  async remove(id: number) {
    const cat = await this.findOne(id);
    return this.roomCategoriesRepository.remove(cat);
  }
}
