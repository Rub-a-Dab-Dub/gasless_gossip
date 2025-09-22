// src/gambles/gambles.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { GamblesService } from './gambles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Gamble } from './entities/gamble.entity';
import { Repository } from 'typeorm';
import { CreateGambleDto } from './dto/create-gamble.dto';
import { ResolveGambleDto } from './dto/resolve-gamble.dto';

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('GamblesService', () => {
  let service: GamblesService;
  let repo: MockRepo<Gamble>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamblesService,
        {
          provide: getRepositoryToken(Gamble),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GamblesService>(GamblesService);
    repo = module.get(getRepositoryToken(Gamble));
  });

  it('should create a new gamble if none exists', async () => {
    const dto: CreateGambleDto = {
      gossipId: 'gossip-1',
      userId: 'user-1',
      amount: 100,
      choice: 'truth',
      txId: 'tx123',
    };

    repo.findOne.mockResolvedValue(null);
    repo.create.mockReturnValue(dto as any);
    repo.save.mockResolvedValue({ id: '1', ...dto });

    const result = await service.create(dto);

    expect(result).toMatchObject({ gossipId: 'gossip-1', bets: [expect.any(Object)] });
    expect(repo.save).toHaveBeenCalled()
