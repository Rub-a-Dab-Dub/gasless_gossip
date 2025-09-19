import { Test, TestingModule } from '@nestjs/testing';
import { TokensService } from './tokens.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TokenTransaction } from './token-transaction.entity';
import { Repository } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('TokensService', () => {
  let service: TokensService;
  let repo: Repository<TokenTransaction>;

  const repoMock = {
    create: jest.fn((d) => d),
    save: jest.fn(async (d) => d),
    find: jest.fn(async () => []),
  } as unknown as Repository<TokenTransaction>;

  const serverSubmitMock = jest.fn(async () => ({ hash: 'hash123', ledger: 1 }));
  const loadAccountMock = jest.fn(async () => ({}));
  const fetchBaseFeeMock = jest.fn(async () => 100);
  const txBuilderMock = {
    addOperation: jest.fn().mockReturnThis(),
    setTimeout: jest.fn().mockReturnThis(),
    build: jest.fn(() => ({ sign: jest.fn() })),
  };

  beforeAll(() => {
    // Minimal Stellar SDK shape
    jest.mock('stellar-sdk', () => ({
      Server: jest.fn().mockImplementation(() => ({
        submitTransaction: serverSubmitMock,
        loadAccount: loadAccountMock,
        fetchBaseFee: fetchBaseFeeMock,
      })),
      Networks: { TESTNET: 'Test SDF Network ; September 2015' },
      Asset: class { static native() { return 'XLM'; } constructor(public code: string, public issuer: string) {} },
      Operation: { payment: jest.fn((o) => o) },
      TransactionBuilder: jest.fn().mockImplementation(() => txBuilderMock),
      Keypair: { fromSecret: jest.fn(() => ({ publicKey: () => 'GABC' })) },
    }), { virtual: true });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => ({ STELLAR_SENDER_SECRET: 'SABC' })] })],
      providers: [
        TokensService,
        ConfigService,
        { provide: getRepositoryToken(TokenTransaction), useValue: repoMock },
      ],
    }).compile();

    service = module.get<TokensService>(TokensService);
    repo = module.get(getRepositoryToken(TokenTransaction));
  });

  it('sends token and logs tx', async () => {
    const res = await service.send({ fromId: 'A', toId: 'B', amount: '2.0000001' });
    expect(res.successful).toBe(true);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('returns history', async () => {
    const list = await service.history('A');
    expect(Array.isArray(list)).toBe(true);
  });
});


