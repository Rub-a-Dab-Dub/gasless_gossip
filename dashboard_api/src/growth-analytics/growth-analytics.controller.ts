import { Controller, Get, Post, Put, Delete, HttpCode, HttpStatus } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import type { GrowthAnalyticsService } from "./growth-analytics.service"
import type { CreateGrowthMetricDto } from "./dto/create-growth-metric.dto"
import type { UpdateGrowthMetricDto } from "./dto/update-growth-metric.dto"
import type { QueryGrowthMetricsDto } from "./dto/query-growth-metrics.dto"
import type { CreateCohortDto } from "./dto/create-cohort.dto"

@ApiTags("Growth Analytics")
@Controller("growth-analytics")
// @UseGuards(JwtAuthGuard) // Uncomment when auth is set up
// @ApiBearerAuth()
export class GrowthAnalyticsController {
  constructor(private readonly growthAnalyticsService: GrowthAnalyticsService) {}

  // Create: Average levels tracking
  @Post("metrics")
  @ApiOperation({ summary: "Create a new growth metric entry" })
  @ApiResponse({ status: 201, description: "Metric created successfully" })
  async createMetric(createDto: CreateGrowthMetricDto) {
    return await this.growthAnalyticsService.createMetric(createDto)
  }

  @Post("metrics/bulk")
  @ApiOperation({ summary: "Create multiple growth metrics at once" })
  @ApiResponse({ status: 201, description: "Metrics created successfully" })
  async createMetricsBulk(createDtos: CreateGrowthMetricDto[]) {
    return await this.growthAnalyticsService.createMetricsBulk(createDtos)
  }

  // Read: Unlock rates
  @Get("metrics")
  @ApiOperation({ summary: "Get growth metrics with filters" })
  @ApiResponse({ status: 200, description: "Metrics retrieved successfully" })
  async getMetrics(query: QueryGrowthMetricsDto) {
    return await this.growthAnalyticsService.getMetrics(query)
  }

  @Get("average-levels")
  @ApiOperation({ summary: "Get average user levels over time" })
  @ApiResponse({ status: 200, description: "Average levels retrieved successfully" })
  async getAverageLevels(startDate: string, endDate: string, cohortId?: string) {
    return await this.growthAnalyticsService.getAverageLevels(startDate, endDate, cohortId)
  }

  @Get("unlock-rates")
  @ApiOperation({ summary: "Get unlock rates over time" })
  @ApiResponse({ status: 200, description: "Unlock rates retrieved successfully" })
  async getUnlockRates(startDate: string, endDate: string, cohortId?: string) {
    return await this.growthAnalyticsService.getUnlockRates(startDate, endDate, cohortId)
  }

  // Update: Drop-off points
  @Put("metrics/:id")
  @ApiOperation({ summary: "Update a growth metric (e.g., drop-off points)" })
  @ApiResponse({ status: 200, description: "Metric updated successfully" })
  async updateMetric(id: string, updateDto: UpdateGrowthMetricDto) {
    return await this.growthAnalyticsService.updateMetric(id, updateDto)
  }

  @Get("drop-off-analysis")
  @ApiOperation({ summary: "Analyze drop-off points by level" })
  @ApiResponse({ status: 200, description: "Drop-off analysis retrieved successfully" })
  async getDropOffAnalysis(startDate: string, endDate: string, cohortId?: string) {
    return await this.growthAnalyticsService.getDropOffAnalysis(startDate, endDate, cohortId)
  }

  // Cohort CRUD
  @Post("cohorts")
  @ApiOperation({ summary: "Create a new cohort" })
  @ApiResponse({ status: 201, description: "Cohort created successfully" })
  async createCohort(createDto: CreateCohortDto) {
    return await this.growthAnalyticsService.createCohort(createDto)
  }

  @Get("cohorts")
  @ApiOperation({ summary: "Get all cohorts" })
  @ApiResponse({ status: 200, description: "Cohorts retrieved successfully" })
  async getCohorts() {
    return await this.growthAnalyticsService.getCohorts()
  }

  @Get("cohorts/:id")
  @ApiOperation({ summary: "Get a specific cohort" })
  @ApiResponse({ status: 200, description: "Cohort retrieved successfully" })
  async getCohort(id: string) {
    return await this.growthAnalyticsService.getCohort(id)
  }

  // Delete: Cohort analysis
  @Delete("cohorts/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a cohort" })
  @ApiResponse({ status: 204, description: "Cohort deleted successfully" })
  async deleteCohort(id: string) {
    return await this.growthAnalyticsService.deleteCohort(id)
  }

  @Get("cohorts/:id/analysis")
  @ApiOperation({ summary: "Get detailed analysis for a cohort" })
  @ApiResponse({ status: 200, description: "Cohort analysis retrieved successfully" })
  async getCohortAnalysis(id: string) {
    return await this.growthAnalyticsService.getCohortAnalysis(id)
  }

  // Chart JSON generation
  @Get("chart-data")
  @ApiOperation({ summary: "Get chart-ready JSON data for visualization" })
  @ApiResponse({ status: 200, description: "Chart data retrieved successfully" })
  async getChartData(startDate: string, endDate: string, cohortId?: string) {
    return await this.growthAnalyticsService.getChartData(startDate, endDate, cohortId)
  }

  // Plateau prediction
  @Get("predict-plateaus")
  @ApiOperation({ summary: "Predict user level plateaus using trend analysis" })
  @ApiResponse({ status: 200, description: "Plateau prediction retrieved successfully" })
  async predictPlateaus(cohortId?: string) {
    return await this.growthAnalyticsService.predictPlateaus(cohortId)
  }

  // Segmented levels
  @Get("segmented-levels")
  @ApiOperation({ summary: "Get user distribution across level segments" })
  @ApiResponse({ status: 200, description: "Segmented levels retrieved successfully" })
  async getSegmentedLevels(startDate: string, endDate: string) {
    return await this.growthAnalyticsService.getSegmentedLevels(startDate, endDate)
  }
}
