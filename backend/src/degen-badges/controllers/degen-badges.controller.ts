import { Controller, Get, Post, Param, ParseUUIDPipe, HttpStatus } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger"
import type { DegenBadgesService } from "../services/degen-badges.service"
import type { AwardBadgeDto, BatchAwardBadgeDto } from "../dto/award-badge.dto"
import { DegenBadgeResponseDto, DegenBadgeStatsDto } from "../dto/degen-badge-response.dto"

@ApiTags("degen-badges")
@Controller("degen-badges")
export class DegenBadgesController {
  constructor(private readonly degenBadgesService: DegenBadgesService) {}

  @Post("award")
  @ApiOperation({ summary: "Award a degen badge to a user" })
  @ApiResponse({
    status!: HttpStatus.CREATED,
    description!: "Badge awarded successfully",
    type: DegenBadgeResponseDto,
  })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: "User already has this badge" })
  async awardBadge(awardBadgeDto: AwardBadgeDto): Promise<DegenBadgeResponseDto> {
    return this.degenBadgesService.awardBadge(awardBadgeDto)
  }

  @Post("award/batch")
  @ApiOperation({ summary: "Award badges to multiple users" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Badges awarded successfully",
    type: [DegenBadgeResponseDto],
  })
  async batchAwardBadges(batchAwardDto: BatchAwardBadgeDto): Promise<DegenBadgeResponseDto[]> {
    return this.degenBadgesService.batchAwardBadges(batchAwardDto)
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get all badges for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'User badges retrieved successfully',
    type: [DegenBadgeResponseDto] 
  })
  async getUserBadges(@Param('userId', ParseUUIDPipe) userId: string): Promise<DegenBadgeResponseDto[]> {
    return this.degenBadgesService.getUserBadges(userId);
  }

  @Get(':userId/stats')
  @ApiOperation({ summary: 'Get badge statistics for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ 
    status!: HttpStatus.OK, 
    description!: 'User badge stats retrieved successfully',
    type: DegenBadgeStatsDto 
  })
  async getUserBadgeStats(@Param('userId', ParseUUIDPipe) userId: string): Promise<DegenBadgeStatsDto> {
    return this.degenBadgesService.getUserBadgeStats(userId);
  }
}
