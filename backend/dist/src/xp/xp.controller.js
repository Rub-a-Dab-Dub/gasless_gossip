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
exports.XpController = void 0;
const common_1 = require("@nestjs/common");
const xp_service_1 = require("./xp.service");
const add_xp_dto_1 = require("./dto/add-xp.dto");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stellar_account_entity_1 = require("./stellar-account.entity");
let XpController = class XpController {
    xpService;
    stellarAccountRepo;
    constructor(xpService, stellarAccountRepo) {
        this.xpService = xpService;
        this.stellarAccountRepo = stellarAccountRepo;
    }
    async getXp(userId) {
        const xp = await this.xpService.getXpForUser(userId);
        return { userId, xp };
    }
    async addXp(body) {
        await this.xpService.addXp(body.userId, body.amount, body.source);
        const xp = await this.xpService.getXpForUser(body.userId);
        return { userId: body.userId, xp };
    }
    async handleEvent(event) {
        const res = await this.xpService.handleEvent(event);
        return { processed: !!res };
    }
    async mapAccount(body) {
        const existing = await this.stellarAccountRepo.findOne({
            where: { stellarAccount: body.stellarAccount },
        });
        if (existing) {
            existing.userId = body.userId ?? existing.userId;
            await this.stellarAccountRepo.save(existing);
            return existing;
        }
        const created = this.stellarAccountRepo.create({
            stellarAccount: body.stellarAccount,
            userId: body.userId,
        });
        await this.stellarAccountRepo.save(created);
        return created;
    }
};
exports.XpController = XpController;
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], XpController.prototype, "getXp", null);
__decorate([
    (0, common_1.Post)('add'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_xp_dto_1.AddXpDto]),
    __metadata("design:returntype", Promise)
], XpController.prototype, "addXp", null);
__decorate([
    (0, common_1.Post)('event'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_xp_dto_1.StellarEventDto]),
    __metadata("design:returntype", Promise)
], XpController.prototype, "handleEvent", null);
__decorate([
    (0, common_1.Post)('map-account'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_xp_dto_1.MapStellarAccountDto]),
    __metadata("design:returntype", Promise)
], XpController.prototype, "mapAccount", null);
exports.XpController = XpController = __decorate([
    (0, common_1.Controller)('xp'),
    __param(1, (0, typeorm_1.InjectRepository)(stellar_account_entity_1.StellarAccount)),
    __metadata("design:paramtypes", [xp_service_1.XpService,
        typeorm_2.Repository])
], XpController);
//# sourceMappingURL=xp.controller.js.map