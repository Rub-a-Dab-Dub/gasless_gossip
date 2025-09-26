import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ReputationService } from './reputation.service';
import { UpdateReputationDto } from './dto/update-reputation.dto';

@Controller('reputation')
export class ReputationController {
  constructor(private readonly reputationService: ReputationService) {}

  @Get(':userId')
  async getReputation(@Param('userId') userId: string) {
    return this.reputationService.getReputation(Number(userId));
  }

  @Post('update')
  async updateReputation(@Body() dto: UpdateReputationDto) {
    return this.reputationService.updateReputation(dto);
  }

  @Post('calculate/:userId')
  async calculateReputation(@Param('userId') userId: string) {
    return this.reputationService.calculateReputationFromActions(Number(userId));
  }
}