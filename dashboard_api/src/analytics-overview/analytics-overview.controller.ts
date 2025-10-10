import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseDatePipe,
  UseInterceptors,
  CacheInterceptor,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsOverviewService } from './analytics-overview.service';
import { CreateSnapshotDto } from './dto/create-snapshot.dto';
import { AnalyticsSnapshot } from './entities/analytics-snapshot.entity';

@ApiTags('Analytics Overview')
@Controller('analytics-overview')
@UseInterceptors(CacheInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
export class AnalyticsOverviewController {
  constructor(private readonly analyticsService: AnalyticsOverviewService) {}

  @Post('snapshots')
  @ApiOperation({ summary: 'Create a new analytics snapshot' })
  @ApiResponse({ status: 201, type: AnalyticsSnapshot })
  async createSnapshot(
    @Body() createSnapshotDto: CreateSnapshotDto,
  ): Promise<AnalyticsSnapshot> {
    return this.analyticsService.createSnapshot(createSnapshotDto);
  }

  @Get('daily-metrics')
  @ApiOperation({ summary: 'Get latest daily metrics' })
  @ApiResponse({ status: 200 })
  async getDailyMetrics() {
    return this.analyticsService.getDailyMetrics();
  }

  @Get('time-series')
  @ApiOperation({ summary: 'Get time-series data for a metric' })
  @ApiQuery({ name: 'metricType', required: true })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  @ApiResponse({ status: 200, type: [AnalyticsSnapshot] })
  async getTimeSeries(
    @Query('metricType') metricType: string,
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
  ) {
    return this.analyticsService.getTimeSeries(metricType, startDate, endDate);
  }

  @Get('cohort-breakdown')
  @ApiOperation({ summary: 'Get cohort breakdown analysis' })
  @ApiQuery({ name: 'cohortId', required: true })
  @ApiResponse({ status: 200 })
  async getCohortBreakdown(@Query('cohortId') cohortId: string) {
    return this.analyticsService.getCohortBreakdown(cohortId);
  }
}