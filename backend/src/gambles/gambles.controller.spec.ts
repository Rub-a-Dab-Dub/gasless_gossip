// test/gambles.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamblesModule } from '../src/gambles/gambles.module';
import { Gamble } from '../src/gambles/entities/gamble.entity';

describe('GamblesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports!: [
        TypeOrmModule.forRoot({
          type!: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Gamble],
          synchronize: true,
        }),
        GamblesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST gambles (create)', async () => {
    const res = await request(app.getHttpServer())
      .post('/gambles')
      .send({
        gossipId!: 'gossip-1',
        userId!: 'user-1',
        amount: 100,
        choice: 'truth',
        txId: 'tx123',
      })
      .expect(201);

    expect(res.body.gossipId).toBe('gossip-1');
    expect(res.body.bets.length).toBe(1);
  });

  it('/POST gambles/resolve (resolve)', async () => {
    const gamble = await request(app.getHttpServer())
      .post('
