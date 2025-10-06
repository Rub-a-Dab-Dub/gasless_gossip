import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { GrowthMetric } from "./entities/growth-metric.entity"
import type { Cohort } from "./entities/cohort.entity"
import type { CreateGrowthMetricDto } from "./dto/create-growth-metric.dto"
import type { UpdateGrowthMetricDto } from "./dto/update-growth-metric.dto"
import type { QueryGrowthMetricsDto } from "./dto/query-growth-metrics.dto"
import type { CreateCohortDto } from "./dto/create-cohort.dto"
import type {
  AverageLevelsDto,
  UnlockRatesDto,
  DropOffAnalysisDto,
  CohortAnalysisDto,
  PlateauPredictionDto,
} from "./dto/analytics-response.dto"

@Injectable()
export class GrowthAnalyticsService {
  private growthMetricRepository: Repository<GrowthMetric>
  private cohortRepository: Repository<Cohort>

  constructor(growthMetricRepository: Repository<GrowthMetric>, cohortRepository: Repository<Cohort>) {
    this.growthMetricRepository = growthMetricRepository
    this.cohortRepository = cohortRepository
  }

  // Create a new growth metric
  async createMetric(createDto: CreateGrowthMetricDto): Promise<GrowthMetric> {
    const metric = this.growthMetricRepository.create(createDto)
    return await this.growthMetricRepository.save(metric)
  }

  // Bulk create metrics
  async createMetricsBulk(createDtos: CreateGrowthMetricDto[]): Promise<GrowthMetric[]> {
    const metrics = this.growthMetricRepository.create(createDtos)
    return await this.growthMetricRepository.save(metrics)
  }

