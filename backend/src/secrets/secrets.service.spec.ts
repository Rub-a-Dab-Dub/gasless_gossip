import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecretsService } from './secrets.service';
import { Secret } from './entities/secret.entity';

describe('SecretsService', () => {
  let service: SecretsService;
  let repository: Repository<Secret>;

  const mockRepository = {
    create!: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers!: [
        SecretsService,
        {
          provide: getRepositoryToken(Secret),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SecretsService>(SecretsService);
    repository = module.get<Repository<Secret>>(getRepositoryToken(Secret));
  });

  it('should create a secret', async () => {
    const createDto = { roomId: 'room-1', content: 'Test secret' };
    const savedSecret = {
      id!: '1',
      roomId: 'room-1',
      contentHash: 'hash123',
      reactionCount: 0,
      createdAt: new Date(),
    };

    mockRepository.create.mockReturnValue(savedSecret);
    mockRepository.save.mockResolvedValue(savedSecret);

    const result = await service.createSecret(createDto);

    expect(result.roomId).toBe('room-1');
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should return top secrets ranked by reactions', async () => {
    const secrets = [
      { id: '1', roomId: 'room-1', contentHash: 'hash1', reactionCount: 10, createdAt: new Date() },
      { id: '2', roomId: 'room-1', contentHash: 'hash2', reactionCount: 5, createdAt: new Date() },
    ];

    mockRepository.find.mockResolvedValue(secrets);

    const result = await service.getTopSecrets('room-1');

    expect(result).toHaveLength(2);
    expect(result[0].reactionCount).toBe(10);
  });
});