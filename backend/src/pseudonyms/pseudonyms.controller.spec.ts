import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PseudonymsModule } from './pseudonyms.module';
import { Pseudonym } from './entities/pseudonym.entity';

describe('PseudonymsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Pseudonym],
          synchronize: true,
        }),
        PseudonymsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /pseudonyms/set creates and GET /pseudonyms/:roomId retrieves', async () => {
    const roomId = '00000000-0000-0000-0000-000000000001';
    const userIdA = '00000000-0000-0000-0000-0000000000aa';
    const userIdB = '00000000-0000-0000-0000-0000000000bb';

    await request(app.getHttpServer())
      .post('/pseudonyms/set')
      .send({ roomId, userId: userIdA, pseudonym: 'Shadow Fox' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/pseudonyms/set')
      .send({ roomId, userId: userIdB, pseudonym: 'Neon Oracle' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get(`/pseudonyms/${roomId}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    const names = res.body.map((r: any) => r.pseudonym).sort();
    expect(names).toEqual(['Neon Oracle', 'Shadow Fox']);
  });

  it('enforces uniqueness per room', async () => {
    const roomId = '00000000-0000-0000-0000-000000000002';
    const userIdA = '00000000-0000-0000-0000-0000000000aa';
    await request(app.getHttpServer())
      .post('/pseudonyms/set')
      .send({ roomId, userId: userIdA, pseudonym: 'Night Whisper' })
      .expect(201);

    // same pseudonym different user in same room should fail 409 due to unique
    const conflict = await request(app.getHttpServer())
      .post('/pseudonyms/set')
      .send({ roomId, userId: '00000000-0000-0000-0000-0000000000cc', pseudonym: 'Night Whisper' });

    expect([400, 409]).toContain(conflict.status);
  });
});


