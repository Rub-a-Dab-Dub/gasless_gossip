import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class RoomExpiryService {
  constructor(
    @InjectQueue('room-expiry')
    private expiryQueue: Queue,
  ) {}

  async scheduleExpiry(roomId: string, expiresAt: Date): Promise<void> {
    const delay = expiresAt.getTime() - Date.now();
    
    if (delay > 0) {
      await this.expiryQueue.add(
        'expire-room',
        { roomId },
        { delay },
      );
    }
  }

  async cancelExpiry(roomId: string): Promise<void> {
    const jobs = await this.expiryQueue.getJobs(['delayed', 'waiting']);
    const job = jobs.find(j => j.data.roomId === roomId);
    
    if (job) {
      await job.remove();
    }
  }
}