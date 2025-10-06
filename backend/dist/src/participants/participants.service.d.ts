import { Repository } from 'typeorm';
import { Participant } from './participant.entity';
import { JoinParticipantDto, LeaveParticipantDto } from './dto/participant.dto';
export declare class ParticipantsService {
    private readonly participantRepo;
    constructor(participantRepo: Repository<Participant>);
    join(userId: string, dto: JoinParticipantDto): Promise<Participant>;
    findByRoom(roomId: string): Promise<Participant[]>;
    leave(userId: string, dto: LeaveParticipantDto): Promise<void>;
}
