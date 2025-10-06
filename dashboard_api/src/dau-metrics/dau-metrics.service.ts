import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { DauMetric } from "./entities/dau-metric.entity"
import type { DauAlert } from "./entities/dau-alert.entity"
import type { FeatureUsage } from "./entities/feature-usage.entity"
import type { CreateDauMetricDto } from "./dto/create-dau-metric.dto"
import type { UpdateDauMetricDto } from "./dto/update-dau-metric.dto"
import type { QueryDauMetricsDto } from "./dto/query-dau-metrics.dto"
import type { TrackFeatureUsageDto } from "./dto/track-feature-usage.dto"
import type { DauBreakdownDto, HistoricalTrendDto, FeatureDrilldownDto, AlertDropDto } from "./dto/dau-response.dto"

@Injectable()
export class DauMetricsService {
  private dauMetricRepository: Repository<DauMetric>
  private dauAlertRepository: Repository<DauAlert>
  private featureUsageRepository: Repository<FeatureUsage>

  constructor(
    dauMetricRepository: Repository<DauMetric>,
    dauAlertRepository: Repository<DauAlert>,
    featureUsageRepository: Repository<FeatureUsage>,
  ) {
    this.dauMetricRepository = dauMetricRepository
    this.dauAlertRepository = dauAlertRepository
    this.featureUsageRepository = featureUsageRepository
  }

  // Create: Compute DAU
  async computeDau(createDto: CreateDauMetricDto): Promise<DauMetric> {
    const metric = this.dauMetricRepository.create({
      ...createDto,
      timezone: createDto.timezone || "UTC",
    })
    const saved = await this.dauMetricRepository.save(metric)

    // Check for alerts after computing DAU
    await this.checkForAlerts(saved)

    return saved
  }

  async computeDauBulk(createDtos: CreateDauMetricDto[]): Promise<DauMetric[]> {
    const metrics = this.dauMetricRepository.create(
      createDtos.map((dto) => ({
        ...dto,
        timezone: dto.timezone || "UTC",
      })),
    )
    const saved = await this.dauMetricRepository.save(metrics)

    // Check for alerts for all saved metrics
    await Promise.all(saved.map((metric) => this.checkForAlerts(metric)))

    return saved
  }

  // Track individual feature usage (for real-time DAU computation)
  async trackFeatureUsage(trackDto: TrackFeatureUsageDto): Promise<FeatureUsage> {
    const now = new Date()
    const timezone = trackDto.timezone || "UTC"

    // Convert to user's timezone for date calculation
    const usageDate = this.getDateInTimezone(now, timezone)

    const usage = this.featureUsageRepository.create({
      userId: trackDto.userId,
      featureName: trackDto.featureName,
      usageDate,
      usageTimestamp: now,
      timezone,
      sessionId: trackDto.sessionId,
      durationSeconds: trackDto.durationSeconds,
      isNewUser: trackDto.isNewUser || false,
      metadata: trackDto.metadata,
    })

    return await this.featureUsageRepository.save(usage)
  }

