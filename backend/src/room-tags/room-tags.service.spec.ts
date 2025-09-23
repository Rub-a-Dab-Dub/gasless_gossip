
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomTagsService } from './room-tags.service';
import { RoomTag } from './entities/room-tag.entity';
import { Room, RoomType } from '../rooms/entities/room.entity';
import { RoomMembership, MembershipRole } from '../rooms/entities/room-membership.entity';
import { NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';

describe('RoomTagsService', () => {
  let service: RoomTagsService;
  let roomTagRepository: Repository<RoomTag>;
  let roomRepository: Repository<Room>;
  let membershipRepository: Repository<RoomMembership>;

  const mockRoom: Room = {
    id: 'room-id-1',
    name: 'Test Room',
    description: 'A test room',
    type: RoomType.PUBLIC,
    maxMembers: 100,
    createdBy: 'user-1',
    isActive: true,
    minLevel: 1,
    minXp: 0,
    memberships: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRoomTag: RoomTag = {
    id: 'tag-id-1',
    roomId: 'room-id-1',
    tagName: 'gossip',
    createdBy: 'user-1',
    room: mockRoom,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomTagsService,
        {
          provide: getRepositoryToken(RoomTag),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              innerJoin: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              groupBy: jest.fn().mockReturnThis(),
              having: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              addOrderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn(),
              getRawMany: jest.fn(),
            })),
          },
        },
        {
          provide: getRepositoryToken(Room),
          useValue: {
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              innerJoin: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              groupBy: jest.fn().mockReturnThis(),
              having: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn(),
            })),
          },
        },
        {
          provide: getRepositoryToken(RoomMembership),
          useValue: {
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              groupBy: jest.fn().mockReturnThis(),
              getRawMany: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<RoomTagsService>(RoomTagsService);
    roomTagRepository = module.get<Repository<RoomTag>>(getRepositoryToken(RoomTag));
    roomRepository = module.get<Repository<Room>>(getRepositoryToken(Room));
    membershipRepository = module.get<Repository<RoomMembership>>(getRepositoryToken(RoomMembership));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRoomTag', () => {
    it('should successfully create a room tag', async () => {
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(mockRoom);
      jest.spyOn(membershipRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(roomTagRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(roomTagRepository, 'count').mockResolvedValue(5);
      jest.spyOn(roomTagRepository, 'create').mockReturnValue(mockRoomTag);
      jest.spyOn(roomTagRepository, 'save').mockResolvedValue(mockRoomTag);

      const result = await service.createRoomTag(
        { roomId: 'room-id-1', tagName: 'gossip' },
        'user-1',
      );

      expect(result).toEqual(mockRoomTag);
      expect(roomTagRepository.save).toHaveBeenCalledWith(mockRoomTag);
    });

    it('should throw NotFoundException if room does not exist', async () => {
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.createRoomTag(
          { roomId: 'nonexistent-room', tagName: 'gossip' },
          'user-1',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not room creator', async () => {
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue({
        ...mockRoom,
        createdBy: 'other-user',
      });
      jest.spyOn(membershipRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.createRoomTag(
          { roomId: 'room-id-1', tagName: 'gossip' },
          'user-1',
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ConflictException if tag already exists', async () => {
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(mockRoom);
      jest.spyOn(membershipRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(roomTagRepository, 'findOne').mockResolvedValue(mockRoomTag);

      await expect(
        service.createRoomTag(
          { roomId: 'room-id-1', tagName: 'gossip' },
          'user-1',
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('searchRoomsByTag', () => {
    it('should return rooms with the specified tag', async () => {
      const mockQueryBuilder = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockRoom], 1]),
      };

      jest.spyOn(roomRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
      jest.spyOn(roomTagRepository, 'find').mockResolvedValue([mockRoomTag]);
      jest.spyOn(membershipRepository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([{ roomId: 'room-id-1', memberCount: '5' }]),
      } as any);

      const result = await service.searchRoomsByTag({ tag: 'gossip' });

      expect(result.rooms).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.rooms[0].tags).toContain('gossip');
    });
  });

  describe('deleteRoomTag', () => {
    it('should successfully delete a room tag', async () => {
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(mockRoom);
      jest.spyOn(membershipRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(roomTagRepository, 'findOne').mockResolvedValue(mockRoomTag);
      jest.spyOn(roomTagRepository, 'remove').mockResolvedValue(mockRoomTag);

      const result = await service.deleteRoomTag(
        { roomId: 'room-id-1', tagName: 'gossip' },
        'user-1',
      );

      expect(result.success).toBe(true);
      expect(roomTagRepository.remove).toHaveBeenCalledWith(mockRoomTag);
    });

    it('should throw NotFoundException if tag does not exist', async () => {
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(mockRoom);
      jest.spyOn(membershipRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(roomTagRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.deleteRoomTag(
          { roomId: 'room-id-1', tagName: 'nonexistent' },
          'user-1',
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});