  // Get metrics with filters
  async getMetrics(query: QueryGrowthMetricsDto) {
    const { userId, cohortId, startDate, endDate, page = 1, limit = 50 } = query
    const skip = (page - 1) * limit

    const queryBuilder = this.growthMetricRepository.createQueryBuilder("metric")

    if (userId) {
      queryBuilder.andWhere("metric.userId = :userId", { userId })
    }

    if (cohortId) {
      queryBuilder.andWhere("metric.cohortId = :cohortId", { cohortId })
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

  // Update drop-off points
  async updateMetric(id: string, updateDto: UpdateGrowthMetricDto): Promise<GrowthMetric> {
    const metric = await this.growthMetricRepository.findOne({ where: { id } })
    if (!metric) {
      throw new NotFoundException(`Growth metric with ID ${id} not found`)
    }

    Object.assign(metric, updateDto)
    return await this.growthMetricRepository.save(metric)
  }

  // Calculate average levels over time
  async getAverageLevels(startDate: string, endDate: string, cohortId?: string): Promise<AverageLevelsDto[]> {
    const queryBuilder = this.growthMetricRepository
      .createQueryBuilder("metric")
      .select("DATE(metric.metricDate)", "date")
      .addSelect("AVG(metric.userLevel)", "averageLevel")
      .addSelect("COUNT(DISTINCT metric.userId)", "totalUsers")
      .where("metric.metricDate BETWEEN :startDate AND :endDate", { startDate, endDate })

    if (cohortId) {
      queryBuilder.andWhere("metric.cohortId = :cohortId", { cohortId })
      queryBuilder.addSelect("metric.cohortId", "cohortId")
    }

    queryBuilder.groupBy("DATE(metric.metricDate)")
    if (cohortId) {
      queryBuilder.addGroupBy("metric.cohortId")
    }
    queryBuilder.orderBy("date", "ASC")

    const results = await queryBuilder.getRawMany()

    return results.map((row) => ({
      date: row.date,
      averageLevel: Number.parseFloat(row.averageLevel),
      totalUsers: Number.parseInt(row.totalUsers),
      cohortId: row.cohortId,
    }))
  }

  // Calculate unlock rates over time
  async getUnlockRates(startDate: string, endDate: string, cohortId?: string): Promise<UnlockRatesDto[]> {
    const queryBuilder = this.growthMetricRepository
      .createQueryBuilder("metric")
      .select("DATE(metric.metricDate)", "date")
      .addSelect("SUM(metric.unlocksCount)", "totalUnlocks")
      .addSelect("COUNT(DISTINCT metric.userId)", "uniqueUsers")
      .where("metric.metricDate BETWEEN :startDate AND :endDate", { startDate, endDate })

    if (cohortId) {
      queryBuilder.andWhere("metric.cohortId = :cohortId", { cohortId })
      queryBuilder.addSelect("metric.cohortId", "cohortId")
    }

    queryBuilder.groupBy("DATE(metric.metricDate)")
    if (cohortId) {
      queryBuilder.addGroupBy("metric.cohortId")
    }
    queryBuilder.orderBy("date", "ASC")

    const results = await queryBuilder.getRawMany()

    return results.map((row) => ({
      date: row.date,
      totalUnlocks: Number.parseInt(row.totalUnlocks),
      uniqueUsers: Number.parseInt(row.uniqueUsers),
      unlockRate: Number.parseInt(row.totalUnlocks) / Number.parseInt(row.uniqueUsers),
      cohortId: row.cohortId,
    }))
  }

  // Analyze drop-off points
  async getDropOffAnalysis(startDate: string, endDate: string, cohortId?: string): Promise<DropOffAnalysisDto[]> {
    const queryBuilder = this.growthMetricRepository
      .createQueryBuilder("metric")
      .select("metric.dropOffPoint", "level")
      .addSelect("COUNT(*)", "dropOffCount")
      .where("metric.dropOffPoint IS NOT NULL")
      .andWhere("metric.metricDate BETWEEN :startDate AND :endDate", { startDate, endDate })

    if (cohortId) {
      queryBuilder.andWhere("metric.cohortId = :cohortId", { cohortId })
    }

    queryBuilder.groupBy("metric.dropOffPoint").orderBy("level", "ASC")

    const results = await queryBuilder.getRawMany()
    const totalDropOffs = results.reduce((sum, row) => sum + Number.parseInt(row.dropOffCount), 0)

    return results.map((row) => ({
      level: Number.parseInt(row.level),
      dropOffCount: Number.parseInt(row.dropOffCount),
      dropOffPercentage: (Number.parseInt(row.dropOffCount) / totalDropOffs) * 100,
    }))
  }

  // Predict plateaus using simple trend analysis
  async predictPlateaus(cohortId?: string): Promise<PlateauPredictionDto> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const queryBuilder = this.growthMetricRepository
      .createQueryBuilder("metric")
      .select("DATE(metric.metricDate)", "date")
      .addSelect("AVG(metric.userLevel)", "avgLevel")
      .where("metric.metricDate >= :thirtyDaysAgo", { thirtyDaysAgo: thirtyDaysAgo.toISOString().split("T")[0] })

    if (cohortId) {
      queryBuilder.andWhere("metric.cohortId = :cohortId", { cohortId })
    }

    queryBuilder.groupBy("DATE(metric.metricDate)").orderBy("date", "ASC")

    const results = await queryBuilder.getRawMany()

    if (results.length < 7) {
      throw new BadRequestException("Insufficient data for plateau prediction (minimum 7 days required)")
    }

    // Simple linear regression to detect trend
    const levels = results.map((r) => Number.parseFloat(r.avgLevel))
    const n = levels.length
    const xValues = Array.from({ length: n }, (_, i) => i)
    const xMean = xValues.reduce((a, b) => a + b, 0) / n
    const yMean = levels.reduce((a, b) => a + b, 0) / n

    const numerator = xValues.reduce((sum, x, i) => sum + (x - xMean) * (levels[i] - yMean), 0)
    const denominator = xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0)
    const slope = numerator / denominator

    // Calculate variance to determine confidence
    const variance = levels.reduce((sum, level) => sum + Math.pow(level - yMean, 2), 0) / n
    const confidence = Math.max(0, Math.min(1, 1 - variance / (yMean * yMean)))

    let trend: "increasing" | "stable" | "decreasing"
    if (slope > 0.1) trend = "increasing"
    else if (slope < -0.1) trend = "decreasing"
    else trend = "stable"

    // Estimate plateau level (current max + projected growth)
    const currentMax = Math.max(...levels)
    const plateauLevel = Math.round(currentMax + Math.max(0, slope * 30))

    // Estimate days to plateau based on slope
    const daysToPlateauEstimate = slope > 0.1 ? Math.round(30 / slope) : 0

    return {
      plateauLevel,
      confidence,
      daysToPlateauEstimate,
      trend,
    }
  }

