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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RoomSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("../../entities/room.entity");
let RoomSchedulerService = RoomSchedulerService_1 = class RoomSchedulerService {
    roomRepository;
    logger = new common_1.Logger(RoomSchedulerService_1.name);
    processingStats = {
        totalProcessed: 0,
        successfullyDeleted: 0,
        errors: 0,
        lastRun: new Date()
    };
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async processExpiredSecretRooms() {
        const startTime = Date.now();
        this.logger.log('Starting hourly expired room cleanup');
        try {
            const expiredRooms = await this.roomRepository.find({
                where: {
                    expiresAt: (0, typeorm_2.LessThan)(new Date()),
                    status: room_entity_1.RoomStatus.ACTIVE,
                    isActive: true
                }
            });
            this.logger.log(`Found ${expiredRooms.length} expired rooms to process`);
            if (expiredRooms.length === 0) {
                this.updateProcessingStats(0, 0, 0);
                return;
            }
            let successCount = 0;
            let errorCount = 0;
            for (const room of expiredRooms) {
                try {
                    await this.archiveExpiredRoom(room);
                    successCount++;
                    await this.sleep(50);
                }
                catch (error) {
                    errorCount++;
                    this.logger.error(`Failed to archive room ${room.id}:`, error);
                    continue;
                }
            }
            this.updateProcessingStats(expiredRooms.length, successCount, errorCount);
            const duration = Date.now() - startTime;
            const errorRate = (errorCount / expiredRooms.length) * 100;
            this.logger.log(`Completed room cleanup: ${successCount}/${expiredRooms.length} processed successfully ` +
                `(${errorRate.toFixed(2)}% error rate) in ${duration}ms`);
            if (errorRate > 1) {
                this.logger.warn(`Error rate ${errorRate.toFixed(2)}% exceeds 1% threshold!`);
                await this.sendErrorRateAlert(errorRate, expiredRooms.length, errorCount);
            }
        }
        catch (error) {
            this.logger.error('Fatal error in room cleanup process:', error);
            this.processingStats.errors++;
            throw error;
        }
    }
    async archiveExpiredRoom(room) {
        await this.roomRepository.update(room.id, {
            status: room_entity_1.RoomStatus.ARCHIVED,
            isActive: false,
            archivedAt: new Date()
        });
        this.logger.debug(`Archived expired room: ${room.id} (${room.name})`);
        if (room.settings?.autoDelete) {
            await this.scheduleRoomDeletion(room.id, room.settings.deleteAfterHours || 24);
        }
    }
    async scheduleRoomDeletion(roomId, hoursDelay) {
        const deleteAfter = hoursDelay * 60 * 60 * 1000;
        setTimeout(async () => {
            try {
                await this.roomRepository.update(roomId, {
                    status: room_entity_1.RoomStatus.DELETED
                });
                this.logger.log(`Auto-deleted room: ${roomId}`);
            }
            catch (error) {
                this.logger.error(`Failed to auto-delete room ${roomId}:`, error);
            }
        }, deleteAfter);
        this.logger.debug(`Scheduled deletion for room ${roomId} in ${hoursDelay} hours`);
    }
    getProcessingStats() {
        return { ...this.processingStats };
    }
    resetStats() {
        this.processingStats = {
            totalProcessed: 0,
            successfullyDeleted: 0,
            errors: 0,
            lastRun: new Date()
        };
        this.logger.log('Processing statistics reset');
    }
    async manualCleanup() {
        this.logger.log('Manual cleanup triggered');
        const beforeStats = { ...this.processingStats };
        await this.processExpiredSecretRooms();
        const afterStats = this.processingStats;
        const result = {
            processed: afterStats.totalProcessed - beforeStats.totalProcessed,
            successful: afterStats.successfullyDeleted - beforeStats.successfullyDeleted,
            errors: afterStats.errors - beforeStats.errors,
            errorRate: 0
        };
        result.errorRate = result.processed > 0 ? (result.errors / result.processed) * 100 : 0;
        return result;
    }
    updateProcessingStats(total, successful, errors) {
        this.processingStats.totalProcessed += total;
        this.processingStats.successfullyDeleted += successful;
        this.processingStats.errors += errors;
        this.processingStats.lastRun = new Date();
    }
    async sendErrorRateAlert(errorRate, totalRooms, errorCount) {
        this.logger.error(`🚨 HIGH ERROR RATE ALERT 🚨\n` +
            `Error Rate: ${errorRate.toFixed(2)}%\n` +
            `Failed Operations: ${errorCount}/${totalRooms}\n` +
            `Threshold Exceeded: >1%\n` +
            `Time: ${new Date().toISOString()}`);
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.RoomSchedulerService = RoomSchedulerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoomSchedulerService.prototype, "processExpiredSecretRooms", null);
exports.RoomSchedulerService = RoomSchedulerService = RoomSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RoomSchedulerService);
//# sourceMappingURL=room-scheduler.service.js.map