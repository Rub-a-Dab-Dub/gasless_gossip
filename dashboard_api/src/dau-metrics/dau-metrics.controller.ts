import { Controller, Get, Post, Put, Delete, HttpCode, HttpStatus } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger"
import type { DauMetricsService } from "./dau-metrics.service"
import type { CreateDauMetricDto } from "./dto/create-dau-metric.dto"
import type { UpdateDauMetricDto } from "./dto/update-dau-metric.dto"
import type { QueryDauMetricsDto } from "./dto/query-dau-metrics.dto"
import type { TrackFeatureUsageDto } from "./dto/track-feature-usage.dto"

@ApiTags("DAU Metrics")
@Controller("dau-metrics")
// @UseGuards(JwtAuthGuard) // Uncomment when auth is set up
// @ApiBearerAuth()
export class DauMetricsController {
  constructor(private readonly dauMetricsService: DauMetricsService) {}

  // Create: Compute DAU
  @Post("compute")
  @ApiOperation({ summary: "Compute DAU for a specific date and feature" })
  @ApiResponse({ status: 201, description: "DAU computed successfully" })
  async computeDau(createDto: CreateDauMetricDto) {
    return await this.dauMetricsService.computeDau(createDto)
  }

  @Post("compute/bulk")
  @ApiOperation({ summary: "Compute DAU for multiple dates/features at once" })
  @ApiResponse({ status: 201, description: "DAU metrics computed successfully" })
  async computeDauBulk(createDtos: CreateDauMetricDto[]) {
    return await this.dauMetricsService.computeDauBulk(createDtos)
  }

  @Post("compute/from-usage")
  @ApiOperation({ summary: "Compute DAU from raw feature usage data" })
  @ApiResponse({ status: 201, description: "DAU computed from usage data" })
  async computeDauFromUsage(date: string, timezone?: string) {
    return await this.dauMetricsService.computeDauFromUsage(date, timezone)
  }

  @Post("track")
  @ApiOperation({ summary: "Track individual feature usage (for real-time DAU)" })
  @ApiResponse({ status: 201, description: "Feature usage tracked successfully" })
  async trackFeatureUsage(trackDto: TrackFeatureUsageDto) {
    return await this.dauMetricsService.trackFeatureUsage(trackDto)
  }

  // Read: Breakdown charts
  @Get("breakdown")
  @ApiOperation({ summary: "Get DAU breakdown by features" })
  @ApiResponse({ status: 200, description: "DAU breakdown retrieved successfully" })
  async getDauBreakdown(query: QueryDauMetricsDto) {
    return await this.dauMetricsService.getDauBreakdown(query)
  }

  @Get("metrics")
  @ApiOperation({ summary: "Get DAU metrics with pagination" })
  @ApiResponse({ status: 200, description: "Metrics retrieved successfully" })
  async getMetrics(query: QueryDauMetricsDto) {
    return await this.dauMetricsService.getMetrics(query)
  }

  // Update: Historical trends
  @Put("metrics/:id")
  @ApiOperation({ summary: "Update a DAU metric" })
  @ApiResponse({ status: 200, description: "Metric updated successfully" })
  @ApiParam({ name: "id", description: "Metric ID" })
  async updateMetric(id: string, updateDto: UpdateDauMetricDto) {
    return await this.dauMetricsService.updateMetric(id, updateDto)
  }

  @Get("trends")
  @ApiOperation({ summary: "Get historical DAU trends" })
  @ApiResponse({ status: 200, description: "Historical trends retrieved successfully" })
  async getHistoricalTrends(startDate: string, endDate: string, timezone?: string) {
    return await this.dauMetricsService.getHistoricalTrends(startDate, endDate, timezone)
  }

  @Get("drilldown")
  @ApiOperation({ summary: "Get feature-level drilldown analysis" })
  @ApiResponse({ status: 200, description: "Feature drilldown retrieved successfully" })
  async getFeatureDrilldown(startDate: string, endDate: string, timezone?: string) {
    return await this.dauMetricsService.getFeatureDrilldown(startDate, endDate, timezone)
  }

  // Delete: Alert drops
  @Get("alerts")
  @ApiOperation({ summary: "Get all DAU alerts" })
  @ApiResponse({ status: 200, description: "Alerts retrieved successfully" })
  async getAlerts(isResolved?: boolean) {
    return await this.dauMetricsService.getAlerts(isResolved)
  }

  @Delete("alerts/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a DAU alert" })
  @ApiResponse({ status: 204, description: "Alert deleted successfully" })
  @ApiParam({ name: "id", description: "Alert ID" })
  async deleteAlert(id: string) {
    return await this.dauMetricsService.deleteAlert(id)
  }

  @Put("alerts/:id/resolve")
  @ApiOperation({ summary: "Mark an alert as resolved" })
  @ApiResponse({ status: 200, description: "Alert resolved successfully" })
  @ApiParam({ name: "id", description: "Alert ID" })
  async resolveAlert(id: string) {
    return await this.dauMetricsService.resolveAlert(id)
  }

  // Chart JSON generation
  @Get("chart-data")
  @ApiOperation({ summary: "Get chart-ready JSON data for visualization" })
  @ApiResponse({ status: 200, description: "Chart data retrieved successfully" })
  async getChartData(startDate: string, endDate: string, timezone?: string) {
    return await this.dauMetricsService.getChartData(startDate, endDate, timezone)
  }
}
