import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Req,
  UseGuards,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from "@nestjs/swagger"
import type { Request } from "express"
import type { InvitationsService } from "../services/invitations.service"
import type { CreateInvitationDto } from "../dto/create-invitation.dto"
import type { AcceptInvitationDto } from "../dto/accept-invitation.dto"
import { InvitationResponseDto } from "../dto/invitation-response.dto"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import { RoomAccessGuard } from "../../auth/guards/room-access.guard"
import { plainToClass } from "class-transformer"

interface AuthenticatedRequest extends Request {
  user: {
    id: string
    username: string
    email: string
  }
}

@ApiTags("invitations")
@Controller("invitations")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new invitation for a secret room" })
  @ApiResponse({
    status: 201,
    description: "Invitation created successfully",
    type: InvitationResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ApiResponse({ status: 403, description: "No permission to invite to this room" })
  @ApiResponse({ status: 404, description: "Room not found" })
  async createInvitation(
    createInvitationDto: CreateInvitationDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<InvitationResponseDto> {
    const invitation = await this.invitationsService.createInvitation(createInvitationDto, req.user.id)

    return plainToClass(InvitationResponseDto, invitation, {
      excludeExtraneousValues: true,
    })
  }

  @Post("accept")
  @ApiOperation({ summary: "Accept an invitation using invitation code" })
  @ApiResponse({
    status: 200,
    description: "Invitation accepted successfully",
    schema: {
      type: "object",
      properties: {
        invitation: { $ref: "#/components/schemas/InvitationResponseDto" },
        participant: {
          type: "object",
          properties: {
            id: { type: "string" },
            roomId: { type: "string" },
            userId: { type: "string" },
            role: { type: "string" },
            status: { type: "string" },
            joinedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Invalid invitation code or invitation expired" })
  @ApiResponse({ status: 404, description: "Invitation not found" })
  @ApiResponse({ status: 409, description: "User already member of room" })
  async acceptInvitation(acceptInvitationDto: AcceptInvitationDto, @Req() req: AuthenticatedRequest) {
    const result = await this.invitationsService.acceptInvitation(
      acceptInvitationDto,
      acceptInvitationDto.userId || req.user.id,
    )

    return {
      invitation: plainToClass(InvitationResponseDto, result.invitation, {
        excludeExtraneousValues: true,
      }),
      participant: result.participant,
    }
  }

  @Get("room/:roomId")
  @ApiOperation({ summary: "Get all invitations for a specific room" })
  @ApiParam({ name: "roomId", description: "Room ID to get invitations for" })
  @ApiResponse({
    status: 200,
    description: "List of invitations for the room",
    type: [InvitationResponseDto],
  })
  @ApiResponse({ status: 403, description: "No access to this room" })
  @ApiResponse({ status: 404, description: "Room not found" })
  @UseGuards(RoomAccessGuard)
  async getInvitationsByRoom(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<InvitationResponseDto[]> {
    const invitations = await this.invitationsService.getInvitationsByRoom(roomId, req.user.id)

    return invitations.map((invitation) =>
      plainToClass(InvitationResponseDto, invitation, {
        excludeExtraneousValues: true,
      }),
    )
  }

  @Get("my-invitations")
  @ApiOperation({ summary: "Get all invitations created by the current user" })
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter by invitation status",
  })
  @ApiResponse({
    status: 200,
    description: "List of user's invitations",
    type: [InvitationResponseDto],
  })
  async getMyInvitations(
    @Req() req: AuthenticatedRequest,
    @Query('status') status?: string,
  ): Promise<InvitationResponseDto[]> {
    const invitations = await this.invitationsService.getInvitationsByUser(req.user.id)

    // Filter by status if provided
    const filteredInvitations = status ? invitations.filter((inv) => inv.status === status) : invitations

    return filteredInvitations.map((invitation) =>
      plainToClass(InvitationResponseDto, invitation, {
        excludeExtraneousValues: true,
      }),
    )
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get invitation details by code (for preview before accepting)' })
  @ApiParam({ name: 'code', description: 'Invitation code' })
  @ApiResponse({ 
    status: 200, 
    description: 'Invitation details',
    type: InvitationResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  async getInvitationByCode(
    @Param('code') code: string,
  ): Promise<InvitationResponseDto> {
    const invitation = await this.invitationsService.getInvitationByCode(code);

    return plainToClass(InvitationResponseDto, invitation, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(":invitationId/revoke")
  @ApiOperation({ summary: "Revoke an invitation" })
  @ApiParam({ name: "invitationId", description: "Invitation ID to revoke" })
  @ApiResponse({
    status: 200,
    description: "Invitation revoked successfully",
    type: InvitationResponseDto,
  })
  @ApiResponse({ status: 403, description: "No permission to revoke this invitation" })
  @ApiResponse({ status: 404, description: "Invitation not found" })
  @HttpCode(HttpStatus.OK)
  async revokeInvitation(
    @Param('invitationId', ParseUUIDPipe) invitationId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<InvitationResponseDto> {
    const invitation = await this.invitationsService.revokeInvitation(invitationId, req.user.id)

    return plainToClass(InvitationResponseDto, invitation, {
      excludeExtraneousValues: true,
    })
  }

  @Delete("cleanup-expired")
  @ApiOperation({ summary: "Clean up expired invitations (admin only)" })
  @ApiResponse({
    status: 200,
    description: "Expired invitations cleaned up",
    schema: {
      type: "object",
      properties: {
        cleanedUp: { type: "number", description: "Number of invitations cleaned up" },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async cleanupExpiredInvitations(): Promise<{ cleanedUp: number }> {
    const cleanedUp = await this.invitationsService.cleanupExpiredInvitations()
    return { cleanedUp }
  }

  @Get("stats/room/:roomId")
  @ApiOperation({ summary: "Get invitation statistics for a room" })
  @ApiParam({ name: "roomId", description: "Room ID to get stats for" })
  @ApiResponse({
    status: 200,
    description: "Invitation statistics",
    schema: {
      type: "object",
      properties: {
        totalInvitations: { type: "number" },
        pendingInvitations: { type: "number" },
        acceptedInvitations: { type: "number" },
        expiredInvitations: { type: "number" },
        revokedInvitations: { type: "number" },
        totalAcceptances: { type: "number" },
        uniqueInvitees: { type: "number" },
      },
    },
  })
  @UseGuards(RoomAccessGuard)
  async getRoomInvitationStats(@Param('roomId', ParseUUIDPipe) roomId: string, @Req() req: AuthenticatedRequest) {
    const invitations = await this.invitationsService.getInvitationsByRoom(roomId, req.user.id)

    const stats = {
      totalInvitations: invitations.length,
      pendingInvitations: invitations.filter((inv) => inv.status === "pending").length,
      acceptedInvitations: invitations.filter((inv) => inv.status === "accepted").length,
      expiredInvitations: invitations.filter((inv) => inv.status === "expired").length,
      revokedInvitations: invitations.filter((inv) => inv.status === "revoked").length,
      totalAcceptances: invitations.reduce((sum, inv) => sum + inv.usageCount, 0),
      uniqueInvitees: new Set(invitations.filter((inv) => inv.inviteeId).map((inv) => inv.inviteeId)).size,
    }

    return stats
  }
}
