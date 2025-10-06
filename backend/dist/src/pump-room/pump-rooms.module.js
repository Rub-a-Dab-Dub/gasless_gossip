"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PumpRoomsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const pump_room_entity_1 = require("./entities/pump-room.entity");
const pump_rooms_service_1 = require("./services/pump-rooms.service");
const pump_rooms_controller_1 = require("./controllers/pump-rooms.controller");
const stellar_service_1 = require("./services/stellar.service");
let PumpRoomsModule = class PumpRoomsModule {
};
exports.PumpRoomsModule = PumpRoomsModule;
exports.PumpRoomsModule = PumpRoomsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([pump_room_entity_1.PumpRoom]),
            config_1.ConfigModule
        ],
        controllers: [pump_rooms_controller_1.PumpRoomsController],
        providers: [pump_rooms_service_1.PumpRoomsService, stellar_service_1.StellarService],
        exports: [pump_rooms_service_1.PumpRoomsService, stellar_service_1.StellarService],
    })
], PumpRoomsModule);
const testing_1 = require("@nestjs/testing");
const typeorm_2 = require("@nestjs/typeorm");
const common_2 = require("@nestjs/common");
describe('PumpRoomsService', () => {
    let service;
    let repository;
    let stellarService;
    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
    };
    const mockStellarService = {
        calculateRewardAmount: jest.fn(),
        executeRewardContract: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                pump_rooms_service_1.PumpRoomsService,
                {
                    provide: (0, typeorm_2.getRepositoryToken)(pump_room_entity_1.PumpRoom),
                    useValue: mockRepository,
                },
                {
                    provide: stellar_service_1.StellarService,
                    useValue: mockStellarService,
                },
            ],
        }).compile();
        service = module.get(pump_rooms_service_1.PumpRoomsService);
        repository = module.get((0, typeorm_2.getRepositoryToken)(pump_room_entity_1.PumpRoom));
        stellarService = module.get(stellar_service_1.StellarService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('createRoom', () => {
        it('should create a new room successfully', async () => {
            const createDto = {
                roomId: 'test-room-1',
                predictions: [
                    { id: 'pred1', title: 'Bitcoin will reach $100k' },
                    { id: 'pred2', title: 'Ethereum will flip Bitcoin' }
                ]
            };
            const savedRoom = { id: 'uuid', ...createDto, votes: {}, totalVotes: 0 };
            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue(savedRoom);
            mockRepository.save.mockResolvedValue(savedRoom);
            const result = await service.createRoom(createDto);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { roomId: createDto.roomId }
            });
            expect(mockRepository.create).toHaveBeenCalled();
            expect(mockRepository.save).toHaveBeenCalled();
            expect(result).toEqual(savedRoom);
        });
        it('should throw error if room already exists', async () => {
            const createDto = {
                roomId: 'existing-room',
                predictions: [{ id: 'pred1', title: 'Test prediction' }]
            };
            mockRepository.findOne.mockResolvedValue({ id: 'existing' });
            await expect(service.createRoom(createDto)).rejects.toThrow(common_2.BadRequestException);
        });
    });
    describe('vote', () => {
        it('should record vote successfully with Stellar reward', async () => {
            const voteDto = {
                roomId: 'test-room',
                predictionId: 'pred1',
                userId: 'user123',
                confidence: 80,
                stellarAddress: 'STELLAR_ADDRESS'
            };
            const room = {
                id: 'room-id',
                roomId: 'test-room',
                predictions: [{ id: 'pred1', title: 'Test prediction' }],
                votes: {},
                totalVotes: 0,
                isActive: true,
                endDate: null
            };
            const stellarReward = {
                transactionHash: 'stellar_tx_123',
                amount: 15,
                recipientAddress: 'STELLAR_ADDRESS'
            };
            mockRepository.findOne.mockResolvedValue(room);
            mockStellarService.calculateRewardAmount.mockReturnValue(15);
            mockStellarService.executeRewardContract.mockResolvedValue(stellarReward);
            mockRepository.save.mockResolvedValue({ ...room, totalVotes: 1 });
            const result = await service.vote(voteDto);
            expect(result.confidence).toBe(80);
            expect(result.stellarReward).toEqual(stellarReward);
            expect(mockStellarService.executeRewardContract).toHaveBeenCalledWith('STELLAR_ADDRESS', 15, 'test-room', 'pred1');
        });
        it('should throw error for non-existent room', async () => {
            const voteDto = {
                roomId: 'non-existent',
                predictionId: 'pred1',
                userId: 'user123',
                confidence: 80
            };
            mockRepository.findOne.mockResolvedValue(null);
            await expect(service.vote(voteDto)).rejects.toThrow(common_2.NotFoundException);
        });
        it('should throw error for duplicate vote', async () => {
            const voteDto = {
                roomId: 'test-room',
                predictionId: 'pred1',
                userId: 'user123',
                confidence: 80
            };
            const room = {
                roomId: 'test-room',
                predictions: [{ id: 'pred1', title: 'Test prediction' }],
                votes: { 'user123_pred1': { existing: 'vote' } },
                totalVotes: 1,
                isActive: true,
                endDate: null
            };
            mockRepository.findOne.mockResolvedValue(room);
            await expect(service.vote(voteDto)).rejects.toThrow(common_2.BadRequestException);
        });
    });
    describe('getVotingData', () => {
        it('should return voting statistics', async () => {
            const room = {
                roomId: 'test-room',
                predictions: [
                    { id: 'pred1', title: 'Bitcoin $100k' },
                    { id: 'pred2', title: 'Ethereum flip' }
                ],
                votes: {
                    'user1_pred1': { predictionId: 'pred1', confidence: 80 },
                    'user2_pred1': { predictionId: 'pred1', confidence: 90 },
                    'user3_pred2': { predictionId: 'pred2', confidence: 70 }
                },
                totalVotes: 3,
                isActive: true,
                endDate: null,
                createdAt: new Date()
            };
            mockRepository.findOne.mockResolvedValue(room);
            const result = await service.getVotingData('test-room');
            expect(result.totalVotes).toBe(3);
            expect(result.predictions).toHaveLength(2);
            expect(result.predictions[0].voteCount).toBe(2);
            expect(result.predictions[0].averageConfidence).toBe(85);
            expect(result.predictions[1].voteCount).toBe(1);
            expect(result.predictions[1].averageConfidence).toBe(70);
        });
    });
});
//# sourceMappingURL=pump-rooms.module.js.map