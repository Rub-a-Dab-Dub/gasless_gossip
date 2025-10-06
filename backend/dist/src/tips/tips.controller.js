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
exports.TipsModule = exports.TipsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const tips_service_1 = require("./tips.service");
const create_tip_dto_1 = require("./dto/create-tip.dto");
let TipsController = class TipsController {
    tipsService;
    constructor(tipsService) {
        this.tipsService = tipsService;
    }
    async createTip(createTipDto, req) {
        const senderId = req.user.id;
        return this.tipsService.createTip(createTipDto, senderId);
    }
    async getUserTips(userId, req) {
        const requestingUserId = req.user.id;
        return this.tipsService.getUserTips(userId, requestingUserId);
    }
    async getUserTipAnalytics(userId, req) {
        const requestingUserId = req.user.id;
        if (userId !== requestingUserId) {
            throw new Error('Access denied: Can only view your own analytics');
        }
        return this.tipsService.getTipAnalytics(userId);
    }
};
exports.TipsController = TipsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tip_dto_1.CreateTipDto, Object]),
    __metadata("design:returntype", Promise)
], tips_controller_1.TipsController.prototype, "createTip", null);
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], tips_controller_1.TipsController.prototype, "getUserTips", null);
__decorate([
    (0, common_1.Get)(':userId/analytics'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], tips_controller_1.TipsController.prototype, "getUserTipAnalytics", null);
exports.TipsController = tips_controller_1.TipsController = __decorate([
    (0, common_1.Controller)('tips'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [tips_service_1.TipsService])
], tips_controller_1.TipsController);
const common_2 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const tips_controller_1 = require("./tips.controller");
Object.defineProperty(exports, "TipsController", { enumerable: true, get: function () { return tips_controller_1.TipsController; } });
const stellar_service_1 = require("./services/stellar.service");
const analytics_service_1 = require("./services/analytics.service");
const tip_entity_1 = require("./entities/tip.entity");
let TipsModule = class TipsModule {
};
exports.TipsModule = TipsModule;
exports.TipsModule = TipsModule = __decorate([
    (0, common_2.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([tip_entity_1.Tip]),
            config_1.ConfigModule,
            event_emitter_1.EventEmitterModule.forRoot()
        ],
        controllers: [tips_controller_1.TipsController],
        providers: [tips_service_1.TipsService, stellar_service_1.StellarService, analytics_service_1.AnalyticsService],
        exports: [tips_service_1.TipsService, stellar_service_1.StellarService, analytics_service_1.AnalyticsService]
    })
], TipsModule);
const testing_1 = require("@nestjs/testing");
const typeorm_2 = require("@nestjs/typeorm");
const common_3 = require("@nestjs/common");
describe('TipsService', () => {
    let service;
    let repository;
    let stellarService;
    let analyticsService;
    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        createQueryBuilder: jest.fn(() => ({
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getMany: jest.fn(),
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            getRawOne: jest.fn(),
        })),
    };
    const mockStellarService = {
        transferTokens: jest.fn(),
        getTransactionStatus: jest.fn(),
    };
    const mockAnalyticsService = {
        emitTipEvent: jest.fn(),
        trackUserEngagement: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                tips_service_1.TipsService,
                {
                    provide: (0, typeorm_2.getRepositoryToken)(tip_entity_1.Tip),
                    useValue: mockRepository,
                },
                {
                    provide: stellar_service_1.StellarService,
                    useValue: mockStellarService,
                },
                {
                    provide: analytics_service_1.AnalyticsService,
                    useValue: mockAnalyticsService,
                },
            ],
        }).compile();
        service = module.get(tips_service_1.TipsService);
        repository = module.get((0, typeorm_2.getRepositoryToken)(tip_entity_1.Tip));
        stellarService = module.get(stellar_service_1.StellarService);
        analyticsService = module.get(analytics_service_1.AnalyticsService);
    });
    describe('createTip', () => {
        it('should create a tip successfully', async () => {
            const createTipDto = { amount: 10, receiverId: 'user2' };
            const senderId = 'user1';
            const mockStellarTx = {
                hash: 'stellar_abc123',
                amount: '10',
                from: 'mock_sender',
                to: 'mock_receiver',
                timestamp: new Date(),
            };
            const mockTip = {
                id: 'tip-id',
                amount: 10,
                receiverId: 'user2',
                senderId: 'user1',
                txId: 'stellar_abc123',
                createdAt: new Date(),
            };
            mockStellarService.transferTokens.mockResolvedValue(mockStellarTx);
            mockRepository.create.mockReturnValue(mockTip);
            mockRepository.save.mockResolvedValue(mockTip);
            const result = await service.createTip(createTipDto, senderId);
            expect(mockStellarService.transferTokens).toHaveBeenCalled();
            expect(mockRepository.create).toHaveBeenCalledWith({
                amount: 10,
                receiverId: 'user2',
                senderId: 'user1',
                txId: 'stellar_abc123',
            });
            expect(mockAnalyticsService.emitTipEvent).toHaveBeenCalledTimes(2);
            expect(result.txId).toBe('stellar_abc123');
        });
        it('should throw error when trying to tip yourself', async () => {
            const createTipDto = { amount: 10, receiverId: 'user1' };
            const senderId = 'user1';
            await expect(service.createTip(createTipDto, senderId)).rejects.toThrow(common_3.BadRequestException);
        });
    });
    describe('getUserTips', () => {
        it('should return user tips', async () => {
            const userId = 'user1';
            const mockTips = [
                {
                    id: 'tip-1',
                    amount: 10,
                    receiverId: 'user1',
                    senderId: 'user2',
                    txId: 'tx-1',
                    createdAt: new Date(),
                },
            ];
            const mockQueryBuilder = mockRepository.createQueryBuilder();
            mockQueryBuilder.getMany.mockResolvedValue(mockTips);
            const result = await service.getUserTips(userId);
            expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('tip');
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('tip-1');
        });
    });
});
//# sourceMappingURL=tips.controller.js.map