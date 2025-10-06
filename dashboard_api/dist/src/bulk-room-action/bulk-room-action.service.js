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
exports.BulkRoomActionService = void 0;
const common_1 = require("@nestjs/common");
let BulkRoomActionService = class BulkRoomActionService {
    bulkActionRepo;
    roomActionResultRepo;
    notificationRepo;
    dataSource;
    constructor(bulkActionRepo, roomActionResultRepo, notificationRepo, dataSource) {
        this.bulkActionRepo = bulkActionRepo;
        this.roomActionResultRepo = roomActionResultRepo;
        this.notificationRepo = notificationRepo;
        this.dataSource = dataSource;
    }
    async createBulkAction(dto) {
        const validationErrors = await this.validateRooms(dto.targetRoomIds, dto.actionType, dto.actionPayload);
        const bulkAction = this.bulkActionRepo.create({
            actionType: dto.actionType,
            targetRoomIds: dto.targetRoomIds,
            actionPayload: dto.actionPayload,
            status: "preview",
            totalRooms: dto.targetRoomIds.length,
            isDryRun: dto.isDryRun || false,
        });
        await this.bulkActionRepo.save(bulkAction);
        const estimatedTimeMs = dto.targetRoomIds.length * 50;
        const estimatedTime = this.formatExecutionTime(estimatedTimeMs);
        return {
            bulkAction,
            preview: {
                totalRooms: dto.targetRoomIds.length,
                estimatedTime,
                affectedRooms: dto.targetRoomIds,
                validationErrors,
            },
        };
    }
    async executeBulkAction(dto) {
        const bulkAction = await this.bulkActionRepo.findOne({
            where: { id: dto.bulkActionId },
        });
        if (!bulkAction) {
            throw new Error("Bulk action not found");
        }
        if (bulkAction.status === "executing") {
            throw new Error("Bulk action is already executing");
        }
        bulkAction.status = "executing";
        bulkAction.executedBy = dto.executedBy;
        bulkAction.executedAt = new Date();
        await this.bulkActionRepo.save(bulkAction);
        await this.createNotification(bulkAction.id, dto.executedBy, "started", "Bulk action execution started");
        this.executeInBackground(bulkAction);
        return bulkAction;
    }
    async executeInBackground(bulkAction) {
        const startTime = Date.now();
        let successCount = 0;
        let failureCount = 0;
        const errors = [];
        const batchSize = 10;
        const roomBatches = this.chunkArray(bulkAction.targetRoomIds, batchSize);
        for (const batch of roomBatches) {
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                for (const roomId of batch) {
                    try {
                        const result = await this.executeRoomAction(roomId, bulkAction.actionType, bulkAction.actionPayload, bulkAction.isDryRun, queryRunner);
                        await this.roomActionResultRepo.save({
                            bulkActionId: bulkAction.id,
                            roomId,
                            status: result.success ? "success" : "failed",
                            previousState: result.previousState,
                            newState: result.newState,
                            errorMessage: result.error,
                            executionTimeMs: result.executionTime,
                        });
                        if (result.success) {
                            successCount++;
                        }
                        else {
                            failureCount++;
                            errors.push({ roomId, error: result.error || "Unknown error" });
                        }
                    }
                    catch (error) {
                        failureCount++;
                        const errorMessage = error instanceof Error ? error.message : "Unknown error";
                        errors.push({ roomId, error: errorMessage });
                        await this.roomActionResultRepo.save({
                            bulkActionId: bulkAction.id,
                            roomId,
                            status: "failed",
                            errorMessage,
                        });
                    }
                }
                await queryRunner.commitTransaction();
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                for (const roomId of batch) {
                    failureCount++;
                    errors.push({ roomId, error: "Batch transaction failed" });
                }
            }
            finally {
                await queryRunner.release();
            }
        }
        const executionTime = Date.now() - startTime;
        bulkAction.successCount = successCount;
        bulkAction.failureCount = failureCount;
        bulkAction.errors = errors;
        bulkAction.executionTimeMs = executionTime;
        bulkAction.status = failureCount === 0 ? "completed" : failureCount === bulkAction.totalRooms ? "failed" : "partial";
        await this.bulkActionRepo.save(bulkAction);
        const notificationType = bulkAction.status === "completed" ? "completed" : bulkAction.status === "failed" ? "failed" : "partial_success";
        await this.createNotification(bulkAction.id, bulkAction.executedBy, notificationType, `Bulk action ${bulkAction.status}. Success: ${successCount}, Failed: ${failureCount}`);
    }
    async executeRoomAction(roomId, actionType, payload, isDryRun, queryRunner) {
        const startTime = Date.now();
        try {
            const room = await queryRunner.manager.findOne("Room", { where: { id: roomId } });
            if (!room) {
                return {
                    success: false,
                    error: "Room not found",
                    executionTime: Date.now() - startTime,
                };
            }
            const previousState = { ...room };
            if (isDryRun) {
                return {
                    success: true,
                    previousState,
                    newState: { ...room, ...payload },
                    executionTime: Date.now() - startTime,
                };
            }
            let newState;
            switch (actionType) {
                case "update":
                    await queryRunner.manager.update("Room", { id: roomId }, payload);
                    newState = { ...room, ...payload };
                    break;
                case "delete":
                    await queryRunner.manager.delete("Room", { id: roomId });
                    newState = { deleted: true };
                    break;
                case "archive":
                    await queryRunner.manager.update("Room", { id: roomId }, { isArchived: true, archivedAt: new Date() });
                    newState = { ...room, isArchived: true };
                    break;
                case "restore":
                    await queryRunner.manager.update("Room", { id: roomId }, { isArchived: false, archivedAt: null });
                    newState = { ...room, isArchived: false };
                    break;
                case "configure":
                    await queryRunner.manager.update("Room", { id: roomId }, { config: payload });
                    newState = { ...room, config: payload };
                    break;
                default:
                    return {
                        success: false,
                        error: `Unknown action type: ${actionType}`,
                        executionTime: Date.now() - startTime,
                    };
            }
            return {
                success: true,
                previousState,
                newState,
                executionTime: Date.now() - startTime,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
                executionTime: Date.now() - startTime,
            };
        }
    }
    async rollbackBulkAction(dto) {
        const bulkAction = await this.bulkActionRepo.findOne({
            where: { id: dto.bulkActionId },
        });
        if (!bulkAction) {
            throw new Error("Bulk action not found");
        }
        const resultsQuery = this.roomActionResultRepo
            .createQueryBuilder("result")
            .where("result.bulkActionId = :bulkActionId", {
            bulkActionId: dto.bulkActionId,
        })
            .andWhere("result.status IN (:...statuses)", {
            statuses: ["success", "failed"],
        });
        if (dto.roomIds && dto.roomIds.length > 0) {
            resultsQuery.andWhere("result.roomId IN (:...roomIds)", {
                roomIds: dto.roomIds,
            });
        }
        const results = await resultsQuery.getMany();
        let rolledBackCount = 0;
        const errors = [];
        for (const result of results) {
            if (!result.previousState) {
                errors.push({
                    roomId: result.roomId,
                    error: "No previous state available for rollback",
                });
                continue;
            }
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                await queryRunner.manager.update("Room", { id: result.roomId }, result.previousState);
                result.status = "rolled_back";
                await this.roomActionResultRepo.save(result);
                await queryRunner.commitTransaction();
                rolledBackCount++;
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                errors.push({
                    roomId: result.roomId,
                    error: error instanceof Error ? error.message : "Rollback failed",
                });
            }
            finally {
                await queryRunner.release();
            }
        }
        return {
            success: errors.length === 0,
            rolledBackCount,
            errors,
        };
    }
    async createNotification(bulkActionId, recipientId, notificationType, message, metadata) {
        const notification = this.notificationRepo.create({
            bulkActionId,
            recipientId,
            notificationType,
            message,
            metadata,
        });
        return this.notificationRepo.save(notification);
    }
    async getNotifications(recipientId, isRead) {
        const query = { recipientId };
        if (isRead !== undefined) {
            query.isRead = isRead;
        }
        return this.notificationRepo.find({
            where: query,
            order: { createdAt: "DESC" },
        });
    }
    async markNotificationAsRead(notificationId) {
        await this.notificationRepo.update(notificationId, { isRead: true });
    }
    async getBulkActions(query) {
        const qb = this.bulkActionRepo.createQueryBuilder("action");
        if (query.status) {
            qb.andWhere("action.status = :status", { status: query.status });
        }
        if (query.actionType) {
            qb.andWhere("action.actionType = :actionType", {
                actionType: query.actionType,
            });
        }
        if (query.executedBy) {
            qb.andWhere("action.executedBy = :executedBy", {
                executedBy: query.executedBy,
            });
        }
        if (query.startDate && query.endDate) {
            qb.andWhere("action.createdAt BETWEEN :startDate AND :endDate", {
                startDate: query.startDate,
                endDate: query.endDate,
            });
        }
        qb.orderBy("action.createdAt", "DESC");
        const total = await qb.getCount();
        if (query.limit) {
            qb.limit(query.limit);
        }
        if (query.offset) {
            qb.offset(query.offset);
        }
        const actions = await qb.getMany();
        return { actions, total };
    }
    async getBulkActionById(id) {
        return this.bulkActionRepo.findOne({ where: { id } });
    }
    async getRoomActionResults(bulkActionId) {
        return this.roomActionResultRepo.find({
            where: { bulkActionId },
            order: { createdAt: "ASC" },
        });
    }
    async validateRooms(roomIds, actionType, payload) {
        const errors = [];
        return errors;
    }
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
    formatExecutionTime(ms) {
        if (ms < 1000)
            return `${ms}ms`;
        if (ms < 60000)
            return `${(ms / 1000).toFixed(1)}s`;
        return `${(ms / 60000).toFixed(1)}m`;
    }
};
exports.BulkRoomActionService = BulkRoomActionService;
exports.BulkRoomActionService = BulkRoomActionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Function, Function, Function])
], BulkRoomActionService);
//# sourceMappingURL=bulk-room-action.service.js.map