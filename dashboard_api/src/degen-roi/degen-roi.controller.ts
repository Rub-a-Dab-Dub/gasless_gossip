import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { DegenRoiService } from './degen-roi.service';
import { CreateWinRateDto } from './dto/create-win-rate.dto';
import { UpdateRoiCalcDto } from './dto/update-roi-calc.dto';
import { RiskMetricsQueryDto } from './dto/risk-metrics.dto';

@Controller('degen-roi')
export class DegenRoiController {
  constructor(private readonly roiService: DegenRoiService) {}

  @Post('win-rates')
  createWinRate(@Body() dto: CreateWinRateDto) {
    return this.roiService.createWinRate(dto);
  }

  @Get('risk-metrics')
  getRiskMetrics(@Query() query: RiskMetricsQueryDto) {
    return this.roiService.getRiskMetrics(query);
  }

  @Put('roi-calcs/:id')
  updateRoiCalc(@Param('id') id: string, @Body() dto: UpdateRoiCalcDto) {
    return this.roiService.updateRoiCalc(id, dto);
  }

  @Delete('anomaly-reports/:id')
  deleteAnomalyReport(@Param('id') id: string) {
    return this.roiService.deleteAnomalyReport(id);
  }

  @Get('outcome-queries/:roomCategory')
  getOutcomeQueries(@Param('roomCategory') roomCategory: string) {
    return this.roiService.getOutcomeQueries(roomCategory);
  }

  @Get('historical-compare/:roomCategory')
  getHistoricalComparison(@Param('roomCategory') roomCategory: string) {
    return this.roiService.getHistoricalComparison(roomCategory);
  }

  @Get('loss-alerts')
  getLossAlerts(@Query('roomCategory') roomCategory?: string) {
    return this.roiService.getLossAlerts(roomCategory);
  }
}