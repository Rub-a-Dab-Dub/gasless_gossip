import { Controller, Get, Post, Body, HttpStatus, HttpCode } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger"
import type { StellarService, BadgeUnlockTransaction } from "../services/stellar.service"

@ApiTags("stellar")
@Controller("stellar")
export class StellarController {
  constructor(private readonly stellarService: StellarService) {}

  @Post("badges/:userId/:badgeId/unlock")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Manually trigger badge unlock on Stellar" })
  @ApiParam({ name: "userId", description: "User UUID" })
  @ApiParam({ name: "badgeId", description: "Badge identifier" })
  @ApiResponse({
    status: 200,
    description: "Badge unlock initiated successfully",
  })
  @ApiResponse({
    status: 404,
    description: "User not found or no Stellar account",
  })
  async unlockBadge(userId: string, badgeId: string, @Body() body: { level: number }): Promise<BadgeUnlockTransaction> {
    // This would get the user's Stellar account ID
    const stellarAccountId = `GABC${userId.replace(/-/g, "").substring(0, 52).toUpperCase()}`

    return this.stellarService.unlockBadgeOnStellar(userId, stellarAccountId, badgeId, body.level)
  }

  @Get("badges/:userId/:badgeId/status")
  @ApiOperation({ summary: "Get badge unlock transaction status" })
  @ApiParam({ name: "userId", description: "User UUID" })
  @ApiParam({ name: "badgeId", description: "Badge identifier" })
  @ApiResponse({
    status: 200,
    description: "Badge unlock status retrieved successfully",
  })
  async getBadgeUnlockStatus(userId: string, badgeId: string): Promise<BadgeUnlockTransaction | null> {
    return this.stellarService.getBadgeUnlockStatus(userId, badgeId)
  }

  @Get("badges/:stellarAccountId/:badgeId/validate")
  @ApiOperation({ summary: "Validate badge ownership on Stellar network" })
  @ApiParam({ name: "stellarAccountId", description: "Stellar account ID" })
  @ApiParam({ name: "badgeId", description: "Badge identifier" })
  @ApiResponse({
    status: 200,
    description: "Badge ownership validation result",
    schema: {
      type: "object",
      properties: {
        stellarAccountId: { type: "string" },
        badgeId: { type: "string" },
        owns: { type: "boolean" },
      },
    },
  })
  async validateBadgeOwnership(
    stellarAccountId: string,
    badgeId: string,
  ): Promise<{ stellarAccountId: string; badgeId: string; owns: boolean }> {
    const owns = await this.stellarService.validateBadgeOwnership(stellarAccountId, badgeId)

    return {
      stellarAccountId,
      badgeId,
      owns,
    }
  }

  @Post("transactions/:transactionId/retry")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Retry failed badge unlock transaction" })
  @ApiParam({ name: "transactionId", description: "Transaction ID to retry" })
  @ApiResponse({
    status: 200,
    description: "Transaction retry initiated successfully",
  })
  async retryTransaction(transactionId: string): Promise<BadgeUnlockTransaction> {
    return this.stellarService.retryFailedBadgeUnlock(transactionId)
  }
}
