import { ParticipantsService } from './participants.service';
import { JoinParticipantDto, LeaveParticipantDto } from './dto';
export declare class ParticipantsController {
    private readonly participantsService;
    constructor(participantsService: ParticipantsService);
    join(req: any, dto: JoinParticipantDto): Promise<import("./participant.entity").Participant>;
    getParticipants(roomId: string): Promise<import("./participant.entity").Participant[]>;
    leave(req: any, dto: LeaveParticipantDto): Promise<void>;
}
