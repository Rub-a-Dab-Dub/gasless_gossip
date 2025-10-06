import { Repository } from 'typeorm';
import { Participant } from '../entities/participant.entity';
export declare class RoomExportService {
    private participantRepo;
    constructor(participantRepo: Repository<Participant>);
    exportParticipantActivity(roomId: string): Promise<string>;
}
