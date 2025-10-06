import { Job } from 'bull';
import { Repository } from 'typeorm';
import { Room } from '../entities/room.entity';
export declare class RoomExpiryProcessor {
    private roomRepo;
    constructor(roomRepo: Repository<Room>);
    handleExpiry(job: Job<{
        roomId: string;
    }>): Promise<void>;
}
