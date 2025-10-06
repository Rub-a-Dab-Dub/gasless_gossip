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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoDeleteController = void 0;
const common_1 = require("@nestjs/common");
const auto_delete_service_1 = require("../services/auto-delete.service");
const set_auto_delete_dto_1 = require("../dto/set-auto-delete.dto");
let AutoDeleteController = class AutoDeleteController {
    service;
    constructor(service) {
        this.service = service;
    }
    async setTimer(dto) {
        const timer = await this.service.setTimer(dto);
        return { messageId: timer.messageId, expiry: timer.expiry };
    }
    async getTimer(messageId) {
        const timer = await this.service.getTimer(messageId);
        return timer
            ? { messageId: timer.messageId, expiry: timer.expiry }
            : { messageId, expiry: null };
    }
};
exports.AutoDeleteController = AutoDeleteController;
__decorate([
    (0, common_1.Post)('set'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [set_auto_delete_dto_1.SetAutoDeleteDto]),
    __metadata("design:returntype", Promise)
], AutoDeleteController.prototype, "setTimer", null);
__decorate([
    (0, common_1.Get)(':messageId'),
    __param(0, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AutoDeleteController.prototype, "getTimer", null);
exports.AutoDeleteController = AutoDeleteController = __decorate([
    (0, common_1.Controller)('auto-delete'),
    __metadata("design:paramtypes", [auto_delete_service_1.AutoDeleteService])
], AutoDeleteController);
//# sourceMappingURL=auto-delete.controller.js.map