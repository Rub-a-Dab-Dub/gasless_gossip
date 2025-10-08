import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { BanEvasionService } from './ban-evasion.service';
import { CreateBanRecordDto } from './dto/create-ban-record.dto';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { LogEvidenceDto } from './dto/log-evidence.dto';

@Controller('admin/ban-evasion')
@UseGuards(AdminGuard)
export class BanEvasionController {
  constructor(private readonly banEvasionService: BanEvasionService) {}

  @Post('scan')
  async scanForEvasion() {
    return this.banEvasionService.scanForEvasion();
  }

  @Post('ban')
  async createBanRecord(@Body() dto: CreateBanRecordDto) {
    return this.banEvasionService.createBanRecord(dto);
  }

  @Post('evidence/:banId')
  async logEvidence(
    @Param('banId') banId: string,
    @Body() dto: LogEvidenceDto
  ) {
    return this.banEvasionService.logEvidence(banId, dto);
  }

  @Get('appeals')
  async getAppealQueue(
    @Query('skip') skip?: number,
    @Query('take') take?: number
  ) {
    return this.banEvasionService.getAppealQueue(skip, take);
  }

  @Post('appeals')
  async submitAppeal(@Body() dto: CreateAppealDto) {
    return this.banEvasionService.submitAppeal(dto);
  }

  @Patch('appeals/:id/process')
  async processAppeal(
    @Param('id') id: string,
    @Body('approved') approved: boolean
  ) {
    return this.banEvasionService.processAppeal(id, approved);
  }
}