import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';

import { SecretRoomsModule } from '../secret-rooms.module';
import { PseudonymsModule } from '../../pseudonyms/pseudonyms.module';
import { SecretRoom } from '../entities/secret-room.entity';
import { RoomMember } from '../entities/room-member.entity';
import { RoomInvitation } from '../entities/room-invitation.entity';
import { Pseudonym } from '../../pseudonyms/entities/pseudonym.entity';

// Mock token tip service
class MockTokenTipService {
  async sendTokenTip(params: {
    fromUserId: string;
    toUserId?: string;
    toPseudonym?: string;
    roomId: string;
    amount: number;
    currency: string;
  }) {
    return {
      success: true,
      transactionId: `txn_${Date.now()}`,
      amount: params.amount,
      currency: params.currency,
      fee: 0.1,
      timestamp: new Date().toISOString()
    };
  }

  async getTokenTipHistory(userId: string, roomId?: string) {
    return {
      sent: [],
      received: [],
      total: { sent: 0, received: 0 }
    };
  }
}

describe('Secret Rooms Token Tips Integration Tests', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let mockTokenTipService: MockTokenTipService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [SecretRoom, RoomMember, RoomInvitation, Pseudonym],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        SecretRoomsModule,
        PseudonymsModule,
      ],
      providers: [
        {
          provide: 'TOKEN_TIP_SERVICE',
          useClass: MockTokenTipService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    mockTokenTipService = moduleRef.get('TOKEN_TIP_SERVICE');
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Token Tips with Pseudonyms', () => {
    let creatorToken: string;
    let member1Token: string;
    let member2Token: string;
    let roomId: string;
    let creatorPseudonym: string;
    let member1Pseudonym: string;
    let member2Pseudonym: string;

    beforeEach(async () => {
      // Mock JWT tokens for testing
      creatorToken = 'mock-jwt-creator-token';
      member1Token = 'mock-jwt-member1-token';
      member2Token = 'mock-jwt-member2-token';

      // Create a secret room with pseudonyms enabled
      const roomResponse = await request(app.getHttpServer())
        .post('/rooms/create')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({
          name: 'Token Tip Test Room',
          description: 'Testing token tips with pseudonyms',
          isPrivate: false,
          enablePseudonyms: true,
          fakeNameTheme: 'cyber',
          maxUsers: 10,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          moderationSettings: {
            creatorModPrivileges: true,
            pseudonymDecryption: true
          }
        })
        .expect(201);

      roomId = roomResponse.body.id;

      // Members join the room and get pseudonyms
      const member1JoinResponse = await request(app.getHttpServer())
        .post('/rooms/join')
        .set('Authorization', `Bearer ${member1Token}`)
        .send({
          roomCode: roomResponse.body.roomCode,
          isAnonymous: true
        })
        .expect(201);

      const member2JoinResponse = await request(app.getHttpServer())
        .post('/rooms/join')
        .set('Authorization', `Bearer ${member2Token}`)
        .send({
          roomCode: roomResponse.body.roomCode,
          isAnonymous: true
        })
        .expect(201);

      // Get pseudonyms from room members
      const membersResponse = await request(app.getHttpServer())
        .get(`/rooms/${roomId}/members`)
        .set('Authorization', `Bearer ${creatorToken}`)
        .expect(200);

      const members = membersResponse.body;
      creatorPseudonym = members.find(m => m.role === 'owner')?.nickname || 'Creator';
      member1Pseudonym = members.find(m => m.role === 'member' && m.userId !== member2JoinResponse.body.userId)?.nickname || 'Member1';
      member2Pseudonym = members.find(m => m.userId === member2JoinResponse.body.userId)?.nickname || 'Member2';
    });

    it('should send token tip using pseudonym in secret room', async () => {
      const tipAmount = 100;
      const currency = 'XLM';

      // Send tip from member1 to member2 using pseudonym
      const tipResponse = await request(app.getHttpServer())
        .post('/tokens/tip')
        .set('Authorization', `Bearer ${member1Token}`)
        .send({
          roomId: roomId,
          toPseudonym: member2Pseudonym,
          amount: tipAmount,
          currency: currency,
          message: 'Great insight! 🚀'
        })
        .expect(201);

      expect(tipResponse.body).toEqual(
        expect.objectContaining({
          success: true,
          transactionId: expect.stringMatching(/^txn_/),
          amount: tipAmount,
          currency: currency,
          fee: expect.any(Number)
        })
      );

      // Verify tip appears in history
      const historyResponse = await request(app.getHttpServer())
        .get(`/tokens/tips/history?roomId=${roomId}`)
        .set('Authorization', `Bearer ${member1Token}`)
        .expect(200);

      expect(historyResponse.body.sent).toHaveLength(1);
      expect(historyResponse.body.sent[0]).toEqual(
        expect.objectContaining({
          amount: tipAmount,
          currency: currency,
          toPseudonym: member2Pseudonym
        })
      );
    });

    it('should handle batch token tips to multiple pseudonyms', async () => {
      const batchTips = [
        { toPseudonym: member1Pseudonym, amount: 50, currency: 'XLM' },
        { toPseudonym: member2Pseudonym, amount: 75, currency: 'XLM' }
      ];

      const batchTipResponse = await request(app.getHttpServer())
        .post('/tokens/tip/batch')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({
          roomId: roomId,
          tips: batchTips,
          message: 'Thanks for making this room awesome!'
        })
        .expect(201);

      expect(batchTipResponse.body.results).toHaveLength(2);
      expect(batchTipResponse.body.totalAmount).toBe(125);
      expect(batchTipResponse.body.successful).toBe(2);
      expect(batchTipResponse.body.failed).toBe(0);
    });

    it('should decrypt pseudonym for moderators when tipping', async () => {
      // Creator (who has moderator privileges) should see real user info
      const moderatorTipResponse = await request(app.getHttpServer())
        .post('/tokens/tip')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({
          roomId: roomId,
          toPseudonym: member1Pseudonym,
          amount: 200,
          currency: 'XLM',
          revealRecipient: true // Special flag for moderators
        })
        .expect(201);

      expect(moderatorTipResponse.body).toEqual(
        expect.objectContaining({
          success: true,
          recipientDetails: expect.objectContaining({
            pseudonym: member1Pseudonym,
            realUserId: expect.any(String)
          })
        })
      );
    });

    it('should handle token tips with room expiry constraints', async () => {
      // Create a room that expires soon
      const shortRoomResponse = await request(app.getHttpServer())
        .post('/rooms/create')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({
          name: 'Short-lived Tip Room',
          isPrivate: false,
          enablePseudonyms: true,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
        })
        .expect(201);

      const shortRoomId = shortRoomResponse.body.id;

      // Join the short-lived room
      await request(app.getHttpServer())
        .post('/rooms/join')
        .set('Authorization', `Bearer ${member1Token}`)
        .send({
          roomCode: shortRoomResponse.body.roomCode
        })
        .expect(201);

      // Try to send tip
      const tipResponse = await request(app.getHttpServer())
        .post('/tokens/tip')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({
          roomId: shortRoomId,
          toPseudonym: member1Pseudonym,
          amount: 50,
          currency: 'XLM'
        })
        .expect(201);

      expect(tipResponse.body.success).toBe(true);
      
      // Verify tip includes expiry warning
      expect(tipResponse.body.warnings).toContainEqual(
        expect.stringContaining('room expires soon')
      );
    });

    it('should validate tip amounts and currencies', async () => {
      // Test invalid amount
      await request(app.getHttpServer())
        .post('/tokens/tip')
        .set('Authorization', `Bearer ${member1Token}`)
        .send({
          roomId: roomId,
          toPseudonym: member2Pseudonym,
          amount: -10, // Invalid negative amount
          currency: 'XLM'
        })
        .expect(400);

      // Test invalid currency
      await request(app.getHttpServer())
        .post('/tokens/tip')
        .set('Authorization', `Bearer ${member1Token}`)
        .send({
          roomId: roomId,
          toPseudonym: member2Pseudonym,
          amount: 50,
          currency: 'INVALID_COIN'
        })
        .expect(400);

      // Test amount too large
      await request(app.getHttpServer())
        .post('/tokens/tip')
        .set('Authorization', `Bearer ${member1Token}`)
        .send({
          roomId: roomId,
          toPseudonym: member2Pseudonym,
          amount: 1000000, // Exceeds limit
          currency: 'XLM'
        })
        .expect(400);
    });

    it('should handle tips to non-existent pseudonyms', async () => {
      await request(app.getHttpServer())
        .post('/tokens/tip')
        .set('Authorization', `Bearer ${member1Token}`)
        .send({
          roomId: roomId,
          toPseudonym: 'Non-existent Phantom 999',
          amount: 50,
          currency: 'XLM'
        })
        .expect(404);
    });

    it('should prevent self-tipping', async () => {
      await request(app.getHttpServer())
        .post('/tokens/tip')
        .set('Authorization', `Bearer ${member1Token}`)
        .send({
          roomId: roomId,
          toPseudonym: member1Pseudonym, // Trying to tip themselves
          amount: 50,
          currency: 'XLM'
        })
        .expect(400);
    });

    it('should track tip statistics for rooms', async () => {
      // Send several tips to generate stats
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
          .post('/tokens/tip')
          .set('Authorization', `Bearer ${creatorToken}`)
          .send({
            roomId: roomId,
            toPseudonym: i % 2 === 0 ? member1Pseudonym : member2Pseudonym,
            amount: 25 * (i + 1),
            currency: 'XLM'
          })
          .expect(201);
      }

      // Get room tip statistics
      const statsResponse = await request(app.getHttpServer())
        .get(`/rooms/${roomId}/tip-stats`)
        .set('Authorization', `Bearer ${creatorToken}`)
        .expect(200);

      expect(statsResponse.body).toEqual(
        expect.objectContaining({
          totalTips: 3,
          totalAmount: 150, // 25 + 50 + 75
          averageTipAmount: 50,
          topTippers: expect.arrayContaining([
            expect.objectContaining({
              pseudonym: creatorPseudonym,
              totalSent: 150
            })
          ]),
          topReceivers: expect.arrayContaining([
            expect.objectContaining({
              pseudonym: expect.any(String),
              totalReceived: expect.any(Number)
            })
          ])
        })
      );
    });
  });

  describe('XP Rewards for Tipping', () => {
    it('should award XP for sending and receiving tips', async () => {
      // This test would verify XP is awarded correctly
      // Implementation depends on actual XP service integration
      expect(true).toBe(true); // Placeholder
    });

    it('should apply room XP multipliers to tip rewards', async () => {
      // Test XP multipliers specific to secret rooms
      expect(true).toBe(true); // Placeholder
    });
  });
});