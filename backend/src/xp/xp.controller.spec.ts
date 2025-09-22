import { Test, TestingModule } from '@nestjs/testing';
import { XpController } from './xp.controller';
import { XpService } from './xp.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StellarAccount } from './stellar-account.entity';

describe('XpController', () => {
  let controller: XpController;

  beforeEach(async () => {
    const mockXpService = {
      getXpForUser!: jest.fn().mockResolvedValue(42),
      addXp: jest.fn().mockResolvedValue({ userId: 'u-1', xpValue: 50 }),
      handleEvent: jest.fn().mockResolvedValue({ userId: 'u-1', xpValue: 5 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers!: [XpController],
      providers: [
        { provide: XpService, useValue: mockXpService },
        {
          provide: getRepositoryToken(StellarAccount),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockImplementation((v) => v),
            save: jest.fn().mockImplementation((v) => Promise.resolve(v)),
          },
        },
      ],
    }).compile();

    controller = module.get<XpController>(XpController);
  });

  it('GET /xp/:userId returns xp', async () => {
    const res = await controller.getXp('u-1');
    expect(res).toEqual({ userId: 'u-1', xp: 42 });
  });

  it('POST /xp/add calls service and returns xp', async () => {
    const body = { userId: 'u-1', amount: 8 } as any;
    const res = await controller.addXp(body);
    expect(res).toEqual({ userId: 'u-1', xp: 42 });
  });

  it('POST /xp/map-account upserts mapping', async () => {
    const repo: any = (controller as any).stellarAccountRepo;
    (repo.findOne as jest.Mock).mockResolvedValueOnce(null);
    const body = { stellarAccount: 'GXXX', userId: 'u-1' } as any;
    const res = await controller.mapAccount(body);
    expect(res).toHaveProperty('stellarAccount', 'GXXX');
    expect(res).toHaveProperty('userId', 'u-1');
  });
});
