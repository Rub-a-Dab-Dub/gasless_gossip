import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { HooksModule } from '../src/hooks/hooks.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hook } from '../src/hooks/hook.entity';
import { Repository } from 'typeorm';
import { WebSocketsGateway } from '../src/websockets/websockets.gateway';
import { DatabaseModule } from '../src/database/database.module';

describe('HooksModule (e2e)', () => {
  let app: INestApplication;
  let hookRepository: Repository<Hook>;
  let webSocketsGateway: WebSocketsGateway;

  const mockWebSocketsGateway = {
    server: {
      emit: jest.fn(),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, HooksModule],
    })
      .overrideProvider(WebSocketsGateway)
      .useValue(mockWebSocketsGateway)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    hookRepository = moduleFixture.get<Repository<Hook>>(
      getRepositoryToken(Hook),
    );
    webSocketsGateway = moduleFixture.get<WebSocketsGateway>(WebSocketsGateway);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await hookRepository.query('DELETE FROM hook');
    jest.clearAllMocks();
  });

  it('should process a valid Stellar event and emit WebSocket event', async () => {
    const eventPayload = {
      eventType: 'XPUpdate',
      data: { userId: 'user1', xp: 100 },
    };

    const response = await request(app.getHttpServer())
      .post('/hooks/stellar')
      .send(eventPayload)
      .expect(HttpStatus.CREATED);

    expect(response.body.status).toBe('success');
    expect(response.body.hook).toHaveProperty('id');
    expect(response.body.hook.eventType).toBe(eventPayload.eventType);
    expect(response.body.hook.data).toEqual(eventPayload.data);

    // Check DB entry
    const hookInDb = await hookRepository.findOneBy({
      id: response.body.hook.id,
    });
    expect(hookInDb).not.toBeNull();
    expect(hookInDb!.eventType).toBe(eventPayload.eventType);

    // Check WebSocket emit called
    expect(webSocketsGateway.server.emit).toHaveBeenCalledWith('stellarEvent', {
      eventType: eventPayload.eventType,
      data: eventPayload.data,
    });
  });

  it('should return 400 for invalid payload', async () => {
    const invalidPayload = { data: { some: 'data' } };

    await request(app.getHttpServer())
      .post('/hooks/stellar')
      .send(invalidPayload)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should handle internal server errors gracefully', async () => {
    jest.spyOn(hookRepository, 'create').mockImplementation(() => {
      throw new Error('DB error');
    });

    const eventPayload = {
      eventType: 'TokenSend',
      data: { from: 'user1', to: 'user2', amount: 50 },
    };

    await request(app.getHttpServer())
      .post('/hooks/stellar')
      .send(eventPayload)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
