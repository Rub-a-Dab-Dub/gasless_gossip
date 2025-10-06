import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import * as request from 'supertest';
import { Room } from '../entities/room.entity';
import { RoomsService } from '../services/rooms.service';
import { FakeNameGeneratorService } from '../services/fake-name-generator.service';
import { VoiceModerationQueueService } from '../services/voice-moderation-queue.service';
import { RoomSchedulerService } from '../services/room-scheduler.service';
import { SecretRoomsGateway } from '../gateways/secret-rooms.gateway';
import { SecretRoomsController } from '../controllers/secret-rooms.controller';

describe('Enhanced Secret Rooms Integration', () => {
  let app: INestApplication;
  let roomsService: RoomsService;
  let fakeNameGenerator: FakeNameGeneratorService;
  let voiceModerationQueue: VoiceModerationQueueService;
  let roomScheduler: RoomSchedulerService;
  let secretRoomsGateway: SecretRoomsGateway;
  
  // Test data
  const mockUser = { id: 'user-123', role: 'member' };
  const mockModerator = { id: 'mod-456', role: 'moderator' };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Room],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Room]),
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot([{
          ttl: 60000,
          limit: 10,
        }]),
      ],
      controllers: [SecretRoomsController],
      providers: [
        RoomsService,
        FakeNameGeneratorService,
        VoiceModerationQueueService,
        RoomSchedulerService,
        SecretRoomsGateway,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    roomsService = moduleFixture.get<RoomsService>(RoomsService);
    fakeNameGenerator = moduleFixture.get<FakeNameGeneratorService>(FakeNameGeneratorService);
    voiceModerationQueue = moduleFixture.get<VoiceModerationQueueService>(VoiceModerationQueueService);
    roomScheduler = moduleFixture.get<RoomSchedulerService>(RoomSchedulerService);
    secretRoomsGateway = moduleFixture.get<SecretRoomsGateway>(SecretRoomsGateway);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Enhanced Room Creation', () => {
    it('should create a secret room with enhanced features', async () => {
      const createRoomDto = {
        name: 'Test Secret Room',
        description: 'A test room with enhanced features',
        type: 'SECRET',
        isPrivate: true,
        enablePseudonyms: true,
        fakeNameTheme: 'space',
        xpMultiplier: 2,
        settings: {
          allowAnonymous: true,
          autoDelete: true,
          deleteAfterHours: 24,
          moderationLevel: 'medium'
        },
        moderationSettings: {
          creatorModPrivileges: true,
          autoModeration: true,
          voiceModerationQueue: true,
          pseudonymDecryption: true
        }
      };

      const response = await request(app.getHttpServer())
        .post('/secret-rooms/create')
        .send(createRoomDto)
        .set('Authorization', `Bearer mock-token-${mockUser.id}`)
        .expect(201);

      expect(response.body).toMatchObject({
        name: createRoomDto.name,
        type: 'SECRET',
        enablePseudonyms: true,
        fakeNameTheme: 'space',
        xpMultiplier: 2
      });
      expect(response.body.roomCode).toBeDefined();
      expect(response.body.id).toBeDefined();
    });

    it('should validate required fields', async () => {
      const invalidDto = {
        description: 'Missing required name field'
      };

      await request(app.getHttpServer())
        .post('/secret-rooms/create')
        .send(invalidDto)
        .set('Authorization', `Bearer mock-token-${mockUser.id}`)
        .expect(400);
    });
  });

  describe('Pseudonym System', () => {
    let testRoomId: string;

    beforeEach(async () => {
      const room = await roomsService.createEnhancedRoom({
        name: 'Pseudonym Test Room',
        type: 'SECRET',
        enablePseudonyms: true,
        fakeNameTheme: 'animals'
      }, mockUser.id);
      testRoomId = room.id;
    });

    it('should generate unique pseudonyms for different themes', async () => {
      const themes = ['space', 'animals', 'colors', 'cyber', 'mythical'];
      const generatedNames = new Set<string>();

      for (const theme of themes) {
        const name = fakeNameGenerator.generateFakeName(theme as any, testRoomId);
        expect(name).toBeDefined();
        expect(typeof name).toBe('string');
        expect(generatedNames.has(name)).toBe(false);
        generatedNames.add(name);
      }
    });

    it('should preview fake names for themes via API', async () => {
      const response = await request(app.getHttpServer())
        .get('/secret-rooms/fake-names/preview/space')
        .set('Authorization', `Bearer mock-token-${mockUser.id}`)
        .expect(200);

      expect(response.body.theme).toBe('space');
      expect(response.body.samples).toHaveLength(5);
      expect(response.body.samples.every((name: string) => typeof name === 'string')).toBe(true);
    });

    it('should release pseudonym when user leaves room', async () => {
      const pseudonym = fakeNameGenerator.generateFakeName('animals', testRoomId);
      expect(pseudonym).toBeDefined();

      fakeNameGenerator.releaseFakeName(pseudonym, testRoomId);
      
      // Should be able to generate the same name again
      const newPseudonym = fakeNameGenerator.generateFakeName('animals', testRoomId);
      // Note: Due to randomness, we can't guarantee the same name, but no error should occur
      expect(newPseudonym).toBeDefined();
    });
  });

  describe('Voice Moderation Queue', () => {
    let testRoomId: string;

    beforeEach(async () => {
      const room = await roomsService.createEnhancedRoom({
        name: 'Voice Moderation Test Room',
        type: 'SECRET',
        moderationSettings: {
          voiceModerationQueue: true,
          autoModeration: true
        }
      }, mockUser.id);
      testRoomId = room.id;
    });

    it('should add voice notes to moderation queue', async () => {
      const voiceNoteData = {
        voiceNoteUrl: 'https://example.com/voice-note.mp3',
        duration: 30,
        transcript: 'Hello everyone, this is a test voice note'
      };

      const response = await request(app.getHttpServer())
        .post(`/secret-rooms/${testRoomId}/voice-note`)
        .send(voiceNoteData)
        .set('Authorization', `Bearer mock-token-${mockUser.id}`)
        .expect(201);

      expect(response.body.queuePosition).toBeGreaterThan(0);
      expect(response.body.estimatedWaitTime).toBeGreaterThanOrEqual(0);

      // Check queue status
      const queueStatus = voiceModerationQueue.getQueueStatus();
      expect(queueStatus.totalItems).toBeGreaterThan(0);
    });

    it('should handle 100+ item capacity in moderation queue', async () => {
      // Add 105 items to test capacity handling
      const promises = [];
      
      for (let i = 0; i < 105; i++) {
        const voiceNoteData = {
          roomId: testRoomId,
          userId: `user-${i}`,
          voiceNoteUrl: `https://example.com/voice-${i}.mp3`,
          priority: i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low'
        };
        
        promises.push(
          voiceModerationQueue.addToQueue(voiceNoteData).catch(error => ({ error }))
        );
      }

      const results = await Promise.all(promises);
      const successful = results.filter(r => !('error' in r));
      const errors = results.filter(r => 'error' in r);

      // Should handle up to 100 items, reject excess
      expect(successful.length).toBe(100);
      expect(errors.length).toBe(5);
      
      const queueStatus = voiceModerationQueue.getQueueStatus();
      expect(queueStatus.totalItems).toBe(100);
      expect(queueStatus.queueCapacity).toBe(100);
    });

    it('should prioritize high-priority items in queue', async () => {
      // Add items with different priorities
      const lowPriorityPos = await voiceModerationQueue.addToQueue({
        roomId: testRoomId,
        userId: 'user-low',
        voiceNoteUrl: 'https://example.com/low.mp3',
        priority: 'low'
      });

      const highPriorityPos = await voiceModerationQueue.addToQueue({
        roomId: testRoomId,
        userId: 'user-high',
        voiceNoteUrl: 'https://example.com/high.mp3',
        priority: 'high'
      });

      // High priority should be processed before low priority
      expect(highPriorityPos).toBeLessThan(lowPriorityPos);
    });

    it('should auto-process items with extreme confidence scores', async () => {
      // Mock high-confidence item (should be auto-approved)
      const highConfidenceItem = {
        roomId: testRoomId,
        userId: mockUser.id,
        voiceNoteUrl: 'https://example.com/positive.mp3',
        content: 'Thank you, this is really helpful and great content',
        priority: 'medium' as const
      };

      await voiceModerationQueue.addToQueue(highConfidenceItem);

      // Wait a bit for auto-processing
      await new Promise(resolve => setTimeout(resolve, 100));

      const queueStatus = voiceModerationQueue.getQueueStatus();
      const roomQueue = voiceModerationQueue.getItemsByRoom(testRoomId);
      
      // Item should be auto-processed and moved out of pending
      const pendingItems = roomQueue.filter(item => item.status === 'pending');
      expect(pendingItems.length).toBe(0);
    });
  });

  describe('Token Tip Integration', () => {
    let testRoomId: string;
    let recipientUserId: string;

    beforeEach(async () => {
      recipientUserId = 'recipient-789';
      
      const room = await roomsService.createEnhancedRoom({
        name: 'Token Tip Test Room',
        type: 'SECRET',
        enablePseudonyms: true,
        xpMultiplier: 3
      }, mockUser.id);
      testRoomId = room.id;
    });

    it('should send token tips with pseudonym support', async () => {
      const tipData = {
        recipientUserId,
        amount: 10.5,
        token: 'XLM',
        message: 'Great contribution!',
        usePseudonym: true
      };

      const response = await request(app.getHttpServer())
        .post(`/secret-rooms/${testRoomId}/tip`)
        .send(tipData)
        .set('Authorization', `Bearer mock-token-${mockUser.id}`)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.transactionId).toBeDefined();
    });

    it('should validate tip amounts and tokens', async () => {
      const invalidTipData = {
        recipientUserId,
        amount: -5, // Invalid negative amount
        token: 'INVALID_TOKEN_THAT_IS_TOO_LONG',
        usePseudonym: true
      };

      await request(app.getHttpServer())
        .post(`/secret-rooms/${testRoomId}/tip`)
        .send(invalidTipData)
        .set('Authorization', `Bearer mock-token-${mockUser.id}`)
        .expect(400);
    });

    it('should track room reaction metrics', async () => {
      const reactionData = {
        messageId: 'msg-123',
        emoji: '👍'
      };

      const response = await request(app.getHttpServer())
        .post(`/secret-rooms/${testRoomId}/react`)
        .send(reactionData)
        .set('Authorization', `Bearer mock-token-${mockUser.id}`)
        .expect(201);

      expect(response.body.success).toBe(true);

      // Check reaction metrics
      const metrics = await request(app.getHttpServer())
        .get(`/secret-rooms/${testRoomId}/reactions`)
        .set('Authorization', `Bearer mock-token-${mockUser.id}`)
        .expect(200);

      expect(metrics.body.totalReactions).toBeGreaterThan(0);
    });
  });

  describe('Room Scheduler Service', () => {
    it('should track processing statistics with <1% error rate', async () => {
      const initialStats = roomScheduler.getProcessingStats();
      expect(initialStats).toMatchObject({
        totalProcessed: expect.any(Number),
        successfullyDeleted: expect.any(Number),
        errors: expect.any(Number),
        lastRun: expect.any(Date)
      });

      // Calculate error rate
      const errorRate = initialStats.totalProcessed > 0 
        ? (initialStats.errors / initialStats.totalProcessed) * 100 
        : 0;
      
      expect(errorRate).toBeLessThan(1); // <1% error rate requirement
    });

    it('should manually trigger room cleanup', async () => {
      const response = await request(app.getHttpServer())
        .post('/secret-rooms/scheduler/manual-cleanup')
        .set('Authorization', `Bearer mock-token-${mockModerator.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        processed: expect.any(Number),
        successful: expect.any(Number),
        errors: expect.any(Number),
        errorRate: expect.any(Number)
      });

      expect(response.body.errorRate).toBeLessThan(1); // <1% error rate
    });

    it('should provide scheduler statistics to admins', async () => {
      const response = await request(app.getHttpServer())
        .get('/secret-rooms/scheduler/stats')
        .set('Authorization', `Bearer mock-token-${mockModerator.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        totalProcessed: expect.any(Number),
        successfullyDeleted: expect.any(Number),
        errors: expect.any(Number),
        lastRun: expect.any(String)
      });
    });
  });

  describe('Real-time WebSocket Features', () => {
    let testRoomId: string;

    beforeEach(async () => {
      const room = await roomsService.createEnhancedRoom({
        name: 'WebSocket Test Room',
        type: 'SECRET',
        enablePseudonyms: true
      }, mockUser.id);
      testRoomId = room.id;
    });

    it('should track room participant count', () => {
      const initialCount = secretRoomsGateway.getRoomParticipantCount(testRoomId);
      expect(initialCount).toBe(0);

      // In a real test, you'd simulate WebSocket connections
      // For now, we're testing the basic functionality
    });

    it('should get room participants list', () => {
      const participants = secretRoomsGateway.getRoomParticipants(testRoomId);
      expect(Array.isArray(participants)).toBe(true);
    });

    it('should broadcast messages to room', () => {
      // Test the broadcast functionality
      expect(() => {
        secretRoomsGateway.broadcastToRoom(testRoomId, 'testEvent', { 
          message: 'test' 
        });
      }).not.toThrow();
    });
  });

  describe('Comprehensive Room Statistics', () => {
    let testRoomId: string;

    beforeEach(async () => {
      const room = await roomsService.createEnhancedRoom({
        name: 'Stats Test Room',
        type: 'SECRET',
        enablePseudonyms: true,
        xpMultiplier: 2
      }, mockUser.id);
      testRoomId = room.id;
    });

    it('should provide comprehensive room statistics', async () => {
      const response = await request(app.getHttpServer())
        .get(`/secret-rooms/${testRoomId}/stats`)
        .set('Authorization', `Bearer mock-token-${mockUser.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        totalParticipants: expect.any(Number),
        activeParticipants: expect.any(Number),
        totalMessages: expect.any(Number),
        totalReactions: expect.any(Number),
        totalTokenTips: expect.any(Number),
        averageSessionDuration: expect.any(Number),
        trendingScore: expect.any(Number),
        moderationQueueLength: expect.any(Number)
      });
    });

    it('should provide moderation queue status', async () => {
      const response = await request(app.getHttpServer())
        .get(`/secret-rooms/${testRoomId}/moderation-queue`)
        .set('Authorization', `Bearer mock-token-${mockUser.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        totalItems: expect.any(Number),
        pendingItems: expect.any(Number),
        processingItems: expect.any(Number),
        queueCapacity: expect.any(Number),
        averageProcessingTime: expect.any(Number)
      });
    });
  });
});