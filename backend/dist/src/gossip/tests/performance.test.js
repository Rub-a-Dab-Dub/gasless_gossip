"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const gossip_gateway_1 = require("../gossip.gateway");
const gossip_service_1 = require("../services/gossip.service");
const typeorm_1 = require("@nestjs/typeorm");
const gossip_intent_entity_1 = require("../entities/gossip-intent.entity");
const gossip_update_entity_1 = require("../entities/gossip-update.entity");
const socket_io_1 = require("socket.io");
const http_1 = require("http");
describe('GossipGateway Performance Tests', () => {
    let gateway;
    let mockGossipService;
    let httpServer;
    let io;
    beforeEach(async () => {
        mockGossipService = {
            createIntent: jest.fn(),
            updateIntentStatus: jest.fn(),
            voteIntent: jest.fn(),
            commentIntent: jest.fn(),
            getIntentById: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                gossip_gateway_1.GossipGateway,
                {
                    provide: gossip_service_1.GossipService,
                    useValue: mockGossipService,
                },
                {
                    provide: (0, typeorm_1.getRepositoryToken)(gossip_intent_entity_1.GossipIntent),
                    useValue: {},
                },
                {
                    provide: (0, typeorm_1.getRepositoryToken)(gossip_update_entity_1.GossipUpdate),
                    useValue: {},
                },
            ],
        }).compile();
        gateway = module.get(gossip_gateway_1.GossipGateway);
        httpServer = (0, http_1.createServer)();
        io = new socket_io_1.Server(httpServer, {
            cors: { origin: '*' },
        });
    });
    afterEach(() => {
        if (httpServer) {
            httpServer.close();
        }
    });
    describe('Performance with 100 concurrent clients', () => {
        it('should handle 100 concurrent connections without crashing', async () => {
            const connections = [];
            const connectionPromises = [];
            for (let i = 0; i < 100; i++) {
                const connectionPromise = new Promise((resolve) => {
                    const mockClient = {
                        id: `socket-${i}`,
                        join: jest.fn(),
                        emit: jest.fn(),
                        leave: jest.fn(),
                    };
                    connections.push(mockClient);
                    gateway.handleConnection(mockClient);
                    gateway.handleAuthenticate({ token: `token-${i}`, userId: `user-${i}` }, mockClient).then(() => {
                        resolve(mockClient);
                    });
                });
                connectionPromises.push(connectionPromise);
            }
            await Promise.all(connectionPromises);
            const stats = gateway.getConnectionStats();
            expect(stats.activeConnections).toBe(100);
            expect(stats.usersConnected).toBe(100);
        });
        it('should process messages with <500ms latency under load', async () => {
            const mockIntent = {
                id: 'intent-123',
                roomId: 'room-456',
                userId: 'user-123',
                content: 'Test gossip',
                status: 'pending',
                upvotes: 0,
                downvotes: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockGossipService.createIntent.mockResolvedValue(mockIntent);
            const mockClient = {
                id: 'socket-123',
                join: jest.fn(),
                emit: jest.fn(),
            };
            await gateway.handleAuthenticate({ token: 'jwt-token', userId: 'user-123' }, mockClient);
            await gateway.handleJoinRoom({ roomId: 'room-456' }, mockClient);
            const startTime = Date.now();
            const result = await gateway.handleNewGossip({
                roomId: 'room-456',
                content: 'Test gossip',
            }, mockClient);
            const endTime = Date.now();
            const latency = endTime - startTime;
            expect(result.status).toBe('success');
            expect(latency).toBeLessThan(500);
        });
        it('should handle concurrent gossip creation efficiently', async () => {
            const mockIntent = {
                id: 'intent-123',
                roomId: 'room-456',
                userId: 'user-123',
                content: 'Test gossip',
                status: 'pending',
                upvotes: 0,
                downvotes: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockGossipService.createIntent.mockResolvedValue(mockIntent);
            const clients = [];
            const gossipPromises = [];
            for (let i = 0; i < 50; i++) {
                const mockClient = {
                    id: `socket-${i}`,
                    join: jest.fn(),
                    emit: jest.fn(),
                };
                clients.push(mockClient);
                await gateway.handleAuthenticate({ token: `token-${i}`, userId: `user-${i}` }, mockClient);
                await gateway.handleJoinRoom({ roomId: 'room-456' }, mockClient);
                const gossipPromise = gateway.handleNewGossip({
                    roomId: 'room-456',
                    content: `Test gossip ${i}`,
                }, mockClient);
                gossipPromises.push(gossipPromise);
            }
            const startTime = Date.now();
            const results = await Promise.all(gossipPromises);
            const endTime = Date.now();
            const totalTime = endTime - startTime;
            results.forEach(result => {
                expect(result.status).toBe('success');
            });
            expect(totalTime).toBeLessThan(2000);
            expect(totalTime / 50).toBeLessThan(100);
        });
        it('should maintain performance under sustained load', async () => {
            const mockIntent = {
                id: 'intent-123',
                roomId: 'room-456',
                userId: 'user-123',
                content: 'Test gossip',
                status: 'pending',
                upvotes: 0,
                downvotes: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockGossipService.createIntent.mockResolvedValue(mockIntent);
            const mockClient = {
                id: 'socket-123',
                join: jest.fn(),
                emit: jest.fn(),
            };
            await gateway.handleAuthenticate({ token: 'jwt-token', userId: 'user-123' }, mockClient);
            await gateway.handleJoinRoom({ roomId: 'room-456' }, mockClient);
            const latencies = [];
            const iterations = 100;
            for (let i = 0; i < iterations; i++) {
                const startTime = Date.now();
                await gateway.handleNewGossip({
                    roomId: 'room-456',
                    content: `Test gossip ${i}`,
                }, mockClient);
                const endTime = Date.now();
                latencies.push(endTime - startTime);
            }
            const averageLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
            const maxLatency = Math.max(...latencies);
            const minLatency = Math.min(...latencies);
            expect(averageLatency).toBeLessThan(100);
            expect(maxLatency).toBeLessThan(500);
            expect(minLatency).toBeLessThan(50);
            console.log(`Performance Stats:
        Average Latency: ${averageLatency.toFixed(2)}ms
        Max Latency: ${maxLatency}ms
        Min Latency: ${minLatency}ms
        Total Operations: ${iterations}`);
        });
        it('should handle room subscriptions efficiently', async () => {
            const clients = [];
            const roomIds = ['room-1', 'room-2', 'room-3', 'room-4', 'room-5'];
            for (let i = 0; i < 100; i++) {
                const mockClient = {
                    id: `socket-${i}`,
                    join: jest.fn(),
                    emit: jest.fn(),
                };
                clients.push(mockClient);
                await gateway.handleAuthenticate({ token: `token-${i}`, userId: `user-${i}` }, mockClient);
                const roomId = roomIds[i % roomIds.length];
                await gateway.handleJoinRoom({ roomId }, mockClient);
            }
            const stats = gateway.getConnectionStats();
            expect(stats.activeConnections).toBe(100);
            expect(stats.roomsSubscribed).toBe(5);
            expect(stats.usersConnected).toBe(100);
        });
    });
    describe('Memory and resource management', () => {
        it('should clean up disconnected clients properly', async () => {
            const mockClient = {
                id: 'socket-123',
                join: jest.fn(),
                emit: jest.fn(),
            };
            gateway.handleConnection(mockClient);
            await gateway.handleAuthenticate({ token: 'jwt-token', userId: 'user-123' }, mockClient);
            let stats = gateway.getConnectionStats();
            expect(stats.activeConnections).toBe(1);
            expect(stats.usersConnected).toBe(1);
            gateway.handleDisconnect(mockClient);
            stats = gateway.getConnectionStats();
            expect(stats.activeConnections).toBe(0);
            expect(stats.usersConnected).toBe(0);
        });
        it('should handle rapid connect/disconnect cycles', async () => {
            const iterations = 50;
            for (let i = 0; i < iterations; i++) {
                const mockClient = {
                    id: `socket-${i}`,
                    join: jest.fn(),
                    emit: jest.fn(),
                };
                gateway.handleConnection(mockClient);
                await gateway.handleAuthenticate({ token: `token-${i}`, userId: `user-${i}` }, mockClient);
                gateway.handleDisconnect(mockClient);
            }
            const stats = gateway.getConnectionStats();
            expect(stats.activeConnections).toBe(0);
            expect(stats.usersConnected).toBe(0);
        });
    });
});
//# sourceMappingURL=performance.test.js.map