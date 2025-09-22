import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { EventEmitter2 } from "@nestjs/event-emitter"
import { type ActivityLog, ActivityAction } from "../entities/activity-log.entity"
import type { CreateActivityLogDto } from "../dto/create-activity-log.dto"
import type { QueryActivityLogsDto } from "../dto/query-activity-logs.dto"
import type { ActivityStatsDto } from "../dto/activity-stats.dto"
import { ActivityLoggedEvent } from "../events/activity-logged.event"

@Injectable()
export class ActivityLogsService {
  private readonly activityLogRepository: Repository<ActivityLog>
  private readonly eventEmitter: EventEmitter2

  constructor(activityLogRepository: Repository<ActivityLog>, eventEmitter: EventEmitter2) {
    this.activityLogRepository = activityLogRepository
    this.eventEmitter = eventEmitter
  }

  async logActivity(createActivityLogDto: CreateActivityLogDto): Promise<ActivityLog> {
    const activityLog = this.activityLogRepository.create(createActivityLogDto)
    const savedLog = await this.activityLogRepository.save(activityLog)

    // Emit event for real-time updates and analytics
    this.eventEmitter.emit("activity.logged", new ActivityLoggedEvent(savedLog))

    return savedLog
  }

  async getUserActivities(
    userId!: string,
    queryDto: QueryActivityLogsDto,
  ): Promise<{ activities: ActivityLog[]; total: number; page: number; limit: number }> {
    const { action, roomId, targetUserId, startDate, endDate, page = 1, limit = 20 } = queryDto

    const where = { userId }

    if (action) {
      where.action = action
    }

    if (roomId) {
      where.roomId = roomId
    }

    if (targetUserId) {
      where.targetUserId = targetUserId
    }

    if (startDate && endDate) {
      where.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
    } else if (startDate) {
      where.createdAt = { $gte: new Date(startDate) }
    }

    const [activities, total] = await this.activityLogRepository.findAndCount({
      where,
      relations: ["user", "targetUser"],
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    })

    return {
      activities,
      total,
      page,
      limit,
    }
  }

  async getUserActivityStats(userId: string): Promise<ActivityStatsDto> {
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get total activities
    const totalActivities = await this.activityLogRepository.count({ where: { userId } })

    // Get action counts
    const actionCountsQuery = await this.activityLogRepository
      .createQueryBuilder("log")
      .select("log.action", "action")
      .addSelect("COUNT(*)", "count")
      .where("log.userId = :userId", { userId })
      .groupBy("log.action")
      .getRawMany()

    const actionCounts = Object.values(ActivityAction).reduce(
      (acc, action) => {
        acc[action] = 0
        return acc
      },
      {} as Record<ActivityAction, number>,
    )

    actionCountsQuery.forEach(({ action, count }) => {
      actionCounts[action] = Number.parseInt(count)
    })

    // Get time-based counts
    const last24HoursCount = await this.activityLogRepository.count({
      where: { userId, createdAt: { $gte: last24Hours, $lte: now } },
    })

    const last7DaysCount = await this.activityLogRepository.count({
      where: { userId, createdAt: { $gte: last7Days, $lte: now } },
    })

    const last30DaysCount = await this.activityLogRepository.count({
      where: { userId, createdAt: { $gte: last30Days, $lte: now } },
    })

    // Get most active day
    const dailyActivityQuery = await this.activityLogRepository
      .createQueryBuilder("log")
      .select("DATE(log.createdAt)", "date")
      .addSelect("COUNT(*)", "count")
      .where("log.userId = :userId", { userId })
      .groupBy("DATE(log.createdAt)")
      .orderBy("count", "DESC")
      .limit(1)
      .getRawOne()

    const mostActiveDay = dailyActivityQuery
      ? { date: dailyActivityQuery.date, count: Number.parseInt(dailyActivityQuery.count) }
      : { date: now.toISOString().split("T")[0], count: 0 }

    // Calculate average per day
    const firstActivityQuery = await this.activityLogRepository.findOne({
      where: { userId },
      order: { createdAt: "ASC" },
    })

    const daysSinceFirst = firstActivityQuery
      ? Math.max(1, Math.ceil((now.getTime() - firstActivityQuery.createdAt.getTime()) / (24 * 60 * 60 * 1000)))
      : 1

    const averagePerDay = totalActivities / daysSinceFirst

    // Get most common action
    const mostCommonActionEntry = Object.entries(actionCounts).reduce(
      (max, [action, count]) => (count > max.count ? { action: action as ActivityAction, count } : max),
      { action: ActivityAction.LOGIN, count: 0 },
    )

    const mostCommonAction = {
      action: mostCommonActionEntry.action,
      count: mostCommonActionEntry.count,
      percentage: totalActivities > 0 ? (mostCommonActionEntry.count / totalActivities) * 100 : 0,
    }

    return {
      totalActivities,
      actionCounts,
      last24Hours: last24HoursCount,
      last7Days: last7DaysCount,
      last30Days: last30DaysCount,
      mostActiveDay,
      averagePerDay: Math.round(averagePerDay * 100) / 100,
      mostCommonAction,
    }
  }

