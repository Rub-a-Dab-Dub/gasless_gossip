import { Queue } from 'bull';
export declare class RoomExpiryService {
    private expiryQueue;
    constructor(expiryQueue: Queue);
    scheduleExpiry(roomId: string, expiresAt: Date): Promise<void>;
    cancelExpiry(roomId: string): Promise<void>;
}
