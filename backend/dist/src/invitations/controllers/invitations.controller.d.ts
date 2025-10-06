import type { Request } from "express";
import type { InvitationsService } from "../services/invitations.service";
import type { CreateInvitationDto } from "../dto/create-invitation.dto";
import type { AcceptInvitationDto } from "../dto/accept-invitation.dto";
import { InvitationResponseDto } from "../dto/invitation-response.dto";
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        username: string;
        email: string;
    };
}
export declare class InvitationsController {
    private readonly invitationsService;
    constructor(invitationsService: InvitationsService);
    createInvitation(createInvitationDto: CreateInvitationDto, req: AuthenticatedRequest): Promise<InvitationResponseDto>;
    acceptInvitation(acceptInvitationDto: AcceptInvitationDto, req: AuthenticatedRequest): Promise<{
        invitation: InvitationResponseDto;
        participant: import("../entities/room-participant.entity").RoomParticipant;
    }>;
    getInvitationsByRoom(roomId: string, req: AuthenticatedRequest): Promise<InvitationResponseDto[]>;
    getMyInvitations(req: AuthenticatedRequest, status?: string): Promise<InvitationResponseDto[]>;
    getInvitationByCode(code: string): Promise<InvitationResponseDto>;
    revokeInvitation(invitationId: string, req: AuthenticatedRequest): Promise<InvitationResponseDto>;
    cleanupExpiredInvitations(): Promise<{
        cleanedUp: number;
    }>;
    getRoomInvitationStats(roomId: string, req: AuthenticatedRequest): Promise<{
        totalInvitations: number;
        pendingInvitations: number;
        acceptedInvitations: number;
        expiredInvitations: number;
        revokedInvitations: number;
        totalAcceptances: number;
        uniqueInvitees: number;
    }>;
}
export {};
