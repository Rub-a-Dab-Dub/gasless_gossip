import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { Session } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';

const mockRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    delete: jest.fn(() => ({
      where: jest.fn(() => ({
        execute: jest.fn(),
      })),
    })),
  })),
};

describe('SessionsService', () => {
  let service: SessionsService;
  let repository: Repository<Session>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: getRepositoryToken(Session),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    repository = module.get<Repository<Session>>(getRepositoryToken(Session));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a session successfully', async () => {
      const createSessionDto: CreateSessionDto = {
        userId: 'user1',
        token: 'jwt-token',
        expiresAt: new Date(),
      };

      mockRepository.create.mockReturnValue(createSessionDto);
      mockRepository.save.mockResolvedValue({ id: '1', ...createSessionDto });

      const result = await service.create(createSessionDto);

      expect(repository.create).toHaveBeenCalledWith(createSessionDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result.id).toBe('1');
    });
  });

  describe('findByUserId', () => {
    it('should return sessions for user', async () => {
      const sessions = [
        { id: '1', userId: 'user1', token: 'token1', createdAt: new Date(), expiresAt: new Date() },
      ];
      mockRepository.find.mockResolvedValue(sessions);

      const result = await service.findByUserId('user1');

      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('revoke', () => {
    it('should revoke session successfully', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.revoke('1');

      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if session not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.revoke('1')).rejects.toThrow(NotFoundException);
    });
  });
});