import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CacheWarmupService {
  private readonly logger = new Logger(CacheWarmupService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    // Inject your repositories here
    // @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}

  async warmCache(): Promise<void> {
    this.logger.log('Starting cache warmup...');
    
    try {
      await Promise.all([
        this.warmRoomsCache(),
        this.warmStatisticsCache(),
        // Add more warmup methods as needed
      ]);
      
      this.logger.log('Cache warmup completed successfully');
    } catch (error) {
      this.logger.error('Cache warmup failed', error);
    }
  }

  private async warmRoomsCache(): Promise<void> {
    // Example: Pre-load all rooms
    // const rooms = await this.roomRepository.find({ where: { isActive: true } });
    // await this.cacheManager.set('rooms:all', rooms, 3600 * 1000);
    
    // Example data for demonstration
    const rooms = [
      { id: 1, name: 'Conference Room A', capacity: 10 },
      { id: 2, name: 'Conference Room B', capacity: 20 },
    ];
    await this.cacheManager.set('rooms:all', rooms, 3600 * 1000);
    this.logger.log(`Warmed ${rooms.length} rooms in cache`);
  }

  private async warmStatisticsCache(): Promise<void> {
    // Pre-load dashboard statistics
    const stats = {
      totalRooms: 100,
      activeBookings: 45,
      availableRooms: 55,
    };
    await this.cacheManager.set('dashboard:stats', stats, 300 * 1000); // 5 min TTL
    this.logger.log('Warmed dashboard statistics in cache');
  }
}
