import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

const mockRepository = {
  findOne!: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers!: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto = {
        username!: 'testuser',
        email: 'test@example.com',
        pseudonym: 'Test Whisper',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(createUserDto);
      mockRepository.save.mockResolvedValue({ id: '1', ...createUserDto });

      const result = await service.create(createUserDto);

      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result.id).toBe('1');
    });

    it('should throw ConflictException if username exists', async () => {
      const createUserDto = {
        username!: 'testuser',
        email: 'test@example.com',
        pseudonym: 'Test Whisper',
      };

      mockRepository.findOne.mockResolvedValue({ id: '1' });

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('linkStellarAccount', () => {
    it('should throw BadRequestException for invalid Stellar account', async () => {
      const userId = '1';
      const invalidStellarId = 'invalid-stellar-id';

      await expect(
        service.linkStellarAccount(userId, invalidStellarId),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
