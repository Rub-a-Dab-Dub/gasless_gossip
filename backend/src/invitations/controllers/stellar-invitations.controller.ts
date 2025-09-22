import { Controller, Get, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import type { StellarInvitationService } from "../services/stellar-invitation.service"
import type { EnhancedInvitationsService } from "../services/enhanced-invitations.service"

@ApiTags("stellar-invitations")
@Controller("stellar-invitations")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StellarInvitationsController {
  constructor(
    private readonly stellarService: StellarInvitationService,
    private readonly enhancedInvitationsService: EnhancedInvitationsService,
  ) {}

  @Get("health")
  @ApiOperation({ summary: "Check Stellar service health" })
  @ApiResponse({ status: 200, description: "Stellar service health status" })
  async getStellarHealth() {
    return this.stellarService.healthCheck()
  }

  @Get("balance")
  @ApiOperation({ summary: "Get Stellar account balance" })
  @ApiResponse({ status: 200, description: "Account balance information" })
  async getAccountBalance() {
    return this.stellarService.getAccountBalance()
  }

  @Get("verify/:invitationId")
  @ApiOperation({ summary: "Verify invitation integrity between database and Stellar" })
  @ApiResponse({ status: 200, description: "Invitation integrity verification result" })
  async verifyInvitationIntegrity(invitationId: string) {
    return this.enhancedInvitationsService.verifyInvitationIntegrity(invitationId)
  }

  @Get("audit/:invitationId")
  @ApiOperation({ summary: "Get complete audit trail for an invitation" })
  @ApiResponse({ status: 200, description: "Invitation audit trail" })
  async getInvitationAuditTrail(invitationId: string) {
    return this.enhancedInvitationsService.getInvitationAuditTrail(invitationId)
  }

  @Get("room-access/:roomId/:userId")
  @ApiOperation({ summary: "Verify room access on Stellar blockchain" })
  @ApiResponse({ status: 200, description: "Room access verification result" })
  async verifyRoomAccess(roomId: string, userId: string) {
    const hasAccess = await this.enhancedInvitationsService.verifyRoomAccessOnChain(roomId, userId)
    return { hasAccess, roomId, userId }
  }

  @Get("history/:invitationId")
  @ApiOperation({ summary: "Get Stellar transaction history for an invitation" })
  @ApiResponse({ status: 200, description: "Stellar transaction history" })
  async getInvitationHistory(invitationId: string) {
    return this.stellarService.getInvitationHistory(invitationId)
  }
}