  // Read: Breakdown charts
  async getDauBreakdown(query: QueryDauMetricsDto): Promise<DauBreakdownDto[]> {
    const { featureName, startDate, endDate, timezone } = query

    const queryBuilder = this.dauMetricRepository.createQueryBuilder("metric")

    if (featureName) {
      queryBuilder.andWhere("metric.featureName = :featureName", { featureName })
    }

    if (timezone) {
      queryBuilder.andWhere("metric.timezone = :timezone", { timezone })
    }

    if (startDate && endDate) {
      queryBuilder.andWhere("metric.metricDate BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
    } else if (startDate) {
      queryBuilder.andWhere("metric.metricDate >= :startDate", { startDate })
    } else if (endDate) {
      queryBuilder.andWhere("metric.metricDate <= :endDate", { endDate })
    }

    const metrics = await queryBuilder.orderBy("metric.metricDate", "DESC").getMany()

    return metrics.map((metric) => ({
      date: metric.metricDate.toISOString().split("T")[0],
      featureName: metric.featureName,
      uniqueUsers: metric.uniqueUsers,
      totalSessions: metric.totalSessions,
      averageSessionDuration:
        metric.totalSessions > 0 ? Math.round(metric.totalDurationSeconds / metric.totalSessions) : 0,
      newUsers: metric.newUsers,
      returningUsers: metric.returningUsers,
      benchmarkGoal: metric.benchmarkGoal,
      goalAchievement: metric.benchmarkGoal ? (metric.uniqueUsers / metric.benchmarkGoal) * 100 : undefined,
    }))
  }

  // Get metrics with pagination
  async getMetrics(query: QueryDauMetricsDto) {
    const { page = 1, limit = 50 } = query
    const skip = (page - 1) * limit

    const queryBuilder = this.dauMetricRepository.createQueryBuilder("metric")

    if (query.featureName) {
      queryBuilder.andWhere("metric.featureName = :featureName", { featureName: query.featureName })
    }

    if (query.timezone) {
      queryBuilder.andWhere("metric.timezone = :timezone", { timezone: query.timezone })
    }

    if (query.startDate && query.endDate) {
      queryBuilder.andWhere("metric.metricDate BETWEEN :startDate AND :endDate", {
        startDate: query.startDate,
        endDate: query.endDate,
      })
    }

    const [data, total] = await queryBuilder
      .orderBy("metric.metricDate", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount()

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  // Update: Historical trends
  async updateMetric(id: string, updateDto: UpdateDauMetricDto): Promise<DauMetric> {
    const metric = await this.dauMetricRepository.findOne({ where: { id } })
    if (!metric) {
      throw new NotFoundException(`DAU metric with ID ${id} not found`)
    }

    Object.assign(metric, updateDto)
    return await this.dauMetricRepository.save(metric)
  }

  async getHistoricalTrends(startDate: string, endDate: string, timezone?: string): Promise<HistoricalTrendDto[]> {
    const queryBuilder = this.dauMetricRepository
      .createQueryBuilder("metric")
      .select("DATE(metric.metricDate)", "date")
      .addSelect("SUM(metric.uniqueUsers)", "totalDau")
      .where("metric.metricDate BETWEEN :startDate AND :endDate", { startDate, endDate })

    if (timezone) {
      queryBuilder.andWhere("metric.timezone = :timezone", { timezone })
    }

    queryBuilder.groupBy("DATE(metric.metricDate)").orderBy("date", "ASC")

    const results = await queryBuilder.getRawMany()

    // Calculate changes from previous day
    const trends: HistoricalTrendDto[] = []
    for (let i = 0; i < results.length; i++) {
      const current = Number.parseInt(results[i].totalDau)
      const previous = i > 0 ? Number.parseInt(results[i - 1].totalDau) : current
      const change = current - previous
      const changePercentage = previous > 0 ? (change / previous) * 100 : 0

      let trend: "up" | "down" | "stable"
      if (changePercentage > 5) trend = "up"
      else if (changePercentage < -5) trend = "down"
      else trend = "stable"

      trends.push({
        date: results[i].date,
        totalDau: current,
        changeFromPrevious: change,
        changePercentage: Number.parseFloat(changePercentage.toFixed(2)),
        trend,
      })
    }

    return trends
  }

  // Feature drill-down analysis
  async getFeatureDrilldown(startDate: string, endDate: string, timezone?: string): Promise<FeatureDrilldownDto[]> {
    const queryBuilder = this.dauMetricRepository
      .createQueryBuilder("metric")
      .select("metric.featureName", "featureName")
      .addSelect("SUM(metric.uniqueUsers)", "totalUsers")
      .addSelect("SUM(metric.totalSessions)", "totalSessions")
      .addSelect("AVG(metric.totalDurationSeconds / NULLIF(metric.totalSessions, 0))", "averageDuration")
      .where("metric.metricDate BETWEEN :startDate AND :endDate", { startDate, endDate })

    if (timezone) {
      queryBuilder.andWhere("metric.timezone = :timezone", { timezone })
    }

    queryBuilder.groupBy("metric.featureName").orderBy("totalUsers", "DESC")

    const results = await queryBuilder.getRawMany()

    // Calculate totals for percentage calculations
    const totalUsers = results.reduce((sum, row) => sum + Number.parseInt(row.totalUsers), 0)
    const totalSessions = results.reduce((sum, row) => sum + Number.parseInt(row.totalSessions), 0)

    return results.map((row) => ({
      featureName: row.featureName,
      totalUsers: Number.parseInt(row.totalUsers),
      totalSessions: Number.parseInt(row.totalSessions),
      averageDuration: Math.round(Number.parseFloat(row.averageDuration) || 0),
      userPercentage: totalUsers > 0 ? (Number.parseInt(row.totalUsers) / totalUsers) * 100 : 0,
      sessionPercentage: totalSessions > 0 ? (Number.parseInt(row.totalSessions) / totalSessions) * 100 : 0,
    }))
  }

  // Delete: Alert drops
  async deleteAlert(id: string): Promise<void> {
    const result = await this.dauAlertRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Alert with ID ${id} not found`)
    }
  }

  async getAlerts(isResolved?: boolean): Promise<AlertDropDto[]> {
    const queryBuilder = this.dauAlertRepository.createQueryBuilder("alert")

    if (isResolved !== undefined) {
      queryBuilder.where("alert.isResolved = :isResolved", { isResolved })
    }

    const alerts = await queryBuilder.orderBy("alert.alertDate", "DESC").getMany()

    return alerts.map((alert) => ({
      id: alert.id,
      alertDate: alert.alertDate,
      featureName: alert.featureName,
      alertType: alert.alertType,
      severity: alert.severity,
      currentValue: alert.currentValue,
      expectedValue: alert.expectedValue,
      dropPercentage: Number.parseFloat(alert.dropPercentage.toString()),
      message: alert.message,
      isResolved: alert.isResolved,
    }))
  }

  async resolveAlert(id: string): Promise<DauAlert> {
    const alert = await this.dauAlertRepository.findOne({ where: { id } })
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`)
    }

    alert.isResolved = true
    alert.resolvedAt = new Date()
    return await this.dauAlertRepository.save(alert)
  }

  // Check for DAU drops and create alerts
  private async checkForAlerts(metric: DauMetric): Promise<void> {
    // Get previous day's metric for comparison
    const previousDate = new Date(metric.metricDate)
    previousDate.setDate(previousDate.getDate() - 1)

    const previousMetric = await this.dauMetricRepository.findOne({
      where: {
        featureName: metric.featureName,
        metricDate: previousDate,
        timezone: metric.timezone,
      },
    })

    if (!previousMetric) {
      return // No previous data to compare
    }

    const dropPercentage = ((previousMetric.uniqueUsers - metric.uniqueUsers) / previousMetric.uniqueUsers) * 100

    // Create alert if drop is significant
    if (dropPercentage > 10) {
      let severity: "low" | "medium" | "high" | "critical"
      if (dropPercentage > 50) severity = "critical"
      else if (dropPercentage > 30) severity = "high"
      else if (dropPercentage > 20) severity = "medium"
      else severity = "low"

      const alert = this.dauAlertRepository.create({
        alertDate: new Date(),
        featureName: metric.featureName,
        alertType: "drop",
        severity,
        currentValue: metric.uniqueUsers,
        expectedValue: previousMetric.uniqueUsers,
        dropPercentage,
        message: `DAU for ${metric.featureName} dropped by ${dropPercentage.toFixed(1)}% (from ${previousMetric.uniqueUsers} to ${metric.uniqueUsers})`,
        isResolved: false,
      })

      await this.dauAlertRepository.save(alert)
    }

    // Check benchmark goals
    if (metric.benchmarkGoal && metric.uniqueUsers < metric.benchmarkGoal * 0.8) {
      const alert = this.dauAlertRepository.create({
        alertDate: new Date(),
        featureName: metric.featureName,
        alertType: "threshold",
        severity: "medium",
        currentValue: metric.uniqueUsers,
        expectedValue: metric.benchmarkGoal,
        dropPercentage: ((metric.benchmarkGoal - metric.uniqueUsers) / metric.benchmarkGoal) * 100,
        message: `DAU for ${metric.featureName} is below 80% of benchmark goal (${metric.uniqueUsers}/${metric.benchmarkGoal})`,
        isResolved: false,
      })

      await this.dauAlertRepository.save(alert)
    }
  }

  // Generate chart JSON for frontend
  async getChartData(startDate: string, endDate: string, timezone?: string) {
    const [breakdown, trends, drilldown] = await Promise.all([
      this.getDauBreakdown({ startDate, endDate, timezone }),
      this.getHistoricalTrends(startDate, endDate, timezone),
      this.getFeatureDrilldown(startDate, endDate, timezone),
    ])

    return {
      dauBreakdown: {
        type: "bar",
        data: breakdown,
        xAxis: "date",
        yAxis: "uniqueUsers",
        groupBy: "featureName",
        title: "Daily Active Users by Feature",
      },
      historicalTrends: {
        type: "line",
        data: trends,
        xAxis: "date",
        yAxis: "totalDau",
        title: "DAU Historical Trends",
      },
      featureDrilldown: {
        type: "pie",
        data: drilldown,
        valueField: "totalUsers",
        labelField: "featureName",
        title: "Feature Usage Distribution",
      },
    }
  }

  // Utility: Get date in specific timezone
  private getDateInTimezone(date: Date, timezone: string): Date {
    const dateString = date.toLocaleString("en-US", { timeZone: timezone })
    return new Date(dateString)
  }

  // Compute DAU from raw feature usage data
  async computeDauFromUsage(date: string, timezone = "UTC"): Promise<DauMetric[]> {
    const features = await this.featureUsageRepository
      .createQueryBuilder("usage")
      .select("DISTINCT usage.featureName", "featureName")
      .where("usage.usageDate = :date", { date })
      .andWhere("usage.timezone = :timezone", { timezone })
      .getRawMany()

    const metrics: DauMetric[] = []

    for (const { featureName } of features) {
      const stats = await this.featureUsageRepository
        .createQueryBuilder("usage")
        .select("COUNT(DISTINCT usage.userId)", "uniqueUsers")
        .addSelect("COUNT(DISTINCT usage.sessionId)", "totalSessions")
        .addSelect("SUM(usage.durationSeconds)", "totalDuration")
        .addSelect("SUM(CASE WHEN usage.isNewUser = true THEN 1 ELSE 0 END)", "newUsers")
        .where("usage.usageDate = :date", { date })
        .andWhere("usage.featureName = :featureName", { featureName })
        .andWhere("usage.timezone = :timezone", { timezone })
        .getRawOne()

      const metric = await this.computeDau({
        metricDate: date,
        timezone,
        featureName,
        uniqueUsers: Number.parseInt(stats.uniqueUsers) || 0,
        totalSessions: Number.parseInt(stats.totalSessions) || 0,
        totalDurationSeconds: Number.parseInt(stats.totalDuration) || 0,
        newUsers: Number.parseInt(stats.newUsers) || 0,
        returningUsers: Number.parseInt(stats.uniqueUsers) - Number.parseInt(stats.newUsers) || 0,
      })

      metrics.push(metric)
    }

    return metrics
  }
}
