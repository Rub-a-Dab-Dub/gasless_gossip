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
var VisitsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitsService = void 0;
const common_1 = require("@nestjs/common");
const visit_created_event_1 = require("../events/visit-created.event");
const typeorm_1 = require("typeorm");
let VisitsService = VisitsService_1 = class VisitsService {
    visitRepository;
    eventEmitter;
    logger = new common_1.Logger(VisitsService_1.name);
    constructor(visitRepository, eventEmitter) {
        this.visitRepository = visitRepository;
        this.eventEmitter = eventEmitter;
    }
    async createVisit(createVisitDto) {
        try {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            const existingVisit = await this.visitRepository.findOne({
                where: {
                    roomId: createVisitDto.roomId,
                    userId: createVisitDto.userId,
                    createdAt: (0, typeorm_1.Between)(oneHourAgo, new Date()),
                },
            });
            if (existingVisit) {
                existingVisit.duration += createVisitDto.duration || 1;
                const updatedVisit = await this.visitRepository.save(existingVisit);
                this.eventEmitter.emit("visit.updated", new visit_created_event_1.VisitCreatedEvent(updatedVisit));
                return updatedVisit;
            }
            const visit = this.visitRepository.create(createVisitDto);
            const savedVisit = await this.visitRepository.save(visit);
            this.eventEmitter.emit("visit.created", new visit_created_event_1.VisitCreatedEvent(savedVisit));
            this.logger.log(`Visit created for room ${createVisitDto.roomId} by user ${createVisitDto.userId}`);
            return savedVisit;
        }
        catch (error) {
            this.logger.error(`Failed to create visit: ${error.message}`, error.stack);
            throw new common_1.BadRequestException("Failed to create visit");
        }
    }
    async getVisitsByRoom(roomId, limit = 50, offset = 0) {
        return this.visitRepository.find({
            where: { roomId },
            relations: ["user"],
            order: { createdAt: "DESC" },
            take: limit,
            skip: offset,
        });
    }
    async getVisitsByUser(userId, limit = 50, offset = 0) {
        return this.visitRepository.find({
            where: { userId },
            order: { createdAt: "DESC" },
            take: limit,
            skip: offset,
        });
    }
    async getVisitStats(roomId) {
        const [totalVisits, uniqueVisitors, avgDuration, lastVisit, dailyVisits, peakHour] = await Promise.all([
            this.getTotalVisits(roomId),
            this.getUniqueVisitors(roomId),
            this.getAverageDuration(roomId),
            this.getLastVisit(roomId),
            this.getDailyVisits(roomId),
            this.getPeakHour(roomId),
        ]);
        return {
            roomId,
            totalVisits,
            uniqueVisitors,
            averageDuration: Math.round(avgDuration),
            lastVisit,
            dailyVisits,
            peakHour,
        };
    }
    async getTotalVisits(roomId) {
        return this.visitRepository.count({ where: { roomId } });
    }
    async getUniqueVisitors(roomId) {
        const result = await this.visitRepository
            .createQueryBuilder("visit")
            .select("COUNT(DISTINCT visit.userId)", "count")
            .where("visit.roomId = :roomId", { roomId })
            .getRawOne();
        return Number.parseInt(result.count) || 0;
    }
    async getAverageDuration(roomId) {
        const result = await this.visitRepository
            .createQueryBuilder("visit")
            .select("AVG(visit.duration)", "avg")
            .where("visit.roomId = :roomId", { roomId })
            .getRawOne();
        return Number.parseFloat(result.avg) || 0;
    }
    async getLastVisit(roomId) {
        const visit = await this.visitRepository.findOne({
            where: { roomId },
            order: { createdAt: "DESC" },
        });
        return visit?.createdAt || new Date(0);
    }
    async getDailyVisits(roomId) {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const result = await this.visitRepository
            .createQueryBuilder("visit")
            .select("DATE(visit.createdAt) as date, COUNT(*) as count")
            .where("visit.roomId = :roomId", { roomId })
            .andWhere("visit.createdAt >= :sevenDaysAgo", { sevenDaysAgo })
            .groupBy("DATE(visit.createdAt)")
            .orderBy("date", "ASC")
            .getRawMany();
        const dailyVisits = new Array(7).fill(0);
        result.forEach((row) => {
            const dayIndex = Math.floor((new Date(row.date).getTime() - sevenDaysAgo.getTime()) / (24 * 60 * 60 * 1000));
            if (dayIndex >= 0 && dayIndex < 7) {
                dailyVisits[dayIndex] = Number.parseInt(row.count);
            }
        });
        return dailyVisits;
    }
    async getPeakHour(roomId) {
        const result = await this.visitRepository
            .createQueryBuilder("visit")
            .select("EXTRACT(HOUR FROM visit.createdAt) as hour, COUNT(*) as count")
            .where("visit.roomId = :roomId", { roomId })
            .groupBy("EXTRACT(HOUR FROM visit.createdAt)")
            .orderBy("count", "DESC")
            .limit(1)
            .getRawOne();
        return Number.parseInt(result?.hour) || 0;
    }
    async getPopularRooms(limit = 10) {
        const result = await this.visitRepository
            .createQueryBuilder("visit")
            .select("visit.roomId, COUNT(*) as visitCount")
            .groupBy("visit.roomId")
            .orderBy("visitCount", "DESC")
            .limit(limit)
            .getRawMany();
        return result.map((row) => ({
            roomId: row.visit_roomId,
            visitCount: Number.parseInt(row.visitCount),
        }));
    }
    async deleteOldVisits(daysOld = 90) {
        const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
        const result = await this.visitRepository
            .createQueryBuilder()
            .delete()
            .where("createdAt < :cutoffDate", { cutoffDate })
            .execute();
        this.logger.log(`Deleted ${result.affected} old visits older than ${daysOld} days`);
        return result.affected || 0;
    }
};
exports.VisitsService = VisitsService;
exports.VisitsService = VisitsService = VisitsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Object])
], VisitsService);
//# sourceMappingURL=visits.service.js.map