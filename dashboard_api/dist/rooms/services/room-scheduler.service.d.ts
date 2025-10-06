import { Repository } from 'typeorm';
import { Room } from '../../entities/room.entity';
export declare class RoomSchedulerService {
    private roomRepository;
    private readonly logger;
    private processingStats;
    constructor(roomRepository: Repository<Room>);
    processExpiredSecretRooms(): Promise<void>;
    private archiveExpiredRoom;
    private scheduleRoomDeletion;
    getProcessingStats(): typeof this.processingStats;
    resetStats(): void;
    manualCleanup(): Promise<{
        processed: number;
        successful: number;
        errors: number;
        errorRate: number;
    }>;
    private updateProcessingStats;
    private sendErrorRateAlert;
    private sleep;
}
