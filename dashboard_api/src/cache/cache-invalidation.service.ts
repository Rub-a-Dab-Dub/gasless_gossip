import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheInvalidationService {
  private readonly logger = new Logger(CacheInvalidationService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async invalidate(key: string): Promise<void> {
    await this.cacheManager.del(key);
    this.logger.log(`Invalidated cache key: ${key}`);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    // Note: Pattern matching requires redis store with scan support
    const store: any = this.cacheManager.store;
    if (store.keys) {
      const keys = await store.keys(pattern);
      await Promise.all(keys.map((key: string) => this.cacheManager.del(key)));
      this.logger.log(`Invalidated ${keys.length} keys matching pattern: ${pattern}`);
    }
  }

  async invalidateAll(): Promise<void> {
    await this.cacheManager.reset();
    this.logger.log('Invalidated all cache');
  }

  // Invalidation hooks for specific entities
  async onRoomUpdated(roomId: number): Promise<void> {
    await Promise.all([
      this.invalidate('rooms:all'),
      this.invalidate(`room:${roomId}`),
      this.invalidatePattern(`room:${roomId}:*`),
    ]);
  }

  async onRoomDeleted(roomId: number): Promise<void> {
    await this.onRoomUpdated(roomId);
  }
}
