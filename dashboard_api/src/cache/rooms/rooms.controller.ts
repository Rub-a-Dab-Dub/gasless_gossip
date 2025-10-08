import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '../cache/interceptors/cache.interceptor';
import { Cacheable } from '../cache/decorators/cacheable.decorator';
import { CacheInvalidationService } from '../cache/cache-invalidation.service';

@Controller('rooms')
@UseInterceptors(CacheInterceptor)
export class RoomsController {
  constructor(
    // private readonly roomsService: RoomsService,
    private readonly cacheInvalidation: CacheInvalidationService,
  ) {}

  @Get()
  @Cacheable({ key: 'rooms:all', ttl: 3600 }) // Cache for 1 hour
  async getAllRooms() {
    // return this.roomsService.findAll();
    return [
      { id: 1, name: 'Room A', capacity: 10 },
      { id: 2, name: 'Room B', capacity: 20 },
    ];
  }

  @Get(':id')
  @Cacheable({ key: 'room', ttl: 1800 }) // Cache for 30 minutes
  async getRoomById(@Param('id') id: number) {
    // return this.roomsService.findOne(id);
    return { id, name: 'Room A', capacity: 10 };
  }

  @Post()
  async createRoom(@Body() createRoomDto: any) {
    // const room = await this.roomsService.create(createRoomDto);
    await this.cacheInvalidation.invalidate('rooms:all');
    // return room;
    return { id: 3, ...createRoomDto };
  }

  @Put(':id')
  async updateRoom(@Param('id') id: number, @Body() updateRoomDto: any) {
    // const room = await this.roomsService.update(id, updateRoomDto);
    await this.cacheInvalidation.onRoomUpdated(id);
    // return room;
    return { id, ...updateRoomDto };
  }

  @Delete(':id')
  async deleteRoom(@Param('id') id: number) {
    // await this.roomsService.remove(id);
    await this.cacheInvalidation.onRoomDeleted(id);
    return { success: true };
  }
}