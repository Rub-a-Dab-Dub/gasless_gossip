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
exports.BulkRoomActionController = void 0;
const common_1 = require("@nestjs/common");
let BulkRoomActionController = class BulkRoomActionController {
    bulkRoomActionService;
    constructor(bulkRoomActionService) {
        this.bulkRoomActionService = bulkRoomActionService;
    }
    async createBulkAction(dto) {
        return this.bulkRoomActionService.createBulkAction(dto);
    }
    async executeBulkAction(dto) {
        return this.bulkRoomActionService.executeBulkAction(dto);
    }
    async rollbackBulkAction(dto) {
        return this.bulkRoomActionService.rollbackBulkAction(dto);
    }
    async getBulkActions(query) {
        return this.bulkRoomActionService.getBulkActions(query);
    }
    async getBulkActionById(id) {
        return this.bulkRoomActionService.getBulkActionById(id);
    }
    async getRoomActionResults(id) {
        return this.bulkRoomActionService.getRoomActionResults(id);
    }
    async getNotifications(recipientId, isRead) {
        return this.bulkRoomActionService.getNotifications(recipientId, isRead);
    }
    async markNotificationAsRead(id) {
        await this.bulkRoomActionService.markNotificationAsRead(id);
        return { message: "Notification marked as read" };
    }
};
exports.BulkRoomActionController = BulkRoomActionController;
__decorate([
    (0, common_1.Post)("preview"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], BulkRoomActionController.prototype, "createBulkAction", null);
__decorate([
    (0, common_1.Post)("execute"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], BulkRoomActionController.prototype, "executeBulkAction", null);
__decorate([
    (0, common_1.Post)("rollback"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], BulkRoomActionController.prototype, "rollbackBulkAction", null);
__decorate([
    (0, common_1.Get)("actions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], BulkRoomActionController.prototype, "getBulkActions", null);
__decorate([
    (0, common_1.Get)("actions/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BulkRoomActionController.prototype, "getBulkActionById", null);
__decorate([
    (0, common_1.Get)("actions/:id/results"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BulkRoomActionController.prototype, "getRoomActionResults", null);
__decorate([
    (0, common_1.Get)("notifications/:recipientId"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], BulkRoomActionController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Put)("notifications/:id/read"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BulkRoomActionController.prototype, "markNotificationAsRead", null);
exports.BulkRoomActionController = BulkRoomActionController = __decorate([
    (0, common_1.Controller)("bulk-room-action"),
    __metadata("design:paramtypes", [Function])
], BulkRoomActionController);
//# sourceMappingURL=bulk-room-action.controller.js.map