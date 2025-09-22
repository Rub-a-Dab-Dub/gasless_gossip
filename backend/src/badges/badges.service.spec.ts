import { Test, TestingModule } from '@nestjs/testing';
import { BadgesService } from './badges.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StellarService } from 'src/stellar/stellar.service';
import { Badge } from './entities/badge.entity';

describe('BadgesService', () => {
  let service: BadgesService;
  let stellarService: StellarService;
  let badgeRepo: any;

  beforeEach(async () => {
    badgeRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };
    stellarService = { mintBadgeToken: jest.fn() } as any;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BadgesService,
        { provide: getRepositoryToken(Badge), useValue: badgeRepo },
        { provide: StellarService, useValue: stellarService },
      ],
    }).compile();
    service = module.get<BadgesService>(BadgesService);
  });

  it('assigns a badge and mints token', async () => {
    const dto = { userId: 1, type: 'Lord of the Leaks', metadata: {} };
    badgeRepo.create.mockReturnValue(dto);
    badgeRepo.save.mockResolvedValue(dto);
    await service.assignBadge(dto);
    expect(stellarService.mintBadgeToken).toHaveBeenCalledWith(
      1,
      'Lord of the Leaks',
      {},
    );
    expect(badgeRepo.save).toHaveBeenCalledWith(dto);
  });

  it('retrieves badges by user', async () => {
    badgeRepo.find.mockResolvedValue([
      { id: 1, userId: 1, type: 'Lord of the Leaks', metadata: {} },
    ]);
    const badges = await service.getBadgesByUser(1);
    expect(badges).toHaveLength(1);
    expect(badges[0].type).toBe('Lord of the Leaks');
  });
});
