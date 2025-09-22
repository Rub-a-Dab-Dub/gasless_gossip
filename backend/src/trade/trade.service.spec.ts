import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Trade } from './entities/trade.entity';
import { Repository } from 'typeorm';
import { TradesService } from './trade.service';

describe('TradesService', () => {
  let service: TradesService;
  let repo: Repository<Trade>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers!: [
        TradesService,
        { provide: getRepositoryToken(Trade), useClass: Repository },
      ],
    }).compile();

    service = module.get<TradesService>(TradesService);
    repo = module.get<Repository<Trade>>(getRepositoryToken(Trade));
  });

  it('should propose a trade', async () => {
    const dto = { offerId: 'uuid-offer' };
    jest.spyOn(repo, 'create').mockReturnValue(dto as any);
    jest.spyOn(repo, 'save').mockResolvedValue({ id: '1', ...dto } as any);

    const result = await service.proposeTrade(dto);
    expect(result.offerId).toBe(dto.offerId);
  });
});
