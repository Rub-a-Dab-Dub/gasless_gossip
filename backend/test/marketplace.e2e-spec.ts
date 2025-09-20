import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('MarketplaceController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/marketplace (GET)', () => {
    return request(app.getHttpServer())
      .get('/marketplace')
      .expect(401); // Should require auth
  });

  it('/marketplace/list (POST)', () => {
    return request(app.getHttpServer())
      .post('/marketplace/list')
      .send({ giftId: 'gift1', price: 10 })
      .expect(401); // Should require auth
  });

  afterAll(async () => {
    await app.close();
  });
});