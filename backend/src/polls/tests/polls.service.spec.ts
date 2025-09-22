import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PollsService } from '../services/polls.service';
import { Poll } from '../entities/poll.entity';
import { PollVote } from '../entities/poll-vote.entity';

describe('PollsService', () => {
  let service: PollsService;
  const pollRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn() };
  const voteRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn() };
  const roomAccess = { verifyRoomAccess: jest.fn(), verifyRoomAdmin: jest.fn() };
  const usersService = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollsService,
        { provide: getRepositoryToken(Poll), useValue: pollRepo },
        { provide: getRepositoryToken(PollVote), useValue: voteRepo },
        { provide: 'RoomAccessService', useValue: roomAccess },
        { provide: 'UsersService', useValue: usersService },
      ],
    }).compile();

    service = module.get<PollsService>(PollsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});


