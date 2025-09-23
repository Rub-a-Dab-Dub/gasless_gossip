import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('reputation')
@Controller('reputation')
export class ReputationController {
  constructor(private readonly reputationService: ReputationService) {}

  @Post('add')
  @ApiOperation({ summary: 'Add reputation to a user' })
  @ApiResponse({ status: 200, description: 'Reputation added successfully' })
  async addReputation(@Body() dto: AddReputationDto) {
    return this.reputationService.addReputation(
      dto.user,
      dto.amount,
      dto.reason,
      dto.description
    );
  }

  @Get(':address')
  @ApiOperation({ summary: 'Get user reputation' })
  async getReputation(@Param('address') address: Address) {
    const reputation = await this.reputationService.getUserReputation(address);
    return { address, reputation };
  }

  @Get(':address/history')
  @ApiOperation({ summary: 'Get user reputation history' })
  async getReputationHistory(
    @Param('address') address: Address,
    @Query('limit') limit: number = 50,
    @Query('offset') offset: number = 0
  ) {
    return this.reputationService.getReputationHistory(address, limit, offset);
  }

  @Get(':address/privileges')
  @ApiOperation({ summary: 'Check user privileges based on reputation' })
  async getUserPrivileges(@Param('address') address: Address) {
    const [canCreateRoom, visibilityBoost] = await Promise.all([
      this.reputationService.canCreateRoom(address),
      this.reputationService.getVisibilityBoost(address)
    ]);

    return {
      address,
      privileges: {
        canCreateRoom,
        visibilityBoost
      }
    };
  }
}
