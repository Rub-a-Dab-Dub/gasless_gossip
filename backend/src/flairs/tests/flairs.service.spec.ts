import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlairsService } from '../flairs.service';
import { Flair } from '../entities/flair.entity';

describe('FlairsService', () => {
  let service: FlairsService;
  let repo: Repository<Flair>;
  const repoMock = {
    create: jest.fn((d) => d),
    save: jest.fn(async (d) => ({ id: 'f1', createdAt: new Date(), updatedAt: new Date(), ...d })),
    find: jest.fn(async () => []),
  } as any;
  const stellarMock = {
    verifyTokenOwnership: jest.fn(async () => true),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FlairsService,
        { provide: getRepositoryToken(Flair), useValue: repoMock },
        { provide: require('../../stellar/stellar.service').StellarService, useValue: stellarMock },
      ],
    }).compile();
    service = moduleRef.get(FlairsService);
    repo = moduleRef.get(getRepositoryToken(Flair));
  });

  it('adds a basic flair', async () => {
    const result = await service.addFlairForUser('u1', { flairType: 'emoji:🔥', metadata: { color: '#f00' } });
    expect(result.userId).toBe('u1');
    expect(repoMock.save).toHaveBeenCalled();
  });

  it('verifies premium flair via Stellar', async () => {
    await service.addFlairForUser('u2', { flairType: 'premium:gold-crown' });
    expect(stellarMock.verifyTokenOwnership).toHaveBeenCalledWith('u2', 'gold-crown');
  });
});


