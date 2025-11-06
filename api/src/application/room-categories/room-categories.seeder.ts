import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomCategory } from './entities/room-category.entity';
import slugify from 'slugify';

@Injectable()
export class RoomCategoriesSeeder {
  private readonly logger = new Logger(RoomCategoriesSeeder.name);

  constructor(
    @InjectRepository(RoomCategory)
    private readonly roomCategoriesRepository: Repository<RoomCategory>,
  ) {}

  async seed() {
    const categories = [
      'General',
      'Crypto',
      'Sports',
      'Entertainment',
      'Education',
      'Tech',
    ];

    for (const title of categories) {
      const slug = slugify(title, { lower: true });
      const exists = await this.roomCategoriesRepository.findOneBy({ slug });
      if (!exists) {
        await this.roomCategoriesRepository.save({ title, slug });
        this.logger.log(`✅ Added category: ${title}`);
      }
    }

    this.logger.log('🌱 Room categories seeding completed.');
  }
}
