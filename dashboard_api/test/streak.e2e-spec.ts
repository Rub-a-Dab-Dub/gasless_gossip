import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreakEntity } from '../src/entities/streak.entity';

describe('StreakController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [StreakEntity],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/streaks (POST)', () => {
    return request(app.getHttpServer())
      .post('/streaks')
      .send({ userId: 'test-user' })
      .expect(201)
      .expect(res => {
        expect(res.body.userId).toBe('test-user');
        expect(res.body.currentStreak).toBe(1);
        expect(res.body.longestStreak).toBe(1);
      });
  });

  it('/streaks/top (GET)', async () => {
    // Create some test streaks first
    await request(app.getHttpServer())
      .post('/streaks')
      .send({ userId: 'user1' });

    await request(app.getHttpServer())
      .post('/streaks')
      .send({ userId: 'user2' });

    return request(app.getHttpServer())
      .get('/streaks/top?limit=2')
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeLessThanOrEqual(2);
      });
  });

  it('/streaks/:userId/update (PUT)', async () => {
    // Create a streak first
    await request(app.getHttpServer())
      .post('/streaks')
      .send({ userId: 'test-user' });

    return request(app.getHttpServer())
      .put('/streaks/test-user/update')
      .expect(200)
      .expect(res => {
        expect(res.body.userId).toBe('test-user');
        expect(res.body.currentStreak).toBe(1); // Same day, no increment
      });
  });

  it('/streaks/:userId/boost (PUT)', async () => {
    // Create a streak first
    await request(app.getHttpServer())
      .post('/streaks')
      .send({ userId: 'test-user' });

    return request(app.getHttpServer())
      .put('/streaks/test-user/boost?multiplier=2.0')
      .expect(200)
      .expect(res => {
        expect(res.body.userId).toBe('test-user');
        expect(res.body.multiplier).toBe(2.0);
      });
  });
});