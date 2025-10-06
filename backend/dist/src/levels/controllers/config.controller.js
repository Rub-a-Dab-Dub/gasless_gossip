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
exports.ConfigController = exports.BulkThresholdsDto = exports.UpdateThresholdDto = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
class UpdateThresholdDto {
    xpRequired;
    badgeUnlocked;
}
exports.UpdateThresholdDto = UpdateThresholdDto;
class BulkThresholdsDto {
    thresholds;
}
exports.BulkThresholdsDto = BulkThresholdsDto;
let ConfigController = class ConfigController {
    dynamicXpThresholdsService;
    constructor(dynamicXpThresholdsService) {
        this.dynamicXpThresholdsService = dynamicXpThresholdsService;
    }
    async getAllThresholds() {
        return this.dynamicXpThresholdsService.getAllThresholds();
    }
    async getThresholdForLevel(level) {
        const xpRequired = await this.dynamicXpThresholdsService.getThresholdForLevel(level);
        const badgeUnlocked = await this.dynamicXpThresholdsService.getBadgeForLevel(level);
        return {
            level,
            xpRequired,
            badgeUnlocked,
        };
    }
    async updateThreshold(level, updateDto) {
        await this.dynamicXpThresholdsService.updateThreshold(level, updateDto.xpRequired, updateDto.badgeUnlocked);
        return { message: `XP threshold for level ${level} updated successfully` };
    }
    async createBulkThresholds(bulkDto) {
        await this.dynamicXpThresholdsService.createBulkThresholds(bulkDto.thresholds);
        return {
            message: 'XP thresholds created successfully',
            count: bulkDto.thresholds.length,
        };
    }
    async deactivateThreshold(level) {
        await this.dynamicXpThresholdsService.deactivateThreshold(level);
        return {
            message: `XP threshold for level ${level} deactivated successfully`,
        };
    }
    async validateThresholds() {
        return this.dynamicXpThresholdsService.validateThresholds();
    }
    async exportThresholds() {
        return this.dynamicXpThresholdsService.exportThresholds();
    }
    async importThresholds(importDto) {
        await this.dynamicXpThresholdsService.importThresholds(importDto.thresholds);
        return {
            message: 'XP thresholds imported successfully',
            count: importDto.thresholds.length,
        };
    }
    async previewLevel(totalXp) {
        const level = await this.dynamicXpThresholdsService.getLevelForXp(totalXp);
        const currentLevelThreshold = await this.dynamicXpThresholdsService.getThresholdForLevel(level);
        const nextLevelThreshold = await this.dynamicXpThresholdsService.getNextLevelThreshold(level);
        const currentXp = totalXp - currentLevelThreshold;
        const xpToNextLevel = Math.max(0, nextLevelThreshold - totalXp);
        const progressPercentage = nextLevelThreshold > currentLevelThreshold
            ? Math.round((currentXp / (nextLevelThreshold - currentLevelThreshold)) * 100)
            : 100;
        return {
            totalXp,
            level,
            currentXp,
            xpToNextLevel,
            progressPercentage,
        };
    }
};
exports.ConfigController = ConfigController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all XP thresholds configuration' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'XP thresholds retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getAllThresholds", null);
__decorate([
    (0, common_1.Get)(':level'),
    (0, swagger_1.ApiOperation)({ summary: 'Get XP threshold for specific level' }),
    (0, swagger_1.ApiParam)({ name: 'level', description: 'Level number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'XP threshold retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getThresholdForLevel", null);
__decorate([
    (0, common_1.Put)(':level'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update XP threshold for specific level' }),
    (0, swagger_1.ApiParam)({ name: 'level', description: 'Level number' }),
    (0, swagger_1.ApiBody)({ type: UpdateThresholdDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'XP threshold updated successfully',
    }),
    __param(0, (0, common_1.Param)('level', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateThresholdDto]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "updateThreshold", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Create multiple XP thresholds in bulk' }),
    (0, swagger_1.ApiBody)({ type: BulkThresholdsDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'XP thresholds created successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BulkThresholdsDto]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "createBulkThresholds", null);
__decorate([
    (0, common_1.Delete)(':level'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate XP threshold for specific level' }),
    (0, swagger_1.ApiParam)({ name: 'level', description: 'Level number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'XP threshold deactivated successfully',
    }),
    __param(0, (0, common_1.Param)('level', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "deactivateThreshold", null);
__decorate([
    (0, common_1.Get)('validate/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate all XP thresholds configuration' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Validation results',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "validateThresholds", null);
__decorate([
    (0, common_1.Get)('export/json'),
    (0, swagger_1.ApiOperation)({ summary: 'Export XP thresholds as JSON' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'XP thresholds exported successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "exportThresholds", null);
__decorate([
    (0, common_1.Post)('import/json'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Import XP thresholds from JSON' }),
    (0, swagger_1.ApiBody)({ type: BulkThresholdsDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'XP thresholds imported successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BulkThresholdsDto]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "importThresholds", null);
__decorate([
    (0, common_1.Get)('preview/:totalXp'),
    (0, swagger_1.ApiOperation)({
        summary: 'Preview what level a given XP amount would result in',
    }),
    (0, swagger_1.ApiParam)({ name: 'totalXp', description: 'Total XP amount' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Level preview calculated successfully',
    }),
    __param(0, (0, common_1.Param)('totalXp', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "previewLevel", null);
exports.ConfigController = ConfigController = __decorate([
    (0, swagger_1.ApiTags)('config'),
    (0, common_1.Controller)('config/xp-thresholds'),
    __metadata("design:paramtypes", [Function])
], ConfigController);
//# sourceMappingURL=config.controller.js.map