  async getActivityById(id: string): Promise<ActivityLog> {
    const activity = await this.activityLogRepository.findOne({
      where: { id },
      relations: ["user", "targetUser"],
    })

    if (!activity) {
      throw new NotFoundException(`Activity log with ID ${id} not found`)
    }

    return activity
  }

  async getRecentActivities(limit = 50): Promise<ActivityLog[]> {
    return this.activityLogRepository.find({
      relations: ["user", "targetUser"],
      order: { createdAt: "DESC" },
      take: limit,
    })
  }

  async getActivitiesByAction(action: ActivityAction, limit = 50): Promise<ActivityLog[]> {
    return this.activityLogRepository.find({
      where: { action },
      relations: ["user", "targetUser"],
      order: { createdAt: "DESC" },
      take: limit,
    })
  }

  async deleteUserActivities(userId: string): Promise<void> {
    await this.activityLogRepository.delete({ userId })
  }

  async getActivityAggregates(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalActivities: number
    uniqueUsers: number
    actionBreakdown: Record<ActivityAction, number>
    hourlyDistribution: Record<string, number>
  }> {
    const whereClause = startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {}

    const totalActivities = await this.activityLogRepository.count({ where: whereClause })

    const uniqueUsersQuery = await this.activityLogRepository
      .createQueryBuilder("log")
      .select("COUNT(DISTINCT log.userId)", "count")
      .where(startDate && endDate ? "log.createdAt BETWEEN :startDate AND :endDate" : "1=1", {
        startDate,
        endDate,
      })
      .getRawOne()

    const uniqueUsers = Number.parseInt(uniqueUsersQuery.count)

    // Action breakdown
    const actionBreakdownQuery = await this.activityLogRepository
      .createQueryBuilder("log")
      .select("log.action", "action")
      .addSelect("COUNT(*)", "count")
      .where(startDate && endDate ? "log.createdAt BETWEEN :startDate AND :endDate" : "1=1", {
        startDate,
        endDate,
      })
      .groupBy("log.action")
      .getRawMany()

    const actionBreakdown = Object.values(ActivityAction).reduce(
      (acc, action) => {
        acc[action] = 0
        return acc
      },
      {} as Record<ActivityAction, number>,
    )

    actionBreakdownQuery.forEach(({ action, count }) => {
      actionBreakdown[action] = Number.parseInt(count)
    })

    // Hourly distribution
    const hourlyDistributionQuery = await this.activityLogRepository
      .createQueryBuilder("log")
      .select("EXTRACT(HOUR FROM log.createdAt)", "hour")
      .addSelect("COUNT(*)", "count")
      .where(startDate && endDate ? "log.createdAt BETWEEN :startDate AND :endDate" : "1=1", {
        startDate,
        endDate,
      })
      .groupBy("EXTRACT(HOUR FROM log.createdAt)")
      .getRawMany()

    const hourlyDistribution: Record<string, number> = {}
    for (let i = 0; i < 24; i++) {
      hourlyDistribution[i.toString()] = 0
    }

    hourlyDistributionQuery.forEach(({ hour, count }) => {
      hourlyDistribution[hour.toString()] = Number.parseInt(count)
    })

    return {
      totalActivities,
      uniqueUsers,
      actionBreakdown,
      hourlyDistribution,
    }
  }
}
