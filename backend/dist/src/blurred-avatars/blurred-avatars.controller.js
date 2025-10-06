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
exports.BlurredAvatarsController = void 0;
const common_1 = require("@nestjs/common");
const blurred_avatars_service_1 = require("./blurred-avatars.service");
const create_blurred_avatar_dto_1 = require("./dto/create-blurred-avatar.dto");
const update_blurred_avatar_dto_1 = require("./dto/update-blurred-avatar.dto");
const auth_guard_1 = require("../auth/auth.guard");
let BlurredAvatarsController = class BlurredAvatarsController {
    blurredAvatarsService;
    constructor(blurredAvatarsService) {
        this.blurredAvatarsService = blurredAvatarsService;
    }
    async createBlurredAvatar(createBlurredAvatarDto) {
        const avatar = await this.blurredAvatarsService.createBlurredAvatar(createBlurredAvatarDto);
        return {
            success: true,
            message: 'Blurred avatar created successfully',
            data: avatar,
        };
    }
    async getBlurredAvatars(userId, latest) {
        if (latest === 'true') {
            const avatar = await this.blurredAvatarsService.findLatestByUserId(userId);
            return {
                success: true,
                message: avatar ? 'Latest blurred avatar retrieved successfully' : 'No blurred avatar found',
                data: avatar,
            };
        }
        const avatars = await this.blurredAvatarsService.findAllByUserId(userId);
        return {
            success: true,
            message: 'Blurred avatars retrieved successfully',
            data: avatars,
        };
    }
    async getBlurredAvatarStats(userId) {
        const stats = await this.blurredAvatarsService.getBlurredAvatarStats(userId);
        return {
            success: true,
            message: 'Blurred avatar stats retrieved successfully',
            data: stats,
        };
    }
    async updateBlurredAvatar(id, updateBlurredAvatarDto) {
        const avatar = await this.blurredAvatarsService.updateBlurredAvatar(id, updateBlurredAvatarDto);
        return {
            success: true,
            message: 'Blurred avatar updated successfully',
            data: avatar,
        };
    }
    async removeBlurredAvatar(id) {
        await this.blurredAvatarsService.remove(id);
        return {
            success: true,
            message: 'Blurred avatar removed successfully',
        };
    }
};
exports.BlurredAvatarsController = BlurredAvatarsController;
__decorate([
    (0, common_1.Post)('blur'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blurred_avatar_dto_1.CreateBlurredAvatarDto]),
    __metadata("design:returntype", Promise)
], BlurredAvatarsController.prototype, "createBlurredAvatar", null);
__decorate([
    (0, common_1.Get)('blurred/:userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('latest')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BlurredAvatarsController.prototype, "getBlurredAvatars", null);
__decorate([
    (0, common_1.Get)('blurred/:userId/stats'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlurredAvatarsController.prototype, "getBlurredAvatarStats", null);
__decorate([
    (0, common_1.Patch)('blur/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_blurred_avatar_dto_1.UpdateBlurredAvatarDto]),
    __metadata("design:returntype", Promise)
], BlurredAvatarsController.prototype, "updateBlurredAvatar", null);
__decorate([
    (0, common_1.Delete)('blur/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlurredAvatarsController.prototype, "removeBlurredAvatar", null);
exports.BlurredAvatarsController = BlurredAvatarsController = __decorate([
    (0, common_1.Controller)('avatars'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [blurred_avatars_service_1.BlurredAvatarsService])
], BlurredAvatarsController);
//# sourceMappingURL=blurred-avatars.controller.js.map