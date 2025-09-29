import { Test, TestingModule } from '@nestjs/testing';
import { GossipGateway } from '../gossip.gateway';
import { GossipService } from '../services/gossip.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GossipIntent } from '../entities/gossip-intent.entity';
import { GossipUpdate } from '../entities/gossip-update.entity';
import { Server } from 'socket.io';
import { createServer } from 'http';

describe('GossipGateway Performance Tests', () => {
  let gateway: GossipGateway;
  let mockGossipService: any;
  let httpServer: any;
  let io: Server;

  beforeEach(async () => {
    mockGossipService = {
      createIntent: jest.fn(),
      updateIntentStatus: jest.fn(),
      voteIntent: jest.fn(),
      commentIntent: jest.fn(),
      getIntentById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GossipGateway,
        {
          provide: GossipService,
          useValue: mockGossipService,
        },
        {
          provide: getRepositoryToken(GossipIntent),
          useValue: {},
        },
        {
          provide: getRepositoryToken(GossipUpdate),
          useValue: {},
        },
      ],
    }).compile();

    gateway = module.get<GossipGateway>(GossipGateway);
    
    // Create test server
    httpServer = createServer();
    io = new Server(httpServer, {
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
      const connections: any[] = [];
      const connectionPromises: Promise<any>[] = [];

      // Simulate 100 concurrent connections
      for (let i = 0; i < 100; i++) {
        const connectionPromise = new Promise((resolve) => {
          const mockClient = {
            id: `socket-${i}`,
            join: jest.fn(),
            emit: jest.fn(),
            leave: jest.fn(),
          };
          
          connections.push(mockClient);
          
          // Simulate connection
          gateway.handleConnection(mockClient);
          
          // Simulate authentication
          gateway.handleAuthenticate(
            { token: `token-${i}`, userId: `user-${i}` },
            mockClient,
          ).then(() => {
            resolve(mockClient);
          });
        });
        
        connectionPromises.push(connectionPromise);
      }

      // Wait for all connections
      await Promise.all(connectionPromises);

      // Verify all connections are tracked
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
      } as any;

      // Authenticate client
      await gateway.handleAuthenticate(
        { token: 'jwt-token', userId: 'user-123' },
        mockClient,
      );

      // Join room
      await gateway.handleJoinRoom(
        { roomId: 'room-456' },
        mockClient,
      );

      // Measure message processing time
      const startTime = Date.now();
      
      const result = await gateway.handleNewGossip(
        {
          roomId: 'room-456',
          content: 'Test gossip',
        },
        mockClient,
      );
      
      const endTime = Date.now();
      const latency = endTime - startTime;

      expect(result.status).toBe('success');
      expect(latency).toBeLessThan(500); // Should be under 500ms
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

      const clients: any[] = [];
      const gossipPromises: Promise<any>[] = [];

      // Create 50 concurrent clients
      for (let i = 0; i < 50; i++) {
        const mockClient = {
          id: `socket-${i}`,
          join: jest.fn(),
          emit: jest.fn(),
        } as any;

        clients.push(mockClient);

        // Authenticate and join room
        await gateway.handleAuthenticate(
          { token: `token-${i}`, userId: `user-${i}` },
          mockClient,
        );
        
        await gateway.handleJoinRoom(
          { roomId: 'room-456' },
          mockClient,
        );

        // Create gossip promise
        const gossipPromise = gateway.handleNewGossip(
          {
            roomId: 'room-456',
            content: `Test gossip ${i}`,
          },
          mockClient,
        );
        
        gossipPromises.push(gossipPromise);
      }

      // Measure concurrent processing
      const startTime = Date.now();
      const results = await Promise.all(gossipPromises);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // All should succeed
      results.forEach(result => {
        expect(result.status).toBe('success');
      });

      // Should handle 50 concurrent operations efficiently
      expect(totalTime).toBeLessThan(2000); // 2 seconds for 50 concurrent operations
      expect(totalTime / 50).toBeLessThan(100); // Average < 100ms per operation
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
      } as any;

      // Authenticate and join room
      await gateway.handleAuthenticate(
        { token: 'jwt-token', userId: 'user-123' },
        mockClient,
      );
      
      await gateway.handleJoinRoom(
        { roomId: 'room-456' },
        mockClient,
      );

      const latencies: number[] = [];
      const iterations = 100;

      // Process 100 messages and measure latency
      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();
        
        await gateway.handleNewGossip(
          {
            roomId: 'room-456',
            content: `Test gossip ${i}`,
          },
          mockClient,
        );
        
        const endTime = Date.now();
        latencies.push(endTime - startTime);
      }

      // Calculate statistics
      const averageLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      const maxLatency = Math.max(...latencies);
      const minLatency = Math.min(...latencies);

      // Performance assertions
      expect(averageLatency).toBeLessThan(100); // Average < 100ms
      expect(maxLatency).toBeLessThan(500); // Max < 500ms
      expect(minLatency).toBeLessThan(50); // Min < 50ms

      console.log(`Performance Stats:
        Average Latency: ${averageLatency.toFixed(2)}ms
        Max Latency: ${maxLatency}ms
        Min Latency: ${minLatency}ms
        Total Operations: ${iterations}`);
    });

    it('should handle room subscriptions efficiently', async () => {
      const clients: any[] = [];
      const roomIds = ['room-1', 'room-2', 'room-3', 'room-4', 'room-5'];

      // Create 100 clients and distribute them across 5 rooms
      for (let i = 0; i < 100; i++) {
        const mockClient = {
          id: `socket-${i}`,
          join: jest.fn(),
          emit: jest.fn(),
        } as any;

        clients.push(mockClient);

        // Authenticate
        await gateway.handleAuthenticate(
          { token: `token-${i}`, userId: `user-${i}` },
          mockClient,
        );

        // Join random room
        const roomId = roomIds[i % roomIds.length];
        await gateway.handleJoinRoom(
          { roomId },
          mockClient,
        );
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
      } as any;

      // Connect and authenticate
      gateway.handleConnection(mockClient);
      await gateway.handleAuthenticate(
        { token: 'jwt-token', userId: 'user-123' },
        mockClient,
      );

      let stats = gateway.getConnectionStats();
      expect(stats.activeConnections).toBe(1);
      expect(stats.usersConnected).toBe(1);

      // Disconnect
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
        } as any;

        // Connect
        gateway.handleConnection(mockClient);
        await gateway.handleAuthenticate(
          { token: `token-${i}`, userId: `user-${i}` },
          mockClient,
        );

        // Disconnect immediately
        gateway.handleDisconnect(mockClient);
      }

      const stats = gateway.getConnectionStats();
      expect(stats.activeConnections).toBe(0);
      expect(stats.usersConnected).toBe(0);
    });
  });
});
