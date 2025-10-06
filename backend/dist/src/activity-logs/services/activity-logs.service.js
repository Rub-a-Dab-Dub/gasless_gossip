"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogsService = void 0;
const common_1 = require("@nestjs/common");
const activity_log_entity_1 = require("../entities/activity-log.entity");
const activity_logged_event_1 = require("../events/activity-logged.event");
let ActivityLogsService = class ActivityLogsService {
    activityLogRepository;
    eventEmitter;
    constructor(activityLogRepository, eventEmitter) {
        this.activityLogRepository = activityLogRepository;
        this.eventEmitter = eventEmitter;
    }
    async logActivity(createActivityLogDto) {
        const activityLog = this.activityLogRepository.create(createActivityLogDto);
        const savedLog = await this.activityLogRepository.save(activityLog);
        this.eventEmitter.emit("activity.logged", new activity_logged_event_1.ActivityLoggedEvent(savedLog));
        return savedLog;
    }
    async getUserActivities(userId, queryDto) {
        const { action, roomId, targetUserId, startDate, endDate, page = 1, limit = 20 } = queryDto;
        const where = { userId };
        if (action) {
            where.action = action;
        }
        if (roomId) {
            where.roomId = roomId;
        }
        if (targetUserId) {
            where.targetUserId = targetUserId;
        }
        if (startDate && endDate) {
            where.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        else if (startDate) {
            where.createdAt = { $gte: new Date(startDate) };
        }
        const [activities, total] = await this.activityLogRepository.findAndCount({
            where,
            relations: ["user", "targetUser"],
            order: { createdAt: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            activities,
            total,
            page,
            limit,
        };
    }
    async getUserActivityStats(userId) {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const totalActivities = await this.activityLogRepository.count({ where: { userId } });
        const actionCountsQuery = await this.activityLogRepository
            .createQueryBuilder("log")
            .select("log.action", "action")
            .addSelect("COUNT(*)", "count")
            .where("log.userId = :userId", { userId })
            .groupBy("log.action")
            .getRawMany();
        const actionCounts = Object.values(activity_log_entity_1.ActivityAction).reduce((acc, action) => {
            acc[action] = 0;
            return acc;
        }, {});
        actionCountsQuery.forEach(({ action, count }) => {
            actionCounts[action] = Number.parseInt(count);
        });
        const last24HoursCount = await this.activityLogRepository.count({
            where: { userId, createdAt: { $gte: last24Hours, $lte: now } },
        });
        const last7DaysCount = await this.activityLogRepository.count({
            where: { userId, createdAt: { $gte: last7Days, $lte: now } },
        });
        const last30DaysCount = await this.activityLogRepository.count({
            where: { userId, createdAt: { $gte: last30Days, $lte: now } },
        });
        const dailyActivityQuery = await this.activityLogRepository
            .createQueryBuilder("log")
            .select("DATE(log.createdAt)", "date")
            .addSelect("COUNT(*)", "count")
            .where("log.userId = :userId", { userId })
            .groupBy("DATE(log.createdAt)")
            .orderBy("count", "DESC")
            .limit(1)
            .getRawOne();
        const mostActiveDay = dailyActivityQuery
            ? { date: dailyActivityQuery.date, count: Number.parseInt(dailyActivityQuery.count) }
            : { date: now.toISOString().split("T")[0], count: 0 };
        const firstActivityQuery = await this.activityLogRepository.findOne({
            where: { userId },
            order: { createdAt: "ASC" },
        });
        const daysSinceFirst = firstActivityQuery
            ? Math.max(1, Math.ceil((now.getTime() - firstActivityQuery.createdAt.getTime()) / (24 * 60 * 60 * 1000)))
            : 1;
        const averagePerDay = totalActivities / daysSinceFirst;
        const mostCommonActionEntry = Object.entries(actionCounts).reduce((max, [action, count]) => (count > max.count ? { action: action, count } : max), { action: activity_log_entity_1.ActivityAction.LOGIN, count: 0 });
        const mostCommonAction = {
            action: mostCommonActionEntry.action,
            count: mostCommonActionEntry.count,
            percentage: totalActivities > 0 ? (mostCommonActionEntry.count / totalActivities) * 100 : 0,
        };
        return {
            totalActivities,
            actionCounts,
            last24Hours: last24HoursCount,
            last7Days: last7DaysCount,
            last30Days: last30DaysCount,
            mostActiveDay,
            averagePerDay: Math.round(averagePerDay * 100) / 100,
            mostCommonAction,
        };
    }
    async getActivityById(id) {
        const activity = await this.activityLogRepository.findOne({
            where: { id },
            relations: ["user", "targetUser"],
        });
        if (!activity) {
            throw new common_1.NotFoundException(`Activity log with ID ${id} not found`);
        }
        return activity;
    }
    async getRecentActivities(limit = 50) {
        return this.activityLogRepository.find({
            relations: ["user", "targetUser"],
            order: { createdAt: "DESC" },
            take: limit,
        });
    }
    async getActivitiesByAction(action, limit = 50) {
        return this.activityLogRepository.find({
            where: { action },
            relations: ["user", "targetUser"],
            order: { createdAt: "DESC" },
            take: limit,
        });
    }
    async deleteUserActivities(userId) {
        await this.activityLogRepository.delete({ userId });
    }
    async getActivityAggregates(startDate, endDate) {
        const whereClause = startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {};
        const totalActivities = await this.activityLogRepository.count({ where: whereClause });
        const uniqueUsersQuery = await this.activityLogRepository
            .createQueryBuilder("log")
            .select("COUNT(DISTINCT log.userId)", "count")
            .where(startDate && endDate ? "log.createdAt BETWEEN :startDate AND :endDate" : "1=1", {
            startDate,
            endDate,
        })
            .getRawOne();
        const uniqueUsers = Number.parseInt(uniqueUsersQuery.count);
        const actionBreakdownQuery = await this.activityLogRepository
            .createQueryBuilder("log")
            .select("log.action", "action")
            .addSelect("COUNT(*)", "count")
            .where(startDate && endDate ? "log.createdAt BETWEEN :startDate AND :endDate" : "1=1", {
            startDate,
            endDate,
        })
            .groupBy("log.action")
            .getRawMany();
        const actionBreakdown = Object.values(activity_log_entity_1.ActivityAction).reduce((acc, action) => {
            acc[action] = 0;
            return acc;
        }, {});
        actionBreakdownQuery.forEach(({ action, count }) => {
            actionBreakdown[action] = Number.parseInt(count);
        });
        const hourlyDistributionQuery = await this.activityLogRepository
            .createQueryBuilder("log")
            .select("EXTRACT(HOUR FROM log.createdAt)", "hour")
            .addSelect("COUNT(*)", "count")
            .where(startDate && endDate ? "log.createdAt BETWEEN :startDate AND :endDate" : "1=1", {
            startDate,
            endDate,
        })
            .groupBy("EXTRACT(HOUR FROM log.createdAt)")
            .getRawMany();
        const hourlyDistribution = {};
        for (let i = 0; i < 24; i++) {
            hourlyDistribution[i.toString()] = 0;
        }
        hourlyDistributionQuery.forEach(({ hour, count }) => {
            hourlyDistribution[hour.toString()] = Number.parseInt(count);
        });
        return {
            totalActivities,
            uniqueUsers,
            actionBreakdown,
            hourlyDistribution,
        };
    }
};
exports.ActivityLogsService = ActivityLogsService;
exports.ActivityLogsService = ActivityLogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Object])
], ActivityLogsService);
//# sourceMappingURL=activity-logs.service.js.map