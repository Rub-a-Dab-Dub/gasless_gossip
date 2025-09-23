import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardVotingModule } from './reward-voting.module';
import { RewardVote } from './reward-vote.entity';

describe('RewardVotingController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [RewardVote],
          synchronize: true,
        }),
        RewardVotingModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /rewards/vote and GET /rewards/results', async () => {
    const rewardId = '00000000-0000-0000-0000-0000000000aa';
    const userA = '00000000-0000-0000-0000-0000000000a1';
    const userB = '00000000-0000-0000-0000-0000000000b1';

    await request(app.getHttpServer())
      .post('/rewards/vote')
      .send({ rewardId, userId: userA, voteWeight: 10 })
      .expect(201);

    await request(app.getHttpServer())
      .post('/rewards/vote')
      .send({ rewardId, userId: userB, voteWeight: 20 })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/rewards/results')
      .query({ rewardId })
      .expect(200);

    expect(res.body.rewardId).toBe(rewardId);
    expect(res.body.totalWeight).toBe(30);
    expect(res.body.votes.length).toBe(2);
  });
});