  // Segment levels analysis
  async getSegmentedLevels(startDate: string, endDate: string) {
    const results = await this.growthMetricRepository
      .createQueryBuilder("metric")
      .select("metric.userLevel", "level")
      .addSelect("COUNT(DISTINCT metric.userId)", "userCount")
      .where("metric.metricDate BETWEEN :startDate AND :endDate", { startDate, endDate })
      .groupBy("metric.userLevel")
      .orderBy("level", "ASC")
      .getRawMany()

    // Group into segments (0-10, 11-20, 21-30, etc.)
    const segments = new Map<string, { range: string; userCount: number }>()

    results.forEach((row) => {
      const level = Number.parseInt(row.level)
      const segmentStart = Math.floor(level / 10) * 10
      const segmentEnd = segmentStart + 9
      const segmentKey = `${segmentStart}-${segmentEnd}`

      if (!segments.has(segmentKey)) {
        segments.set(segmentKey, { range: segmentKey, userCount: 0 })
      }

      const segment = segments.get(segmentKey)!
      segment.userCount += Number.parseInt(row.userCount)
    })

    return Array.from(segments.values()).sort((a, b) => {
      const aStart = Number.parseInt(a.range.split("-")[0])
      const bStart = Number.parseInt(b.range.split("-")[0])
      return aStart - bStart
    })
  }

  // Cohort CRUD operations
  async createCohort(createDto: CreateCohortDto): Promise<Cohort> {
    const cohort = this.cohortRepository.create(createDto)
    return await this.cohortRepository.save(cohort)
  }

  async getCohorts() {
    return await this.cohortRepository.find({ order: { startDate: "DESC" } })
  }

  async getCohort(id: string): Promise<Cohort> {
    const cohort = await this.cohortRepository.findOne({ where: { id } })
    if (!cohort) {
      throw new NotFoundException(`Cohort with ID ${id} not found`)
    }
    return cohort
  }

  async deleteCohort(id: string): Promise<void> {
    const result = await this.cohortRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Cohort with ID ${id} not found`)
    }
  }

  // Cohort analysis
  async getCohortAnalysis(cohortId: string): Promise<CohortAnalysisDto> {
    const cohort = await this.getCohort(cohortId)

    const metrics = await this.growthMetricRepository
      .createQueryBuilder("metric")
      .select("COUNT(DISTINCT metric.userId)", "totalUsers")
      .addSelect("AVG(metric.userLevel)", "averageLevel")
      .addSelect("SUM(metric.unlocksCount)", "totalUnlocks")
      .addSelect("SUM(CASE WHEN metric.isActive = true THEN 1 ELSE 0 END)", "activeUsers")
      .where("metric.cohortId = :cohortId", { cohortId })
      .getRawOne()

    const totalUsers = Number.parseInt(metrics.totalUsers) || 0
    const activeUsers = Number.parseInt(metrics.activeUsers) || 0

    return {
      cohortId: cohort.id,
      cohortName: cohort.cohortName,
      totalUsers,
      averageLevel: Number.parseFloat(metrics.averageLevel) || 0,
      totalUnlocks: Number.parseInt(metrics.totalUnlocks) || 0,
      retentionRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
    }
  }

  // Generate chart JSON for frontend consumption
  async getChartData(startDate: string, endDate: string, cohortId?: string) {
    const [avgLevels, unlockRates, dropOffs] = await Promise.all([
      this.getAverageLevels(startDate, endDate, cohortId),
      this.getUnlockRates(startDate, endDate, cohortId),
      this.getDropOffAnalysis(startDate, endDate, cohortId),
    ])

    return {
      averageLevels: {
        type: "line",
        data: avgLevels,
        xAxis: "date",
        yAxis: "averageLevel",
        title: "Average User Levels Over Time",
      },
      unlockRates: {
        type: "line",
        data: unlockRates,
        xAxis: "date",
        yAxis: "unlockRate",
        title: "Unlock Rates Over Time",
      },
      dropOffAnalysis: {
        type: "bar",
        data: dropOffs,
        xAxis: "level",
        yAxis: "dropOffCount",
        title: "Drop-off Points by Level",
      },
    }
  }
}
