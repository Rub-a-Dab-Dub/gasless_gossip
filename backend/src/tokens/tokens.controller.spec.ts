import { Test, TestingModule } from '@nestjs/testing';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

describe('TokensController', () => {
  let controller: TokensController;

  const serviceMock = {
    send!: jest.fn(async () => ({ hash: 'abc', ledger: 1, successful: true })),
    history: jest.fn(async () => []),
  } as unknown as TokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers!: [TokensController],
      providers: [{ provide: TokensService, useValue: serviceMock }],
    }).compile();

    controller = module.get<TokensController>(TokensController);
  });

  it('should call service.send for POST /tokens/send', async () => {
    const dto = { fromId: 'A', toId: 'B', amount: '1.5' } as any;
    const res = await controller.send(dto);
    expect(res).toEqual({ hash: 'abc', ledger: 1, successful: true });
  });

  it('should call service.history for GET /tokens/history/:userId', async () => {
    const res = await controller.history('user-1');
    expect(res).toEqual({ userId: 'user-1', entries: [] });
  });
});
