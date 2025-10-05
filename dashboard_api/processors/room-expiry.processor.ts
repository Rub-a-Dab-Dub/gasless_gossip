import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/room.entity';

@Processor('room-expiry')
export class RoomExpiryProcessor {
  constructor(
    @InjectRepository(Room)
    private roomRepo: Repository<Room>,
  ) {}

  @Process('expire-room')
  async handleExpiry(job: Job<{ roomId: string }>): Promise<void> {
    const { roomId } = job.data;

    const room = await this.roomRepo.findOne({ where: { id: roomId } });
    
    if (room && room.expiresAt && new Date() >= room.expiresAt) {
      await this.roomRepo.remove(room);
      console.log(`Room ${roomId} expired and deleted`);
    }
  }
}