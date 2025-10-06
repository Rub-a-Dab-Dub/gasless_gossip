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
exports.RoomThemesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_theme_entity_1 = require("./entities/room-theme.entity");
const stellar_service_1 = require("../stellar/stellar.service");
let RoomThemesService = class RoomThemesService {
    roomThemesRepository;
    stellarService;
    constructor(roomThemesRepository, stellarService) {
        this.roomThemesRepository = roomThemesRepository;
        this.stellarService = stellarService;
    }
    async applyTheme(createRoomThemeDto, userId) {
        const isPremium = await this.stellarService.verifyPremiumThemeOwnership(userId, createRoomThemeDto.themeId);
        if (!isPremium) {
            throw new common_1.ForbiddenException('User does not own the required premium theme token');
        }
        let roomTheme = await this.roomThemesRepository.findOne({
            where: { roomId: createRoomThemeDto.roomId },
        });
        if (roomTheme) {
            roomTheme.themeId = createRoomThemeDto.themeId;
            roomTheme.metadata = createRoomThemeDto.metadata || roomTheme.metadata;
            const updated = await this.roomThemesRepository.save(roomTheme);
            return this.toResponseDto(updated);
        }
        else {
            const newRoomTheme = this.roomThemesRepository.create({
                roomId: createRoomThemeDto.roomId,
                themeId: createRoomThemeDto.themeId,
                metadata: createRoomThemeDto.metadata,
            });
            const saved = await this.roomThemesRepository.save(newRoomTheme);
            return this.toResponseDto(saved);
        }
    }
    async getRoomTheme(roomId) {
        const roomTheme = await this.roomThemesRepository.findOne({
            where: { roomId },
        });
        return roomTheme ? this.toResponseDto(roomTheme) : null;
    }
    toResponseDto(roomTheme) {
        return {
            id: roomTheme.id,
            roomId: roomTheme.roomId,
            themeId: roomTheme.themeId,
            metadata: roomTheme.metadata,
            createdAt: roomTheme.createdAt,
            updatedAt: roomTheme.updatedAt,
        };
    }
};
exports.RoomThemesService = RoomThemesService;
exports.RoomThemesService = RoomThemesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_theme_entity_1.RoomTheme)),
    __param(1, (0, common_1.Inject)(stellar_service_1.StellarService)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stellar_service_1.StellarService])
], RoomThemesService);
//# sourceMappingURL=room-themes.service.js.map