import { type Repository } from "typeorm";
import type { EventEmitter2 } from "@nestjs/event-emitter";
import { type Invitation } from "../entities/invitation.entity";
import { type RoomParticipant } from "../entities/room-participant.entity";
import { type CreateInvitationDto } from "../dto/create-invitation.dto";
import type { AcceptInvitationDto } from "../dto/accept-invitation.dto";
import type { CodeGeneratorService } from "./code-generator.service";
import type { RoomAccessService } from "./room-access.service";
export declare class InvitationsService {
    private invitationRepository;
    private participantRepository;
    private codeGenerator;
    private roomAccess;
    private eventEmitter;
    constructor(invitationRepository: Repository<Invitation>, participantRepository: Repository<RoomParticipant>, codeGenerator: CodeGeneratorService, roomAccess: RoomAccessService, eventEmitter: EventEmitter2);
    createInvitation(createDto: CreateInvitationDto, inviterId: string): Promise<Invitation>;
    acceptInvitation(acceptDto: AcceptInvitationDto, userId: string): Promise<{
        invitation: Invitation;
        participant: RoomParticipant;
    }>;
    getInvitationsByRoom(roomId: string, userId: string): Promise<Invitation[]>;
    getInvitationsByUser(userId: string): Promise<Invitation[]>;
    getInvitationByCode(code: string): Promise<Invitation>;
    revokeInvitation(invitationId: string, userId: string): Promise<Invitation>;
    cleanupExpiredInvitations(): Promise<number>;
    private generateUniqueCode;
    private calculateExpiryDate;
    private validateInvitation;
}
