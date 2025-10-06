"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const token_gift_service_1 = require("../services/token-gift.service");
const token_gift_entity_1 = require("../entities/token-gift.entity");
const token_gift_transaction_entity_1 = require("../entities/token-gift-transaction.entity");
describe('TokenGiftService Performance Tests', () => {
    let service;
    let mockTokenGiftRepo;
    let mockTransactionRepo;
    let mockConfigService;
    beforeEach(async () => {
        mockTokenGiftRepo = {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            count: jest.fn(),
        };
        mockTransactionRepo = {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
        };
        mockConfigService = {
            get: jest.fn((key, defaultValue) => {
                const config = {
                    STELLAR_NETWORK: 'testnet',
                    BASE_PAYMASTER_ADDRESS: '0x1234567890123456789012345678901234567890',
                    BASE_PAYMASTER_MAX_GAS: '1000000',
                };
                return config[key] || defaultValue;
            }),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                token_gift_service_1.TokenGiftService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(token_gift_entity_1.TokenGift),
                    useValue: mockTokenGiftRepo,
                },
                {
                    provide: (0, typeorm_1.getRepositoryToken)(token_gift_transaction_entity_1.TokenGiftTransaction),
                    useValue: mockTransactionRepo,
                },
                {
                    provide: config_1.ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();
        service = module.get(token_gift_service_1.TokenGiftService);
    });
    describe('Performance with <2s processing time', () => {
        it('should process token gifts in under 2 seconds', async () => {
            const createDto = {
                recipientId: 'user-456',
                tokenAddress: '0x1234567890123456789012345678901234567890',
                tokenSymbol: 'USDC',
                amount: '100.00',
                network: 'stellar',
                message: 'Performance test gift',
            };
            const mockGift = {
                id: 'gift-123',
                senderId: 'user-123',
                ...createDto,
                status: 'completed',
                stellarTxHash: 'stellar-tx-hash',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const mockTransaction = {
                id: 'tx-123',
                giftId: 'gift-123',
                network: 'stellar',
                txHash: 'stellar-tx-hash',
                status: 'confirmed',
                sponsored: false,
                createdAt: new Date(),
            };
            mockTokenGiftRepo.create.mockReturnValue(mockGift);
            mockTokenGiftRepo.save.mockResolvedValue(mockGift);
            mockTransactionRepo.create.mockReturnValue(mockTransaction);
            mockTransactionRepo.save.mockResolvedValue(mockTransaction);
            const startTime = Date.now();
            const result = await service.createTokenGift(createDto, 'user-123');
            const endTime = Date.now();
            const processingTime = endTime - startTime;
            expect(result.gift.status).toBe('completed');
            expect(processingTime).toBeLessThan(2000);
            expect(result.gift.stellarTxHash).toBe('stellar-tx-hash');
            console.log(`Token Gift Processing Performance:
        Processing Time: ${processingTime}ms
        Gift ID: ${result.gift.id}
        Status: ${result.gift.status}
        Network: ${result.gift.network}`);
        });
        it('should handle gasless transactions efficiently', async () => {
            const createDto = {
                recipientId: 'user-456',
                tokenAddress: '0x1234567890123456789012345678901234567890',
                tokenSymbol: 'USDC',
                amount: '100.00',
                network: 'base',
                message: 'Gasless gift',
            };
            const mockGift = {
                id: 'gift-456',
                senderId: 'user-123',
                ...createDto,
                status: 'completed',
                baseTxHash: 'base-tx-hash',
                paymasterTxHash: 'paymaster-tx-hash',
                sponsored: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const mockStellarTx = {
                id: 'tx-stellar',
                giftId: 'gift-456',
                network: 'stellar',
                txHash: 'stellar-tx-hash',
                status: 'confirmed',
                sponsored: false,
                createdAt: new Date(),
            };
            const mockBaseTx = {
                id: 'tx-base',
                giftId: 'gift-456',
                network: 'base',
                txHash: 'base-tx-hash',
                status: 'confirmed',
                sponsored: true,
                paymasterAddress: '0x1234567890123456789012345678901234567890',
                createdAt: new Date(),
            };
            mockTokenGiftRepo.create.mockReturnValue(mockGift);
            mockTokenGiftRepo.save.mockResolvedValue(mockGift);
            mockTransactionRepo.create
                .mockReturnValueOnce(mockStellarTx)
                .mockReturnValueOnce(mockBaseTx);
            mockTransactionRepo.save
                .mockResolvedValueOnce(mockStellarTx)
                .mockResolvedValueOnce(mockBaseTx);
            const startTime = Date.now();
            const result = await service.createTokenGift(createDto, 'user-123');
            const endTime = Date.now();
            const processingTime = endTime - startTime;
            expect(result.gift.status).toBe('completed');
            expect(processingTime).toBeLessThan(2000);
            expect(result.transactions).toHaveLength(2);
            expect(result.transactions[1].sponsored).toBe(true);
            expect(result.paymasterStatus?.sponsored).toBe(true);
            console.log(`Gasless Transaction Performance:
        Processing Time: ${processingTime}ms
        Gift ID: ${result.gift.id}
        Stellar TX: ${result.gift.stellarTxHash}
        Base TX: ${result.gift.baseTxHash}
        Paymaster TX: ${result.gift.paymasterTxHash}
        Sponsored: ${result.transactions[1].sponsored}`);
        });
        it('should handle concurrent token gifts efficiently', async () => {
            const createDtos = Array.from({ length: 10 }, (_, i) => ({
                recipientId: `user-${i}`,
                tokenAddress: '0x1234567890123456789012345678901234567890',
                tokenSymbol: 'USDC',
                amount: '100.00',
                network: 'stellar',
                message: `Concurrent gift ${i}`,
            }));
            const mockGift = {
                id: 'gift-123',
                senderId: 'user-123',
                recipientId: 'user-456',
                tokenSymbol: 'USDC',
                amount: '100.00',
                network: 'stellar',
                status: 'completed',
                stellarTxHash: 'stellar-tx-hash',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const mockTransaction = {
                id: 'tx-123',
                giftId: 'gift-123',
                network: 'stellar',
                txHash: 'stellar-tx-hash',
                status: 'confirmed',
                sponsored: false,
                createdAt: new Date(),
            };
            mockTokenGiftRepo.create.mockReturnValue(mockGift);
            mockTokenGiftRepo.save.mockResolvedValue(mockGift);
            mockTransactionRepo.create.mockReturnValue(mockTransaction);
            mockTransactionRepo.save.mockResolvedValue(mockTransaction);
            const startTime = Date.now();
            const promises = createDtos.map(dto => service.createTokenGift(dto, 'user-123'));
            const results = await Promise.all(promises);
            const endTime = Date.now();
            const totalTime = endTime - startTime;
            expect(results).toHaveLength(10);
            expect(totalTime).toBeLessThan(5000);
            expect(totalTime / 10).toBeLessThan(500);
            console.log(`Concurrent Token Gifts Performance:
        Total Gifts: 10
        Total Time: ${totalTime}ms
        Average Time per Gift: ${(totalTime / 10).toFixed(2)}ms
        Gifts per Second: ${(10 / (totalTime / 1000)).toFixed(2)}`);
        });
        it('should maintain performance under sustained load', async () => {
            const createDto = {
                recipientId: 'user-456',
                tokenAddress: '0x1234567890123456789012345678901234567890',
                tokenSymbol: 'USDC',
                amount: '100.00',
                network: 'stellar',
                message: 'Sustained load test',
            };
            const mockGift = {
                id: 'gift-123',
                senderId: 'user-123',
                ...createDto,
                status: 'completed',
                stellarTxHash: 'stellar-tx-hash',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const mockTransaction = {
                id: 'tx-123',
                giftId: 'gift-123',
                network: 'stellar',
                txHash: 'stellar-tx-hash',
                status: 'confirmed',
                sponsored: false,
                createdAt: new Date(),
            };
            mockTokenGiftRepo.create.mockReturnValue(mockGift);
            mockTokenGiftRepo.save.mockResolvedValue(mockGift);
            mockTransactionRepo.create.mockReturnValue(mockTransaction);
            mockTransactionRepo.save.mockResolvedValue(mockTransaction);
            const latencies = [];
            const iterations = 50;
            for (let i = 0; i < iterations; i++) {
                const startTime = Date.now();
                await service.createTokenGift(createDto, 'user-123');
                const endTime = Date.now();
                latencies.push(endTime - startTime);
            }
            const averageLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
            const maxLatency = Math.max(...latencies);
            const minLatency = Math.min(...latencies);
            expect(averageLatency).toBeLessThan(2000);
            expect(maxLatency).toBeLessThan(5000);
            expect(minLatency).toBeLessThan(1000);
            console.log(`Sustained Load Performance:
        Average Latency: ${averageLatency.toFixed(2)}ms
        Max Latency: ${maxLatency}ms
        Min Latency: ${minLatency}ms
        Total Operations: ${iterations}`);
        });
    });
    describe('Database query performance', () => {
        it('should fetch token gifts efficiently', async () => {
            const mockGifts = Array.from({ length: 100 }, (_, i) => ({
                id: `gift-${i}`,
                senderId: 'user-123',
                recipientId: `user-${i}`,
                tokenSymbol: 'USDC',
                amount: '100.00',
                status: 'completed',
                createdAt: new Date(),
                updatedAt: new Date(),
            }));
            mockTokenGiftRepo.find.mockResolvedValue(mockGifts);
            const startTime = Date.now();
            const result = await service.getUserTokenGifts('user-123', 100);
            const endTime = Date.now();
            const queryTime = endTime - startTime;
            expect(result).toHaveLength(100);
            expect(queryTime).toBeLessThan(500);
            console.log(`Token Gifts Query Performance:
        Query Time: ${queryTime}ms
        Records Returned: ${result.length}
        Records per Second: ${(result.length / (queryTime / 1000)).toFixed(2)}`);
        });
        it('should handle gas estimation efficiently', async () => {
            const dto = {
                recipientId: 'user-456',
                tokenAddress: '0x1234567890123456789012345678901234567890',
                tokenSymbol: 'USDC',
                amount: '100.00',
                network: 'base',
            };
            const startTime = Date.now();
            const result = await service.getGasEstimate(dto);
            const endTime = Date.now();
            const estimationTime = endTime - startTime;
            expect(result.network).toBe('base');
            expect(result.gasUsed).toBeDefined();
            expect(result.gasPrice).toBeDefined();
            expect(result.totalCost).toBeDefined();
            expect(estimationTime).toBeLessThan(100);
            console.log(`Gas Estimation Performance:
        Estimation Time: ${estimationTime}ms
        Network: ${result.network}
        Gas Used: ${result.gasUsed}
        Gas Price: ${result.gasPrice}
        Total Cost: ${result.totalCost}`);
        });
        it('should handle paymaster status checks efficiently', async () => {
            const startTime = Date.now();
            const result = await service.getPaymasterStatus('base');
            const endTime = Date.now();
            const checkTime = endTime - startTime;
            expect(result.available).toBe(true);
            expect(result.sponsored).toBe(true);
            expect(result.network).toBe('base');
            expect(checkTime).toBeLessThan(100);
            console.log(`Paymaster Status Check Performance:
        Check Time: ${checkTime}ms
        Available: ${result.available}
        Sponsored: ${result.sponsored}
        Max Gas: ${result.maxGas}
        Remaining Balance: ${result.remainingBalance}`);
        });
    });
    describe('Multichain UX performance', () => {
        it('should handle Stellar Testnet transactions efficiently', async () => {
            const createDto = {
                recipientId: 'user-456',
                tokenAddress: '0x1234567890123456789012345678901234567890',
                tokenSymbol: 'XLM',
                amount: '100.00',
                network: 'stellar',
                message: 'Stellar testnet gift',
            };
            const mockGift = {
                id: 'gift-stellar',
                senderId: 'user-123',
                ...createDto,
                status: 'completed',
                stellarTxHash: 'stellar-testnet-tx-hash',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const mockTransaction = {
                id: 'tx-stellar',
                giftId: 'gift-stellar',
                network: 'stellar',
                txHash: 'stellar-testnet-tx-hash',
                status: 'confirmed',
                sponsored: false,
                createdAt: new Date(),
            };
            mockTokenGiftRepo.create.mockReturnValue(mockGift);
            mockTokenGiftRepo.save.mockResolvedValue(mockGift);
            mockTransactionRepo.create.mockReturnValue(mockTransaction);
            mockTransactionRepo.save.mockResolvedValue(mockTransaction);
            const startTime = Date.now();
            const result = await service.createTokenGift(createDto, 'user-123');
            const endTime = Date.now();
            const processingTime = endTime - startTime;
            expect(result.gift.network).toBe('stellar');
            expect(result.gift.stellarTxHash).toBe('stellar-testnet-tx-hash');
            expect(processingTime).toBeLessThan(2000);
            console.log(`Stellar Testnet Performance:
        Processing Time: ${processingTime}ms
        Network: ${result.gift.network}
        TX Hash: ${result.gift.stellarTxHash}
        Status: ${result.gift.status}`);
        });
        it('should handle Base Sepolia transactions efficiently', async () => {
            const createDto = {
                recipientId: 'user-456',
                tokenAddress: '0x1234567890123456789012345678901234567890',
                tokenSymbol: 'USDC',
                amount: '100.00',
                network: 'base',
                message: 'Base Sepolia gift',
            };
            const mockGift = {
                id: 'gift-base',
                senderId: 'user-123',
                ...createDto,
                status: 'completed',
                baseTxHash: 'base-sepolia-tx-hash',
                paymasterTxHash: 'paymaster-tx-hash',
                sponsored: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const mockStellarTx = {
                id: 'tx-stellar',
                giftId: 'gift-base',
                network: 'stellar',
                txHash: 'stellar-tx-hash',
                status: 'confirmed',
                sponsored: false,
                createdAt: new Date(),
            };
            const mockBaseTx = {
                id: 'tx-base',
                giftId: 'gift-base',
                network: 'base',
                txHash: 'base-sepolia-tx-hash',
                status: 'confirmed',
                sponsored: true,
                paymasterAddress: '0x1234567890123456789012345678901234567890',
                createdAt: new Date(),
            };
            mockTokenGiftRepo.create.mockReturnValue(mockGift);
            mockTokenGiftRepo.save.mockResolvedValue(mockGift);
            mockTransactionRepo.create
                .mockReturnValueOnce(mockStellarTx)
                .mockReturnValueOnce(mockBaseTx);
            mockTransactionRepo.save
                .mockResolvedValueOnce(mockStellarTx)
                .mockResolvedValueOnce(mockBaseTx);
            const startTime = Date.now();
            const result = await service.createTokenGift(createDto, 'user-123');
            const endTime = Date.now();
            const processingTime = endTime - startTime;
            expect(result.gift.network).toBe('base');
            expect(result.gift.baseTxHash).toBe('base-sepolia-tx-hash');
            expect(result.gift.paymasterTxHash).toBe('paymaster-tx-hash');
            expect(processingTime).toBeLessThan(2000);
            console.log(`Base Sepolia Performance:
        Processing Time: ${processingTime}ms
        Network: ${result.gift.network}
        Base TX Hash: ${result.gift.baseTxHash}
        Paymaster TX Hash: ${result.gift.paymasterTxHash}
        Sponsored: ${result.transactions[1].sponsored}`);
        });
    });
});
//# sourceMappingURL=performance.test.js.map