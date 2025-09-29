import { Test, TestingModule } from '@nestjs/testing';
import { GossipGateway } from '../gossip.gateway';
import { GossipService } from '../services/gossip.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GossipIntent } from '../entities/gossip-intent.entity';
import { GossipUpdate } from '../entities/gossip-update.entity';

describe('GossipGateway', () => {
  let gateway: GossipGateway;
  let mockGossipService: any;

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
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleAuthenticate', () => {
    it('should authenticate user and track connection', async () => {
      const mockClient = {
        id: 'socket-123',
        join: jest.fn(),
      } as any;

      const result = await gateway.handleAuthenticate(
        { token: 'jwt-token', userId: 'user-123' },
        mockClient,
      );

      expect(result.status).toBe('authenticated');
      expect(result.userId).toBe('user-123');
      expect(mockClient.join).toHaveBeenCalledWith('user:user-123');
    });
  });

  describe('handleJoinRoom', () => {
    it('should join user to room', async () => {
      const mockClient = {
        id: 'socket-123',
        join: jest.fn(),
      } as any;

      // First authenticate
      await gateway.handleAuthenticate(
        { token: 'jwt-token', userId: 'user-123' },
        mockClient,
      );

      const result = await gateway.handleJoinRoom(
        { roomId: 'room-456' },
        mockClient,
      );

      expect(result.status).toBe('joined');
      expect(result.roomId).toBe('room-456');
      expect(mockClient.join).toHaveBeenCalledWith('room:room-456');
    });
  });

  describe('handleNewGossip', () => {
    it('should create gossip and broadcast to room', async () => {
      const mockClient = {
        id: 'socket-123',
        join: jest.fn(),
      } as any;

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

      // First authenticate
      await gateway.handleAuthenticate(
        { token: 'jwt-token', userId: 'user-123' },
        mockClient,
      );

      const result = await gateway.handleNewGossip(
        {
          roomId: 'room-456',
          content: 'Test gossip',
        },
        mockClient,
      );

      expect(result.status).toBe('success');
      expect(mockGossipService.createIntent).toHaveBeenCalled();
    });
  });
});
