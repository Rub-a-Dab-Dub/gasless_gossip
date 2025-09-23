import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { HooksModule } from '../hooks.module';
import { Hook } from '../entities/hook.entity';
import { MockEventGenerator } from './mock-events';

describe('Hooks Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT, 10) || 5432,
          username: process.env.DB_USER || 'test_user',
          password: process.env.DB_PASSWORD || 'test_password',
          database: process.env.DB_NAME || 'whspr_test',
          entities: [Hook],
          synchronize: true,
          dropSchema: true,
        }),
        HooksModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/hooks/stellar (POST)', () => {
    it('should process a stellar XP update event', async () => {
      const stellarEvent = MockEventGenerator.generateXpUpdateEvent();

      const response = await request(app.getHttpServer())
        .post('/hooks/stellar')
        .send(stellarEvent)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.eventType).toBe(stellarEvent.eventType);
      expect(response.body.stellarTransactionId).toBe(stellarEvent.transactionId);
      expect(response.body.processed).toBe(false);
    });

    it('should process a stellar token send event', async () => {
      const stellarEvent = MockEventGenerator.generateTokenSendEvent();

      const response = await request(app.getHttpServer())
        .post('/hooks/stellar')
        .send(stellarEvent)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.eventType).toBe(stellarEvent.eventType);
      expect(response.body.data.amount).toBe(stellarEvent.eventData.amount);
    });

    it('should reject invalid event data', async () => {
      const invalidEvent = {
        transactionId: 'invalid-tx',
        // Missing required fields
      };

      await request(app.getHttpServer())
        .post('/hooks/stellar')
        .send(invalidEvent)
        .expect(400);
    });
  });

  describe('/hooks (GET)', () => {
    beforeEach(async () => {
      // Create some test hooks
      const events = MockEventGenerator.generateBatchEvents(5);
      for (const event of events) {
        await request(app.getHttpServer())
          .post('/hooks/stellar')
          .send(event);
      }
    });

    it('should return recent hooks', async () => {
      const response = await request(app.getHttpServer())
        .get('/hooks')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('eventType');
    });

    it('should filter hooks by event type', async () => {
      const response = await request(app.getHttpServer())
        .get('/hooks?eventType=xp_update')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(hook => {
        expect(hook.eventType).toBe('xp_update');
      });
    });

    it('should limit the number of hooks returned', async () => {
      const response = await request(app.getHttpServer())
        .get('/hooks?limit=2')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(2);
    });
  });

  describe('/hooks/stats/overview (GET)', () => {
    it('should return hook statistics', async () => {
      const response = await request(app.getHttpServer())
        .get('/hooks/stats/overview')
        .expect(200);

      expect(response.body).toHaveProperty('totalHooks');
      expect(response.body).toHaveProperty('processedHooks');
      expect(response.body).toHaveProperty('connectedClients');
      expect(response.body).toHaveProperty('eventTypeDistribution');
    });
  });
});