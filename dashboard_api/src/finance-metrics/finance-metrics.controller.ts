import { Controller, Post, Get, Patch, Delete, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FinanceMetricsService } from './finance-metrics.service';
import { DateRangeQuery, TopUsersQuery, ComparePeriodsQuery } from './dto/query.dto';
import { ROIComparisonResponse, TopUserResponse, TrendForecastResponse } from './dto/response.dto';
import { DailyAggregate } from './entities/daily-aggregate.entity';

@ApiTags('Finance Metrics')
@Controller('finance-metrics')
export class FinanceMetricsController {
  constructor(private readonly financeMetricsService: FinanceMetricsService) {}

  @Post('daily-aggregate')
  @ApiOperation({ summary: 'Create daily aggregate metrics' })
  @ApiResponse({ status: 201, type: DailyAggregate })
  createDailyAggregate(@Query('date') date: string): Promise<DailyAggregate> {
    return this.financeMetricsService.createDailyAggregate(new Date(date));
  }

  @Get('top-users')
  @ApiOperation({ summary: 'Get top users by volume within date range' })
  @ApiResponse({ status: 200, type: [TopUserResponse] })
  getTopUsers(@Query() query: TopUsersQuery): Promise<TopUserResponse[]> {
    return this.financeMetricsService.getTopUsers(
      new Date(query.startDate),
      new Date(query.endDate),
      query.limit,
    );
  }

  @Patch(':id/trend-forecast')
  @ApiOperation({ summary: 'Update trend forecast for specific aggregate' })
  @ApiResponse({ status: 200, type: TrendForecastResponse })
  updateTrendForecast(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TrendForecastResponse> {
    return this.financeMetricsService.updateTrendForecast(id);
  }

  @Delete(':id/spike')
  @ApiOperation({ summary: 'Delete spike alert' })
  @ApiResponse({ status: 204 })
  deleteSpike(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.financeMetricsService.deleteSpikeAlert(id);
  }

  @Get('roi-comparison')
  @ApiOperation({ summary: 'Compare ROI between two periods' })
  @ApiResponse({ status: 200, type: ROIComparisonResponse })
  compareROI(@Query() query: ComparePeriodsQuery): Promise<ROIComparisonResponse> {
    return this.financeMetricsService.compareROI(
      new Date(query.period1Start),
      new Date(query.period1End),
      new Date(query.period2Start),
      new Date(query.period2End),
    );
  }
}