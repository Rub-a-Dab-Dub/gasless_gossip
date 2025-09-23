
import { Test, TestingModule } from '@nestjs/testing';
import { RoomTagsController } from './room-tags.controller';
import { RoomTagsService } from './room-tags.service';
import { AuthGuard } from '../auth/auth.guard';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('RoomTagsController', () => {
  let controller: RoomTagsController;
  let service: RoomTagsService;

  const mockRoomTagsService = {
    createRoomTag: jest.fn(),
    createMultipleRoomTags: jest.fn(),
    deleteRoomTag: jest.fn(),
    getRoomTags: jest.fn(),
    searchRoomsByTag: jest.fn(),
    searchRoomsByMultipleTags: jest.fn(),
    getPopularTags: jest.fn(),
    getAllTags: jest.fn(),
  };

  const mockRequest = {
    user: { id: 'user-1' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomTagsController],
      providers: [
        {
          provide: RoomTagsService,
          useValue: mockRoomTagsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RoomTagsController>(RoomTagsController);
    service = module.get<RoomTagsService>(RoomTagsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createRoomTag', () => {
    it('should create a room tag', async () => {
      const createDto = { roomId: 'room-id-1', tagName: 'gossip' };
      const expectedResult = { id: 'tag-id-1', ...createDto };

      mockRoomTagsService.createRoomTag.mockResolvedValue(expectedResult);

      const result = await controller.createRoomTag(mockRequest, createDto);

      expect(result).toEqual(expectedResult);
      expect(service.createRoomTag).toHaveBeenCalledWith(createDto, 'user-1');
    });
  });

  describe('searchRoomsByTag', () => {
    it('should return rooms with the specified tag', async () => {
      const expectedResult = {
        rooms: [
          {
            id: 'room-id-1',
            name: 'Test Room',
            tags: ['gossip'],
            memberCount: 5,
          },
        ],
        total: 1,
      };

      mockRoomTagsService.searchRoomsByTag.mockResolvedValue(expectedResult);

      const result = await controller.searchRoomsByTag('gossip', 10, 0);

      expect(result).toEqual(expectedResult);
      expect(service.searchRoomsByTag).toHaveBeenCalledWith({
        tag: 'gossip',
        limit: 10,
        offset: 0,
      });
    });
  });

  describe('getPopularTags', () => {
    it('should return popular tags', async () => {
      const expectedResult = [
        { tagName: 'gossip', roomCount: 10 },
        { tagName: 'degen', roomCount: 8 },
        { tagName: 'crypto', roomCount: 6 },
      ];

      mockRoomTagsService.getPopularTags.mockResolvedValue(expectedResult);

      const result = await controller.getPopularTags(20);

      expect(result).toEqual(expectedResult);
      expect(service.getPopularTags).toHaveBeenCalledWith(20);
    });
  });
});