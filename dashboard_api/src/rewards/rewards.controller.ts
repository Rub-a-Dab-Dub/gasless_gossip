import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CreateRewardConfigDto } from './dto/create-reward-config.dto';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('rewards')
@UseGuards(AdminGuard)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post('configs')
  create(@Body() dto: CreateRewardConfigDto) {
    return this.rewardsService.create(dto);
  }

  @Get('configs/:id/winners')
  selectWinners(@Param('id') id: string) {
    return this.rewardsService.selectWinners(id);
  }

  @Put('configs/:id/execute')
  executeRewardDrop(@Param('id') id: string) {
    return this.rewardsService.executeRewardDrop(id);
  }

  @Get('executions')
  getExecutionLogs() {
    return this.rewardsService.getExecutionLogs();
  }

  @Get('executions/:id/confirm')
  confirmExecution(@Param('id') id: string) {
    return this.rewardsService.confirmExecution(id);
  }

  @Delete('configs/:id')
  deleteConfig(@Param('id') id: string) {
    return this.rewardsService.deleteConfig(id);
  }
}