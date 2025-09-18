
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Reactions (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/reactions (POST) should add a reaction', async () => {
    const res = await request(app.getHttpServer())
      .post('/reactions')
      .send({
        messageId: 'msg1',
        type: '👍',
        userId: 'user1',
      })
      .expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.type).toBe('👍');
  });

  it('/reactions/:messageId (GET) should aggregate reactions', async () => {
    await request(app.getHttpServer())
      .post('/reactions')
      .send({ messageId: 'msg2', type: '😂', userId: 'user2' });
    await request(app.getHttpServer())
      .post('/reactions')
      .send({ messageId: 'msg2', type: '😂', userId: 'user3' });
    await request(app.getHttpServer())
      .post('/reactions')
      .send({ messageId: 'msg2', type: '❤️', userId: 'user4' });
    const res = await request(app.getHttpServer())
      .get('/reactions/msg2')
      .expect(200);
    expect(res.body).toEqual({ '😂': 2, '❤️': 1 });
  });
});
