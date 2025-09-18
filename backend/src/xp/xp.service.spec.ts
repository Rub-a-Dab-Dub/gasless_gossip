import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Xp } from './xp.entity';
import { XpService } from './xp.service';
import { ProcessedEvent } from './processed-event.entity';
import { StellarAccount } from './stellar-account.entity';

describe('XpService', () => {
  let service: XpService;
  let repo: Repository<Xp>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        XpService,
        {
          provide: getRepositoryToken(Xp),
            useValue: {
              findOne: jest.fn(),
              create: jest.fn().mockImplementation((v) => v),
              save: jest.fn().mockImplementation((v) => Promise.resolve(v)),
            },
        },
          {
            provide: getRepositoryToken(StellarAccount),
            useValue: {
              findOne: jest.fn().mockResolvedValue(null),
            },
          },
          {
            provide: getRepositoryToken(ProcessedEvent),
            useValue: {
              findOne: jest.fn(),
              save: jest.fn().mockImplementation((v) => Promise.resolve(v)),
            },
          },
          {
            provide: require('typeorm').DataSource,
            useValue: {
              transaction: jest.fn().mockImplementation(async (cb) => cb({
                findOne: jest.fn().mockResolvedValue(null),
                create: jest.fn().mockImplementation((v) => v),
                save: jest.fn().mockImplementation((v) => Promise.resolve(v)),
              })),
            },
          },
          {
            provide: 'DataSource',
            useValue: {
              transaction: jest.fn().mockImplementation(async (cb) => cb({
                findOne: jest.fn().mockResolvedValue(null),
                create: jest.fn().mockImplementation((v) => v),
                save: jest.fn().mockImplementation((v) => Promise.resolve(v)),
              })),
            },
          },
      ],
    }).compile();

    service = module.get<XpService>(XpService);
    repo = module.get<Repository<Xp>>(getRepositoryToken(Xp));
  });

  it('adds xp via processStellarEvent', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(null);
    const res = await service.processStellarEvent({
      type: 'message',
      userId: '00000000-0000-0000-0000-000000000000',
    });
    expect(res).toBeDefined();
    expect((repo.save as jest.Mock).mock.calls.length).toBeGreaterThan(0);
  });

  it('handleEvent is idempotent', async () => {
    // create a fresh module where the transaction mock simulates processed event exists on second call
    const processedFind = jest.fn()
      .mockResolvedValueOnce(null) // first call: not processed
      .mockResolvedValueOnce({ eventId: 'evt-1' }); // second call: processed

    let processedChecks = 0;
    const managerSpy = {
      findOne: jest.fn().mockImplementation(async (entityOrOptions: any, maybeOptions?: any) => {
        // TypeORM manager.findOne(entity, { where: {...} }) signature
        const options = maybeOptions ?? (entityOrOptions && entityOrOptions.where ? entityOrOptions : undefined);
        if (options && options.where && Object.prototype.hasOwnProperty.call(options.where, 'eventId')) {
          processedChecks += 1;
          return processedChecks === 1 ? null : { eventId: 'evt-1' };
        }
        if (options && options.where && Object.prototype.hasOwnProperty.call(options.where, 'userId')) {
          return null; // simulate no xp row
        }
        return null;
      }),
      create: jest.fn().mockImplementation((v) => v),
      save: jest.fn().mockImplementation((v) => Promise.resolve(v)),
    };

    const dataSourceMock = {
      transaction: jest.fn().mockImplementation(async (cb) => cb(managerSpy)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        XpService,
        {
          provide: getRepositoryToken(Xp),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockImplementation((v) => v),
            save: jest.fn().mockImplementation((v) => Promise.resolve(v)),
          },
        },
        {
          provide: getRepositoryToken(ProcessedEvent),
          useValue: {
            findOne: processedFind,
            save: jest.fn().mockImplementation((v) => Promise.resolve(v)),
          },
        },
        {
          provide: getRepositoryToken(StellarAccount),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: require('typeorm').DataSource,
          useValue: dataSourceMock,
        },
      ],
    }).compile();

    const svc = module.get<XpService>(XpService);
    const xpRepoMock = module.get(getRepositoryToken(Xp));

    // first handling should process and call save
    await svc.handleEvent({ eventId: 'evt-1', type: 'message', userId: 'u-1' });
    const callsAfterFirst = (managerSpy.save as jest.Mock).mock.calls.length;

    // second handling should be skipped due to processed event
    await svc.handleEvent({ eventId: 'evt-1', type: 'message', userId: 'u-1' });
    const callsAfterSecond = (managerSpy.save as jest.Mock).mock.calls.length;

    // no additional saves should have happened on duplicate event
    expect(callsAfterSecond).toBe(callsAfterFirst);
  });

  it('awards XP to mapped internal userId when Stellar account is mapped', async () => {
    const savedItems: any[] = [];
    const managerSpy = {
      findOne: jest.fn().mockImplementation(async (entityOrOptions: any, maybeOptions?: any) => {
        const options = maybeOptions ?? (entityOrOptions && entityOrOptions.where ? entityOrOptions : undefined);
        if (options && options.where && Object.prototype.hasOwnProperty.call(options.where, 'eventId')) {
          return null;
        }
        if (options && options.where && Object.prototype.hasOwnProperty.call(options.where, 'userId')) {
          return null; // simulate no xp row exists for internal user
        }
        return null;
      }),
      create: jest.fn().mockImplementation((v) => v),
  save: jest.fn().mockImplementation((...args: any[]) => { const v = args[args.length - 1]; savedItems.push(v); return Promise.resolve(v); }),
    };

    const dataSourceMock = { transaction: jest.fn().mockImplementation(async (cb) => cb(managerSpy)) };

    const mappedStellarAccount = { stellarAccount: 'GABC', userId: 'internal-123' };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        XpService,
        {
          provide: getRepositoryToken(Xp),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockImplementation((v) => v),
            save: jest.fn().mockImplementation((v) => Promise.resolve(v)),
          },
        },
        {
          provide: getRepositoryToken(ProcessedEvent),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            save: jest.fn().mockImplementation((v) => Promise.resolve(v)),
          },
        },
        {
          provide: getRepositoryToken(StellarAccount),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mappedStellarAccount),
          },
        },
        {
          provide: require('typeorm').DataSource,
          useValue: dataSourceMock,
        },
      ],
    }).compile();

    const svc = module.get<XpService>(XpService);

  // handle an event where userId is the Stellar account 'GABC'
  const res = await svc.handleEvent({ eventId: 'evt-xyz', type: 'message', userId: 'GABC' });

    // the service should have created an XP row for the mapped internal user id
  expect(managerSpy.create).toHaveBeenCalled();
    const createdCallHasInternal = (managerSpy.create as jest.Mock).mock.calls.some((call: any[]) => {
      const maybeObj = call[1];
      return maybeObj && maybeObj.userId === 'internal-123';
    });
    expect(createdCallHasInternal).toBe(true);
  });
});
