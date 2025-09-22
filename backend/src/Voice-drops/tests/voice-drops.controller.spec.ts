import { Test, TestingModule } from '@nestjs/testing';
import { VoiceDropsController } from '../controllers/voice-drops.controller';
import { VoiceDropsService } from '../services/voice-drops.service';

describe('VoiceDropsController', () => {
  let controller: VoiceDropsController;
  let service: VoiceDropsService;

  const mockVoiceDropsService = {
    createVoiceDrop: jest.fn(),
    getVoiceDropsByRoom: jest.fn(),
    getVoiceDropById: jest.fn(),
    deleteVoiceDrop: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoiceDropsController],
      providers: [
        {
          provide: VoiceDropsService,
          useValue: mockVoiceDropsService,
        },
      ],
    }).compile();

    controller = module.get<VoiceDropsController>(VoiceDropsController);
    service = module.get<VoiceDropsService>(VoiceDropsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createVoiceDrop', () => {
    it('should create a voice drop', async () => {
      const createDto = {
        roomId: 'room-uuid',
        duration: 60,
        fileSize: 1024,
        fileName: 'test.mp3',
        mimeType: 'audio/mpeg',
      };

      const audioFile = {
        originalname: 'test.mp3',
        mimetype: 'audio/mpeg',
        size: 1024,
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const expectedResult = {
        id: 'voice-drop-uuid',
        roomId: createDto.roomId,
        audioHash: 'ipfs-hash',
        stellarHash: 'stellar-hash',
        creatorId: 'mock-user-id',
        fileName: createDto.fileName,
        duration: createDto.duration,
        fileSize: createDto.fileSize,
        mimeType: createDto.mimeType,
        audioUrl: 'https://ipfs.io/ipfs/ipfs-hash',
        createdAt: new Date(),
      };

      mockVoiceDropsService.createVoiceDrop.mockResolvedValue(expectedResult);

      const result = await controller.createVoiceDrop(createDto, audioFile);

      expect(result).toEqual(expectedResult);
      expect(mockVoiceDropsService.createVoiceDrop).toHaveBeenCalledWith(
        createDto,
        audioFile,
        'mock-user-id'
      );
    });
  });

  describe('getVoiceDropsByRoom', () => {
    it('should return voice drops for a room', async () => {
      const roomId = 'room-uuid';
      const query = { page: 1, limit: 20 };

      const expectedResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 20,
      };

      mockVoiceDropsService.getVoiceDropsByRoom.mockResolvedValue(expectedResult);

      const result = await controller.getVoiceDropsByRoom(roomId, query);

      expect(result).toEqual(expectedResult);
      expect(mockVoiceDropsService.getVoiceDropsByRoom).toHaveBeenCalledWith(
        roomId,
        query,
        'mock-user-id'
      );
    });
  });
});
