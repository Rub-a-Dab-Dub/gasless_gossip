import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { GiftsGivenModule } from '../src/gifts-given/gifts-given.module';
import { GiftLog } from '../src/gifts-given/entities/gift-log.entity';

describe('GiftsGivenController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [GiftLog],
          synchronize: true,
        }),
        GiftsGivenModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/gifts-given/log (POST)', async () => {
    const giftLogData = {
      giftId: '123e4567-e89b-12d3-a456-426614174000',
      userId: '123e4567-e89b-12d3-a456-426614174001',
      recipientId: '123e4567-e89b-12d3-a456-426614174002',
      giftType: 'flower',
      giftValue: 10.50,
    };

    return request(app.getHttpServer())
      .post('/gifts-given/log')
      .send(giftLogData)
      .expect(201)
      .expect((res) => {
        expect(res.body.giftId).toEqual(giftLogData.giftId);
        expect(res.body.userId).toEqual(giftLogData.userId);
        expect(res.body.id).toBeDefined();
        expect(res.body.createdAt).toBeDefined();
      });
  });

  it('/gifts-given/:userId (GET)', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174001';

    // First log a gift
    await request(app.getHttpServer())
      .post('/gifts-given/log')
      .send({
        giftId: '123e4567-e89b-12d3-a456-426614174000',
        userId,
        giftType: 'flower',
        giftValue: 10.50,
      });

    // Then retrieve the history
    return request(app.getHttpServer())
      .get(`/gifts-given/${userId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.gifts).toBeInstanceOf(Array);
        expect(res.body.total).toBeGreaterThan(0);
        expect(res.body.page).toEqual(1);
        expect(res.body.totalPages).toBeGreaterThan(0);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
