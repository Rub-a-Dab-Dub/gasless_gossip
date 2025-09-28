import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { IntentGossipModule } from '../src/intent-gossip/intent-gossip.module';

describe('IntentGossipController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [IntentGossipModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/gossip/intents (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/gossip/intents')
      .send({
        type: 'chat_message',
        payload: { message: 'Hello World' },
        chains: ['base', 'stellar'],
      })
      .expect(401); // Unauthorized without auth token
  });

  afterEach(async () => {
    await app.close();
  });
});