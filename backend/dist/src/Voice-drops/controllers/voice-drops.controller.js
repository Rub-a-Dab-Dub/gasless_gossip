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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceDropsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const voice_drops_service_1 = require("../services/voice-drops.service");
const dto_1 = require("../dto");
let VoiceDropsController = class VoiceDropsController {
    voiceDropsService;
    constructor(voiceDropsService) {
        this.voiceDropsService = voiceDropsService;
    }
    async createVoiceDrop(createVoiceDropDto, audioFile) {
        const userId = 'mock-user-id';
        return this.voiceDropsService.createVoiceDrop(createVoiceDropDto, audioFile, userId);
    }
    async getVoiceDropsByRoom(roomId, query) {
        const userId = 'mock-user-id';
        return this.voiceDropsService.getVoiceDropsByRoom(roomId, query, userId);
    }
    async getVoiceDropById(id) {
        const userId = 'mock-user-id';
        return this.voiceDropsService.getVoiceDropById(id, userId);
    }
    async deleteVoiceDrop(id) {
        const userId = 'mock-user-id';
        return this.voiceDropsService.deleteVoiceDrop(id, userId);
    }
};
exports.VoiceDropsController = VoiceDropsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('audio')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a voice drop to a room' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Voice drop created successfully',
        type: dto_1.VoiceDropResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof dto_1.CreateVoiceDropDto !== "undefined" && dto_1.CreateVoiceDropDto) === "function" ? _a : Object, typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], VoiceDropsController.prototype, "createVoiceDrop", null);
__decorate([
    (0, common_1.Get)(':roomId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get voice drops for a room' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Voice drops retrieved successfully',
        type: [dto_1.VoiceDropResponseDto],
    }),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof dto_1.GetVoiceDropsDto !== "undefined" && dto_1.GetVoiceDropsDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], VoiceDropsController.prototype, "getVoiceDropsByRoom", null);
__decorate([
    (0, common_1.Get)('single/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific voice drop' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Voice drop retrieved successfully',
        type: dto_1.VoiceDropResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VoiceDropsController.prototype, "getVoiceDropById", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a voice drop' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Voice drop deleted successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VoiceDropsController.prototype, "deleteVoiceDrop", null);
exports.VoiceDropsController = VoiceDropsController = __decorate([
    (0, swagger_1.ApiTags)('Voice Drops'),
    (0, common_1.Controller)('voice-drops'),
    __metadata("design:paramtypes", [voice_drops_service_1.VoiceDropsService])
], VoiceDropsController);
//# sourceMappingURL=voice-drops.controller.js.map