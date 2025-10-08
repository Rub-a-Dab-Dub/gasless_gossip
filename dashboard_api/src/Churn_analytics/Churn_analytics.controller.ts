import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('churn-analytics')
@Controller('analytics/churn')
export class ChurnAnalyticsController {
  constructor(private readonly churnService: ChurnAnalyticsService) {}

  @Post('cohorts')
  @ApiOperation({ summary: 'Create a new cohort for analysis' })
  @ApiResponse({ status: 201, description: 'Cohort created successfully' })
  async createCohort(@Body() dto: CreateCohortDto) {
    return this.churnService.createCohort(dto);
  }

  @Get('cohorts')
  @ApiOperation({ summary: 'List all cohorts' })
  async listCohorts() {
    return this.churnService.listCohorts();
  }

  @Get('cohorts/:cohortId/retention')
  @ApiOperation({ summary: 'Get retention curves and feature attribution' })
  @ApiResponse({ status: 200, description: 'Returns chart-ready retention data' })
  async getRetentionCurves(@Param('cohortId') cohortId: string) {
    return this.churnService.getRetentionCurves(cohortId);
  }

  @Put('cohorts/:cohortId/drill-down')
  @ApiOperation({ summary: 'Drill down into cohort segments' })
  @ApiResponse({ status: 200, description: 'Returns segmented analysis' })
  async drillDownSegments(
    @Param('cohortId') cohortId: string,
    @Body() dto: DrillDownSegmentDto,
  ) {
    return this.churnService.drillDownSegments(cohortId, dto);
  }

  @Delete('predict-churn')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Predict user churn and remove from active analysis' })
  @ApiResponse({ status: 200, description: 'Returns churn predictions' })
  async predictChurn(@Body() dto: PredictChurnDto) {
    return this.churnService.predictChurn(dto);
  }

  @Delete('cohorts/:cohortId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a cohort' })
  async deleteCohort(@Param('cohortId') cohortId: string) {
    await this.churnService.deleteCohort(cohortId);
  }
}
