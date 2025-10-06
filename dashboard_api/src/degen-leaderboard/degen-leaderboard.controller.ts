import { Controller, Get, Post, Put } from "@nestjs/common"
import type { DegenLeaderboardService } from "./degen-leaderboard.service"
import type { ComputeDegenDto } from "./dto/compute-degen.dto"
import type { QueryLeaderboardDto } from "./dto/query-leaderboard.dto"
import type { AwardBadgeDto } from "./dto/award-badge.dto"
import type { ResetCycleDto } from "./dto/reset-cycle.dto"

@Controller("degen-leaderboard")
export class DegenLeaderboardController {
  constructor(private readonly degenLeaderboardService: DegenLeaderboardService) {}

  @Post("compute")
  async computeDegen(dto: ComputeDegenDto) {
    return this.degenLeaderboardService.computeDegen(dto)
  }

  @Get("leaderboard")
  async getLeaderboard(query: QueryLeaderboardDto) {
    return this.degenLeaderboardService.getLeaderboard(query)
  }

  @Get("users/:userId/rank")
  async getUserRank(userId: string, category: string, cycleId?: string) {
    return this.degenLeaderboardService.getUserRank(userId, category, cycleId)
  }

  @Post("badges")
  async awardBadge(dto: AwardBadgeDto) {
    return this.degenLeaderboardService.awardBadge(dto)
  }

  @Get("users/:userId/badges")
  async getUserBadges(userId: string) {
    return this.degenLeaderboardService.getUserBadges(userId)
  }

  @Put("cycles/reset")
  async resetCycle(dto: ResetCycleDto) {
    return this.degenLeaderboardService.resetCycle(dto)
  }

  @Get("users/:userId/events")
  async getEvents(userId: string, limit?: number) {
    return this.degenLeaderboardService.getEvents(userId, limit)
  }

  @Get("events/export")
  async exportEvents(category: string, startDate: string, endDate: string) {
    return this.degenLeaderboardService.exportEvents(category, new Date(startDate), new Date(endDate))
  }
}
